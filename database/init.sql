CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'VIEWER'
    CHECK (role IN ('ADMIN', 'DISPATCHER', 'VIEWER')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ships (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  type VARCHAR(80) NOT NULL,
  imo_number VARCHAR(20) NOT NULL UNIQUE,
  build_year INT NOT NULL CHECK (build_year >= 1900),
  capacity INT NOT NULL CHECK (capacity > 0),
  status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE'
    CHECK (status IN ('ACTIVE', 'MAINTENANCE', 'DECOMMISSIONED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ports (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  country VARCHAR(80) NOT NULL,
  city VARCHAR(80) NOT NULL,
  CONSTRAINT uq_ports_location UNIQUE (name, country, city)
);

CREATE TABLE IF NOT EXISTS captains (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  license_number VARCHAR(40) NOT NULL UNIQUE,
  experience_years INT NOT NULL CHECK (experience_years >= 0)
);

CREATE TABLE IF NOT EXISTS voyages (
  id SERIAL PRIMARY KEY,
  ship_id INT NOT NULL REFERENCES ships(id) ON DELETE CASCADE,
  captain_id INT NOT NULL REFERENCES captains(id) ON DELETE RESTRICT,
  departure_port_id INT NOT NULL REFERENCES ports(id) ON DELETE RESTRICT,
  arrival_port_id INT NOT NULL REFERENCES ports(id) ON DELETE RESTRICT,
  departure_date DATE NOT NULL,
  arrival_date DATE NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'SCHEDULED'
    CHECK (status IN ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'))
);

CREATE TABLE IF NOT EXISTS maintenance_records (
  id SERIAL PRIMARY KEY,
  ship_id INT NOT NULL REFERENCES ships(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  maintenance_date DATE NOT NULL,
  cost NUMERIC(12, 2) NOT NULL CHECK (cost >= 0)
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  entity_name VARCHAR(80) NOT NULL,
  entity_id INT NOT NULL,
  action VARCHAR(20) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION calculate_ship_age(build_year INT)
RETURNS INT AS $$
BEGIN
  RETURN EXTRACT(YEAR FROM CURRENT_DATE)::INT - build_year;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_ship_voyage_count(p_ship_id INT)
RETURNS INT AS $$
DECLARE
  voyage_count INT;
BEGIN
  SELECT COUNT(*) INTO voyage_count
  FROM voyages
  WHERE ship_id = p_ship_id;

  RETURN voyage_count;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_port_voyage_count(p_port_id INT)
RETURNS INT AS $$
DECLARE
  voyage_count INT;
BEGIN
  SELECT COUNT(*) INTO voyage_count
  FROM voyages
  WHERE departure_port_id = p_port_id OR arrival_port_id = p_port_id;

  RETURN voyage_count;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE add_ship(
  p_name VARCHAR,
  p_type VARCHAR,
  p_imo_number VARCHAR,
  p_build_year INT,
  p_capacity INT,
  p_status VARCHAR DEFAULT 'ACTIVE'
)
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO ships (name, type, imo_number, build_year, capacity, status)
  VALUES (p_name, p_type, p_imo_number, p_build_year, p_capacity, p_status);
END;
$$;

CREATE OR REPLACE PROCEDURE schedule_voyage(
  p_ship_id INT,
  p_captain_id INT,
  p_departure_port_id INT,
  p_arrival_port_id INT,
  p_departure_date DATE,
  p_arrival_date DATE
)
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO voyages (
    ship_id,
    captain_id,
    departure_port_id,
    arrival_port_id,
    departure_date,
    arrival_date,
    status
  )
  VALUES (
    p_ship_id,
    p_captain_id,
    p_departure_port_id,
    p_arrival_port_id,
    p_departure_date,
    p_arrival_date,
    'SCHEDULED'
  );
END;
$$;

CREATE OR REPLACE PROCEDURE complete_voyage(p_voyage_id INT)
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE voyages
  SET status = 'COMPLETED'
  WHERE id = p_voyage_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Voyage with id % not found', p_voyage_id;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION set_ship_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION validate_voyage_dates()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.arrival_date <= NEW.departure_date THEN
    RAISE EXCEPTION 'arrival_date must be later than departure_date';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION audit_ship_changes()
RETURNS TRIGGER AS $$
DECLARE
  changed_ship_id INT;
BEGIN
  IF TG_OP = 'DELETE' THEN
    changed_ship_id := OLD.id;
  ELSE
    changed_ship_id := NEW.id;
  END IF;

  INSERT INTO audit_logs (entity_name, entity_id, action)
  VALUES ('ships', changed_ship_id, TG_OP);

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_ships_updated_at ON ships;
CREATE TRIGGER trg_ships_updated_at
BEFORE UPDATE ON ships
FOR EACH ROW
EXECUTE FUNCTION set_ship_updated_at();

DROP TRIGGER IF EXISTS trg_voyages_validate_dates ON voyages;
CREATE TRIGGER trg_voyages_validate_dates
BEFORE INSERT OR UPDATE ON voyages
FOR EACH ROW
EXECUTE FUNCTION validate_voyage_dates();

DROP TRIGGER IF EXISTS trg_ships_audit ON ships;
CREATE TRIGGER trg_ships_audit
AFTER INSERT OR UPDATE OR DELETE ON ships
FOR EACH ROW
EXECUTE FUNCTION audit_ship_changes();

INSERT INTO users (name, email, password_hash, role)
VALUES
  ('Admin User', 'admin@ship.local', crypt('admin123', gen_salt('bf')), 'ADMIN'),
  ('Dispatcher User', 'dispatcher@ship.local', crypt('dispatcher123', gen_salt('bf')), 'DISPATCHER'),
  ('Viewer User', 'viewer@ship.local', crypt('viewer123', gen_salt('bf')), 'VIEWER')
ON CONFLICT (email) DO NOTHING;

INSERT INTO ports (name, country, city)
VALUES
  ('Port of Rotterdam', 'Netherlands', 'Rotterdam'),
  ('Port of Hamburg', 'Germany', 'Hamburg'),
  ('Port of Singapore', 'Singapore', 'Singapore'),
  ('Port of Shanghai', 'China', 'Shanghai')
ON CONFLICT ON CONSTRAINT uq_ports_location DO NOTHING;

INSERT INTO captains (full_name, license_number, experience_years)
VALUES
  ('Sergey Volkov', 'CAP-1001', 12),
  ('Anna Smirnova', 'CAP-1002', 8),
  ('Mikhail Orlov', 'CAP-1003', 17)
ON CONFLICT (license_number) DO NOTHING;

INSERT INTO ships (name, type, imo_number, build_year, capacity, status)
VALUES
  ('Aurora Star', 'Container ship', 'IMO1234567', 2015, 25000, 'ACTIVE'),
  ('Baltic Wind', 'Tanker', 'IMO7654321', 2012, 18000, 'MAINTENANCE'),
  ('Ocean North', 'Bulk carrier', 'IMO2468135', 2019, 32000, 'ACTIVE')
ON CONFLICT (imo_number) DO NOTHING;

INSERT INTO voyages (
  ship_id,
  captain_id,
  departure_port_id,
  arrival_port_id,
  departure_date,
  arrival_date,
  status
)
SELECT
  s.id,
  c.id,
  p1.id,
  p2.id,
  DATE '2026-06-01',
  DATE '2026-06-12',
  'SCHEDULED'
FROM ships s, captains c, ports p1, ports p2
WHERE s.imo_number = 'IMO1234567'
  AND c.license_number = 'CAP-1001'
  AND p1.name = 'Port of Rotterdam'
  AND p2.name = 'Port of Hamburg'
  AND NOT EXISTS (
    SELECT 1 FROM voyages v
    WHERE v.ship_id = s.id
      AND v.departure_date = DATE '2026-06-01'
  );

INSERT INTO voyages (
  ship_id,
  captain_id,
  departure_port_id,
  arrival_port_id,
  departure_date,
  arrival_date,
  status
)
SELECT
  s.id,
  c.id,
  p1.id,
  p2.id,
  DATE '2026-05-05',
  DATE '2026-05-20',
  'IN_PROGRESS'
FROM ships s, captains c, ports p1, ports p2
WHERE s.imo_number = 'IMO2468135'
  AND c.license_number = 'CAP-1003'
  AND p1.name = 'Port of Singapore'
  AND p2.name = 'Port of Shanghai'
  AND NOT EXISTS (
    SELECT 1 FROM voyages v
    WHERE v.ship_id = s.id
      AND v.departure_date = DATE '2026-05-05'
  );

INSERT INTO maintenance_records (ship_id, description, maintenance_date, cost)
SELECT s.id, 'Engine diagnostics and oil replacement', DATE '2026-04-10', 12500.00
FROM ships s
WHERE s.imo_number = 'IMO7654321'
  AND NOT EXISTS (
    SELECT 1 FROM maintenance_records mr
    WHERE mr.ship_id = s.id AND mr.maintenance_date = DATE '2026-04-10'
  );

INSERT INTO maintenance_records (ship_id, description, maintenance_date, cost)
SELECT s.id, 'Navigation system inspection', DATE '2026-03-18', 6400.00
FROM ships s
WHERE s.imo_number = 'IMO1234567'
  AND NOT EXISTS (
    SELECT 1 FROM maintenance_records mr
    WHERE mr.ship_id = s.id AND mr.maintenance_date = DATE '2026-03-18'
  );

CREATE OR REPLACE VIEW v_ship_registry AS
SELECT
  s.id,
  s.name,
  s.type,
  s.imo_number,
  s.build_year,
  calculate_ship_age(s.build_year) AS ship_age,
  s.capacity,
  s.status,
  get_ship_voyage_count(s.id) AS voyage_count,
  s.created_at,
  s.updated_at
FROM ships s;

CREATE OR REPLACE VIEW v_active_voyages AS
SELECT
  v.id,
  s.name AS ship_name,
  c.full_name AS captain_name,
  dp.name AS departure_port,
  ap.name AS arrival_port,
  v.departure_date,
  v.arrival_date,
  v.status
FROM voyages v
JOIN ships s ON s.id = v.ship_id
JOIN captains c ON c.id = v.captain_id
JOIN ports dp ON dp.id = v.departure_port_id
JOIN ports ap ON ap.id = v.arrival_port_id
WHERE v.status IN ('SCHEDULED', 'IN_PROGRESS');

CREATE OR REPLACE VIEW v_port_statistics AS
SELECT
  p.id,
  p.name,
  p.country,
  p.city,
  (
    SELECT COUNT(*)
    FROM voyages v
    WHERE v.departure_port_id = p.id
  ) AS departure_count,
  (
    SELECT COUNT(*)
    FROM voyages v
    WHERE v.arrival_port_id = p.id
  ) AS arrival_count,
  get_port_voyage_count(p.id) AS total_voyage_count
FROM ports p;
