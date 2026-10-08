require('dotenv').config();
const fastify = require('fastify')({ logger: true });
const fastifyJwt = require('@fastify/jwt');
const fastifyCors = require('@fastify/cors');
const fastifyHelmet = require('@fastify/helmet');
const fastifyRateLimit = require('@fastify/rate-limit');
const socketio = require('fastify-socket.io');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

// PostgreSQL Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://user:pass@localhost:5432/gaushala_db'
});

// Plugins
fastify.register(fastifyHelmet);
fastify.register(fastifyCors, { origin: process.env.CORS_ORIGIN || '*' });
fastify.register(fastifyRateLimit, {
  max: 100,
  timeWindow: '1 minute'
});
fastify.register(fastifyJwt, { secret: process.env.JWT_SECRET || 'supersecret' });
fastify.register(socketio, { cors: { origin: process.env.CORS_ORIGIN || '*' } });

// --- AUTHENTICATION & HOOKS ---
fastify.decorate('authenticate', async function (request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.code(401).send({ error: 'Unauthorized', message: err.message });
  }
});

const requireRole = (roles) => {
  return async (request, reply) => {
    if (!roles.includes(request.user.role)) {
      reply.code(403).send({ error: 'Forbidden', message: 'Insufficient role permissions' });
    }
  };
};

// --- WEBSOCKETS (SOCKET.IO) ---
fastify.ready(err => {
  if (err) throw err;
  fastify.io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error'));
    fastify.jwt.verify(token, (err, decoded) => {
      if (err) return next(new Error('Authentication error'));
      socket.user = decoded;
      
      // Join rooms based on role for scoped alerts
      if (decoded.role === 'MANAGER') socket.join(`gaushala:${decoded.gaushala_id}`);
      else if (decoded.role === 'SUB_ADMIN') socket.join(`zone:${decoded.zone}`);
      else if (decoded.role === 'ADMIN') socket.join('admin');
      
      next();
    });
  });

  fastify.io.on('connection', (socket) => {
    fastify.log.info(`Socket connected: ${socket.id} (User: ${socket.user.username})`);
  });
});

const emitScopedAlert = (alertMsg, gaushalaId, zone) => {
  // Emit to Manager of that Gaushala, Sub-Admin of that zone, and Admins
  fastify.io.to(`gaushala:${gaushalaId}`).to(`zone:${zone}`).to('admin').emit('new_alert', alertMsg);
};

// --- API ROUTES ---

// 1. Auth: Login
fastify.post('/api/auth/login', async (request, reply) => {
  const { username, password } = request.body;
  const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  if (rows.length === 0) return reply.code(401).send({ error: 'Invalid credentials' });
  
  const user = rows[0];
  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) return reply.code(401).send({ error: 'Invalid credentials' });

  const token = fastify.jwt.sign({ id: user.id, username: user.username, role: user.role, gaushala_id: user.gaushala_id, zone: user.zone });
  return { token, user: { id: user.id, username: user.username, role: user.role, gaushala_id: user.gaushala_id } };
});

// 2. Admin: Get Overview
fastify.get('/api/admin/overview', { preHandler: [fastify.authenticate, requireRole(['ADMIN'])] }, async (request, reply) => {
  const { rows } = await pool.query('SELECT COUNT(*) as total_gaushalas FROM gaushalas');
  const cattle = await pool.query("SELECT COUNT(*) as total_cattle FROM cattle WHERE status='ACTIVE'");
  return { total_gaushalas: rows[0].total_gaushalas, total_verified_cattle: cattle.rows[0].total_cattle, status: 'success' };
});

// 3. Manager: Get Gaushala Dashboard (Row-Level Scoped)
fastify.get('/api/manager/dashboard', { preHandler: [fastify.authenticate, requireRole(['MANAGER'])] }, async (request, reply) => {
  const gaushalaId = request.user.gaushala_id;
  const { rows } = await pool.query('SELECT * FROM gaushalas WHERE id = $1', [gaushalaId]);
  const cattle = await pool.query("SELECT COUNT(*) as total_cattle FROM cattle WHERE gaushala_id = $1 AND status='ACTIVE'", [gaushalaId]);
  return { gaushala: rows[0], total_cattle: cattle.rows[0].total_cattle };
});

// 4. Admin: Approve Grant (With Audit Trail)
fastify.post('/api/admin/grants/approve', { preHandler: [fastify.authenticate, requireRole(['ADMIN'])] }, async (request, reply) => {
  const { grant_id, transaction_id } = request.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query("UPDATE grants SET status='APPROVED', transaction_id=$1 WHERE id=$2 RETURNING *", [transaction_id, grant_id]);
    
    // Audit Log
    await client.query(
      "INSERT INTO audit_log (user_id, action, table_name, record_id, new_data, ip_address) VALUES ($1, $2, $3, $4, $5, $6)",
      [request.user.id, 'GRANT_APPROVED', 'grants', grant_id, rows[0], request.ip]
    );
    await client.query('COMMIT');
    return { status: 'success', grant: rows[0] };
  } catch (e) {
    await client.query('ROLLBACK');
    reply.code(500).send(e);
  } finally {
    client.release();
  }
});

// 5. IoT Endpoint: Telemetry & Geofence (Protected by API Key)
fastify.post('/api/iot/telemetry', {
  schema: {
    body: {
      type: 'object',
      required: ['rfid_tag', 'lat', 'lng'],
      properties: {
        rfid_tag: { type: 'string' },
        lat: { type: 'number', minimum: -90, maximum: 90 },
        lng: { type: 'number', minimum: -180, maximum: 180 },
        battery: { type: 'number' }
      }
    }
  }
}, async (request, reply) => {
  const apiKey = request.headers['x-iot-api-key'];
  if (apiKey !== process.env.IOT_API_KEY) {
    return reply.code(401).send({ error: 'Unauthorized IoT Device' });
  }

  const { rfid_tag, lat, lng, battery } = request.body;
  
  // 1. Insert Telemetry
  await pool.query(
    `INSERT INTO telemetry_logs (rfid_tag, location, battery_voltage) 
     VALUES ($1, ST_SetSRID(ST_MakePoint($2, $3), 4326), $4)`,
    [rfid_tag, lng, lat, battery]
  );

  // 2. Geofence Check using ST_DWithin (e.g. 5000 meters buffer) 
  // Cast geometry to geography for accurate distance calculations in meters
  const breachCheck = await pool.query(`
    SELECT c.rfid_tag, g.id as gaushala_id, g.name, g.zone 
    FROM cattle c
    JOIN gaushalas g ON c.gaushala_id = g.id
    WHERE c.rfid_tag = $1 
    AND NOT ST_DWithin(g.geofence_polygon::geography, ST_SetSRID(ST_MakePoint($2, $3), 4326)::geography, $4)
  `, [rfid_tag, lng, lat, process.env.GEOFENCE_BUFFER_METERS || 5000]);

  if (breachCheck.rows.length > 0) {
    const { gaushala_id, name, zone } = breachCheck.rows[0];
    
    // Cooldown/Deduplication check: Is there a PENDING alert for this cow in the last 1 hour?
    const recentAlert = await pool.query(`
      SELECT id FROM alerts 
      WHERE cattle_rfid = $1 AND type = 'GEOFENCE_BREACH' AND status != 'RESOLVED'
      AND created_at > NOW() - INTERVAL '1 hour'
    `, [rfid_tag]);

    if (recentAlert.rows.length === 0) {
      // Insert new alert
      const alertInsert = await pool.query(`
        INSERT INTO alerts (gaushala_id, cattle_rfid, type, description)
        VALUES ($1, $2, 'GEOFENCE_BREACH', $3) RETURNING id
      `, [gaushala_id, rfid_tag, `गाय ${rfid_tag} जियोफेंस सीमा से बाहर है!`]);

      const alertMsg = {
        id: alertInsert.rows[0].id,
        type: 'GEOFENCE_BREACH',
        gaushala: name,
        tag: rfid_tag,
        message: `गाय ${rfid_tag} जियोफेंस सीमा से बाहर है!`
      };
      
      // Emit only to relevant rooms
      emitScopedAlert(alertMsg, gaushala_id, zone);
    }
  }

  return { status: 'logged' };
});

// 7. FeedStock (Ration) Formula Engine
fastify.post('/api/manager/feed/consume', { preHandler: [fastify.authenticate, requireRole(['MANAGER'])] }, async (request, reply) => {
  const { cows_count } = request.body;
  const gaushalaId = request.user.gaushala_id;
  
  // Standard Formula Per Cow Per Day: 15kg Green, 5kg Dry, 1.5kg Concentrate
  const consumedHara = cows_count * 15;
  const consumedSukha = cows_count * 5;
  const consumedDana = cows_count * 1.5;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Update Feed Stock
    const { rows } = await client.query(`
      UPDATE feed_stock 
      SET hara_kg = GREATEST(0, hara_kg - $1), 
          sukha_kg = GREATEST(0, sukha_kg - $2), 
          dana_kg = GREATEST(0, dana_kg - $3),
          last_updated = CURRENT_TIMESTAMP
      WHERE gaushala_id = $4 RETURNING *
    `, [consumedHara, consumedSukha, consumedDana, gaushalaId]);

    // Insert Audit Log
    await client.query(`
      INSERT INTO ration_audit (gaushala_id, date, item_type, consumed, verified_by)
      VALUES 
        ($1, CURRENT_DATE, 'HARA', $2, $3),
        ($1, CURRENT_DATE, 'SUKHA', $4, $3),
        ($1, CURRENT_DATE, 'DANA', $5, $3)
    `, [gaushalaId, consumedHara, request.user.id, consumedSukha, consumedDana]);

    // Low Stock Alert Engine Check (< 30% or roughly 1000kg threshold for demo)
    if (rows[0] && rows[0].hara_kg < 1000) {
      const alertInsert = await client.query(`
        INSERT INTO alerts (gaushala_id, type, description, status)
        VALUES ($1, 'LOW_STOCK', 'हरा चारा स्टॉक 1000 किलो से कम है। कृपया आपूर्ति का प्रबंध करें।', 'PENDING') RETURNING id
      `, [gaushalaId]);

      // Assuming we fetch zone for socket scoping... ignoring for brevity in demo emit
      emitScopedAlert({
        id: alertInsert.rows[0].id,
        type: 'warning',
        gaushala: 'Your Gaushala',
        title: 'Fodder Stock Low',
        message: 'Green fodder stock is below 1000kg. AI Indent triggered.'
      }, gaushalaId, 'Raipur Zone');
    }

    await client.query('COMMIT');
    return { status: 'success', stock: rows[0] };
  } catch (e) {
    await client.query('ROLLBACK');
    reply.code(500).send({ error: 'Ration calculation failed', details: e.message });
  } finally {
    client.release();
  }
});

// 8. IoT / CCTV: ANPR Webhook Receiver (Integration Mock)
fastify.post('/api/iot/anpr', {
  schema: {
    body: {
      type: 'object',
      required: ['gaushala_id', 'plate_number', 'camera_id', 'is_authorized'],
      properties: {
        gaushala_id: { type: 'number' },
        plate_number: { type: 'string' },
        camera_id: { type: 'string' },
        is_authorized: { type: 'boolean' }
      }
    }
  }
}, async (request, reply) => {
  const apiKey = request.headers['x-iot-api-key'];
  if (apiKey !== process.env.IOT_API_KEY) {
    return reply.code(401).send({ error: 'Unauthorized CCTV/IoT Device' });
  }

  const { gaushala_id, plate_number, camera_id, is_authorized } = request.body;

  if (!is_authorized) {
    // Generate Alert for Unauthorized Vehicle
    const alertInsert = await pool.query(`
      INSERT INTO alerts (gaushala_id, type, description, status)
      VALUES ($1, 'UNAUTHORIZED_VEHICLE', $2, 'PENDING') RETURNING id
    `, [gaushala_id, `अनधिकृत वाहन प्रवेश: ${plate_number} (कैमरा: ${camera_id})`]);

    emitScopedAlert({
      id: alertInsert.rows[0].id,
      type: 'warning',
      gaushala: `Gaushala ID: ${gaushala_id}`,
      title: 'ANPR Alert: Unauthorized Vehicle',
      message: `Vehicle ${plate_number} detected at ${camera_id}`
    }, gaushala_id, 'Raipur Zone');
  }

  return { status: 'logged', anpr_read: plate_number };
});
const start = async () => {
  try {
    await fastify.listen({ port: process.env.PORT || 3000, host: '0.0.0.0' });
    fastify.log.info(`Backend listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
