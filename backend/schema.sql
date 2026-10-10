-- Gaushala Monitoring DB Schema

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL, -- 'ADMIN', 'MANAGER', 'SUB_ADMIN'
    gaushala_id INT,
    zone VARCHAR(50),
    name VARCHAR(100),
    title VARCHAR(100),
    phone VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS gaushalas (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    district VARCHAR(50),
    zone VARCHAR(50),
    reg INT DEFAULT 0,
    ver INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'ok',
    feed_status VARCHAR(20) DEFAULT 'ok',
    manager VARCHAR(100),
    contact VARCHAR(20),
    cctv_count INT DEFAULT 0,
    rfid_coverage VARCHAR(20),
    last_audit_score INT,
    address TEXT,
    bank_details JSONB,
    grant_claimed DECIMAL(10,2) DEFAULT 0,
    grant_approved DECIMAL(10,2) DEFAULT 0,
    cattle_distribution JSONB,
    geofence_polygon GEOMETRY(Polygon, 4326)
);

CREATE TABLE IF NOT EXISTS cattle (
    id SERIAL PRIMARY KEY,
    rfid_tag VARCHAR(50) UNIQUE NOT NULL,
    gaushala_id INT REFERENCES gaushalas(id),
    name VARCHAR(100),
    breed VARCHAR(50),
    status VARCHAR(20) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS telemetry_logs (
    id SERIAL PRIMARY KEY,
    rfid_tag VARCHAR(50) REFERENCES cattle(rfid_tag),
    location GEOMETRY(Point, 4326),
    battery_voltage DECIMAL(4,2),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS alerts (
    id SERIAL PRIMARY KEY,
    alert_code VARCHAR(20) UNIQUE,
    gaushala_id INT REFERENCES gaushalas(id),
    cattle_rfid VARCHAR(50),
    type VARCHAR(50) NOT NULL,
    category VARCHAR(50),
    title VARCHAR(200),
    title_hi VARCHAR(200),
    title_en VARCHAR(200),
    description TEXT,
    desc_hi TEXT,
    desc_en TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    action_taken TEXT,
    action_taken_hi TEXT,
    action_taken_en TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS grants (
    id SERIAL PRIMARY KEY,
    gaushala_id INT REFERENCES gaushalas(id),
    amount DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'pending',
    transaction_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_log (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    action VARCHAR(50) NOT NULL,
    table_name VARCHAR(50),
    record_id INT,
    new_data JSONB,
    ip_address VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS feed_stock (
    id SERIAL PRIMARY KEY,
    gaushala_id INT REFERENCES gaushalas(id),
    hara_kg DECIMAL(10,2) DEFAULT 0,
    sukha_kg DECIMAL(10,2) DEFAULT 0,
    dana_kg DECIMAL(10,2) DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ration_audit (
    id SERIAL PRIMARY KEY,
    gaushala_id INT REFERENCES gaushalas(id),
    date DATE,
    item_type VARCHAR(20),
    consumed DECIMAL(10,2),
    verified_by INT REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS health_records (
    id SERIAL PRIMARY KEY,
    tag VARCHAR(50),
    breed VARCHAR(50),
    breed_hi VARCHAR(50),
    breed_en VARCHAR(50),
    cow_name VARCHAR(100),
    cow_name_hi VARCHAR(100),
    cow_name_en VARCHAR(100),
    condition TEXT,
    condition_hi TEXT,
    condition_en TEXT,
    vet VARCHAR(100),
    status VARCHAR(50),
    date DATE,
    shed VARCHAR(50),
    dosage TEXT,
    severity VARCHAR(20)
);

-- Note: We need PostGIS extension for GEOMETRY types
-- CREATE EXTENSION IF NOT EXISTS postgis;
