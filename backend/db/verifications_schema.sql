-- 11. Physical Verifications (Added for Sub-Admins)
CREATE TABLE verifications (
    id SERIAL PRIMARY KEY,
    gaushala_id INTEGER REFERENCES gaushalas(id),
    sub_admin_id INTEGER REFERENCES users(id),
    reported_rfid_count INTEGER,
    actual_headcount INTEGER,
    discrepancy INTEGER,
    gps_location GEOMETRY(Point, 4326),
    photo_url TEXT,
    remarks TEXT,
    is_synced BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
