const fastify = require('fastify')({ logger: true });
const socketio = require('fastify-socket.io');
const { Pool } = require('pg');

// PostgreSQL Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://user:pass@localhost:5432/gaushala_db'
});

fastify.register(socketio, {
  cors: {
    origin: "*",
  }
});

// Broadcast Alert via WebSockets
const broadcastAlert = (alert) => {
  fastify.io.emit('new_alert', alert);
};

// API: Get Gaushala Overview (Admin Dashboard)
fastify.get('/api/admin/overview', async (request, reply) => {
  const { rows } = await pool.query('SELECT COUNT(*) as total_gaushalas FROM gaushalas');
  const cattle = await pool.query("SELECT COUNT(*) as total_cattle FROM cattle WHERE status='ACTIVE'");
  
  return {
    total_gaushalas: rows[0].total_gaushalas,
    total_verified_cattle: cattle.rows[0].total_cattle,
    status: 'success'
  };
});

// API: Geofence Breach Check (Called by IoT Service)
fastify.post('/api/iot/telemetry', async (request, reply) => {
  const { rfid_tag, lat, lng, battery } = request.body;
  
  // 1. Insert Telemetry
  await pool.query(
    `INSERT INTO telemetry_logs (rfid_tag, location, battery_voltage) 
     VALUES ($1, ST_SetSRID(ST_MakePoint($2, $3), 4326), $4)`,
    [rfid_tag, lng, lat, battery]
  );

  // 2. Geofence Check: Is cow outside its Gaushala's 5km boundary?
  const breachCheck = await pool.query(`
    SELECT c.rfid_tag, g.name 
    FROM cattle c
    JOIN gaushalas g ON c.gaushala_id = g.id
    WHERE c.rfid_tag = $1 
    AND NOT ST_Contains(g.geofence_polygon, ST_SetSRID(ST_MakePoint($2, $3), 4326))
  `, [rfid_tag, lng, lat]);

  if (breachCheck.rows.length > 0) {
    const alertMsg = {
      type: 'GEOFENCE_BREACH',
      gaushala: breachCheck.rows[0].name,
      tag: rfid_tag,
      message: `गाय ${rfid_tag} जियोफेंस सीमा से बाहर है!`
    };
    broadcastAlert(alertMsg);
  }

  return { status: 'logged' };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info(`Backend listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
