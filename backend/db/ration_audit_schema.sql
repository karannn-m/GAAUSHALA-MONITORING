-- 12. Ration Consumption Audit
CREATE TABLE ration_audit (
    id SERIAL PRIMARY KEY,
    gaushala_id INTEGER REFERENCES gaushalas(id),
    date DATE NOT NULL,
    item_type VARCHAR(50), -- HARA, SUKHA, DANA
    consumed DECIMAL(10, 2),
    verified_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
