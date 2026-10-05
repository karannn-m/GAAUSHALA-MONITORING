CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Gaushala Master Table
CREATE TABLE gaushalas (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    district VARCHAR(100),
    zone VARCHAR(100),
    capacity INTEGER,
    -- Center point of the Gaushala
    location GEOMETRY(Point, 4326),
    -- Geofence polygon (5-7km boundary)
    geofence_polygon GEOMETRY(Polygon, 4326),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Cattle Registry
CREATE TABLE cattle (
    id SERIAL PRIMARY KEY,
    rfid_tag VARCHAR(50) UNIQUE NOT NULL,
    gaushala_id INTEGER REFERENCES gaushalas(id),
    breed VARCHAR(50),
    age DECIMAL,
    gender VARCHAR(20),
    health_status VARCHAR(50) DEFAULT 'स्वस्थ',
    status VARCHAR(50) DEFAULT 'ACTIVE' -- ACTIVE, MISSING, DECEASED
);

-- 3. IoT Telemetry Logs (Trackers)
CREATE TABLE telemetry_logs (
    id BIGSERIAL PRIMARY KEY,
    rfid_tag VARCHAR(50) REFERENCES cattle(rfid_tag),
    location GEOMETRY(Point, 4326),
    battery_voltage DECIMAL,
    temperature DECIMAL,
    is_motion_detected BOOLEAN,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_telemetry_time ON telemetry_logs(recorded_at DESC);
CREATE INDEX idx_telemetry_geom ON telemetry_logs USING GIST(location);

-- 4. Alerts & Incidents
CREATE TABLE alerts (
    id SERIAL PRIMARY KEY,
    gaushala_id INTEGER REFERENCES gaushalas(id),
    type VARCHAR(50), -- GEOFENCE_BREACH, FEED_DELAY, BATTERY_LOW
    description TEXT,
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Ration & Audit Logs
CREATE TABLE ration_audit (
    id SERIAL PRIMARY KEY,
    gaushala_id INTEGER REFERENCES gaushalas(id),
    date DATE,
    opening_stock DECIMAL,
    received DECIMAL,
    consumed DECIMAL,
    closing_balance DECIMAL,
    verified_by VARCHAR(100)
);
