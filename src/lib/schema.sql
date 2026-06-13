-- V-REALTY SCHEMA
CREATE TABLE IF NOT EXISTS vr_properties (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC(15,2) NOT NULL,
  price_currency VARCHAR(3) DEFAULT 'MXN',
  type VARCHAR(50) NOT NULL, -- casa, departamento, terreno, local, oficina
  operation VARCHAR(20) NOT NULL, -- venta, renta
  status VARCHAR(20) DEFAULT 'available', -- available, sold, rented, reserved
  area_m2 NUMERIC(10,2),
  rooms INTEGER,
  bathrooms NUMERIC(3,1),
  parking INTEGER DEFAULT 0,
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  zip VARCHAR(10),
  lat NUMERIC(10,7),
  lng NUMERIC(10,7),
  featured BOOLEAN DEFAULT false,
  images TEXT[] DEFAULT '{}',
  amenities TEXT[] DEFAULT '{}',
  agent_clerk_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vr_leads (
  id SERIAL PRIMARY KEY,
  property_id INTEGER REFERENCES vr_properties(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  source VARCHAR(50) DEFAULT 'web',
  status VARCHAR(20) DEFAULT 'new', -- new, contacted, qualified, closed
  clerk_user_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vr_favorites (
  id SERIAL PRIMARY KEY,
  clerk_user_id TEXT NOT NULL,
  property_id INTEGER REFERENCES vr_properties(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(clerk_user_id, property_id)
);

CREATE TABLE IF NOT EXISTS vr_agents (
  id SERIAL PRIMARY KEY,
  clerk_user_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  bio TEXT,
  avatar_url TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed demo properties
INSERT INTO vr_properties (title, description, price, type, operation, status, area_m2, rooms, bathrooms, parking, city, state, featured, images, amenities)
VALUES
  ('Casa en Zapopan con alberca', 'Residencia moderna en fraccionamiento privado con acabados de lujo, jardín amplio y seguridad 24h.', 4500000, 'casa', 'venta', 'available', 280, 4, 3.5, 2, 'Zapopan', 'Jalisco', true, ARRAY['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800','https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'], ARRAY['alberca','jardín','seguridad 24h','estacionamiento','cuarto de servicio']),
  ('Departamento en Guadalajara Centro', 'Loft minimalista en edificio boutique, 2 recámaras, balcón con vista a la ciudad, gimnasio.', 2800000, 'departamento', 'venta', 'available', 120, 2, 2, 1, 'Guadalajara', 'Jalisco', true, ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800','https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'], ARRAY['gimnasio','rooftop','concierge','pet friendly']),
  ('Terreno en Valle de Bravo', 'Lote de inversión en zona residencial de alto valor. Servicios completos, vista al lago.', 1200000, 'terreno', 'venta', 'available', 500, NULL, NULL, NULL, 'Valle de Bravo', 'Estado de México', false, ARRAY['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'], ARRAY['agua','luz','drenaje','vista al lago']),
  ('Casa en Renta Santa Anita', 'Casa ejecutiva amueblada con home office, ideal para ejecutivos o familias pequeñas.', 28000, 'casa', 'renta', 'available', 180, 3, 2.5, 2, 'Tlajomulco', 'Jalisco', false, ARRAY['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800'], ARRAY['amueblada','home office','alarma','jardín']),
  ('Penthouse en Puerto Vallarta', 'Penthouse de lujo con terraza y vista al mar, 3 recámaras, acabados premium, acceso a playa.', 12500000, 'departamento', 'venta', 'available', 320, 3, 3.5, 2, 'Puerto Vallarta', 'Jalisco', true, ARRAY['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800','https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800'], ARRAY['terraza','vista al mar','jacuzzi','concierge','acceso a playa'])
ON CONFLICT DO NOTHING;
