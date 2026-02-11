-- CRM InmoMarvic - Supabase Database Schema
-- Ejecutar este script en el SQL Editor de Supabase

-- Habilitar UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================
-- TABLA: agents
-- =====================
CREATE TABLE IF NOT EXISTS agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- TABLA: properties
-- =====================
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  operation TEXT CHECK (operation IN ('venta', 'alquiler')) NOT NULL,
  property_type TEXT,
  price DECIMAL(12,2),
  area INTEGER,
  bedrooms INTEGER DEFAULT 0,
  bathrooms INTEGER DEFAULT 0,
  address TEXT,
  city TEXT,
  zone TEXT,
  description TEXT,
  features TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'disponible' CHECK (status IN ('disponible', 'reservado', 'vendido', 'alquilado')),
  agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
  idealista_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- TABLA: clients
-- =====================
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  type TEXT CHECK (type IN ('comprador', 'vendedor', 'inquilino', 'propietario', 'lead')) DEFAULT 'lead',
  source TEXT DEFAULT 'manual',
  preferences TEXT,
  budget_min DECIMAL(12,2),
  budget_max DECIMAL(12,2),
  zones TEXT[] DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- TABLA: leads (para captura de Idealista)
-- =====================
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  source TEXT DEFAULT 'idealista',
  original_email TEXT,
  message TEXT,
  status TEXT DEFAULT 'nuevo' CHECK (status IN ('nuevo', 'contactado', 'convertido', 'descartado')),
  assigned_agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- TABLA: visits
-- =====================
CREATE TABLE IF NOT EXISTS visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  agent_id UUID REFERENCES agents(id) ON DELETE SET NULL NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'programada' CHECK (status IN ('programada', 'realizada', 'cancelada')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- TABLA: interactions
-- =====================
CREATE TABLE IF NOT EXISTS interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  type TEXT CHECK (type IN ('llamada', 'email', 'visita', 'whatsapp', 'idealista')) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- ÍNDICES
-- =====================
CREATE INDEX IF NOT EXISTS idx_properties_agent ON properties(agent_id);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_operation ON properties(operation);
CREATE INDEX IF NOT EXISTS idx_clients_type ON clients(type);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_visits_scheduled ON visits(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_visits_agent ON visits(agent_id);

-- =====================
-- ROW LEVEL SECURITY (RLS)
-- =====================
-- Por ahora, permitimos acceso público para el POC
-- En producción, deberías configurar políticas de autenticación

ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;

-- Políticas públicas para POC (ajustar en producción)
CREATE POLICY "Acceso público agents" ON agents FOR ALL USING (true);
CREATE POLICY "Acceso público properties" ON properties FOR ALL USING (true);
CREATE POLICY "Acceso público clients" ON clients FOR ALL USING (true);
CREATE POLICY "Acceso público leads" ON leads FOR ALL USING (true);
CREATE POLICY "Acceso público visits" ON visits FOR ALL USING (true);
CREATE POLICY "Acceso público interactions" ON interactions FOR ALL USING (true);

-- =====================
-- DATOS DE EJEMPLO
-- =====================

-- Insertar agentes
INSERT INTO agents (name, email, phone, avatar_url) VALUES
  ('María García López', 'maria.garcia@inmomarvic.com', '+34 612 345 678', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'),
  ('Carlos Rodríguez Martín', 'carlos.rodriguez@inmomarvic.com', '+34 623 456 789', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'),
  ('Ana Fernández Ruiz', 'ana.fernandez@inmomarvic.com', '+34 634 567 890', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'),
  ('Pedro Sánchez Gómez', 'pedro.sanchez@inmomarvic.com', '+34 645 678 901', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150');

-- Insertar propiedades (con referencia a agentes)
INSERT INTO properties (reference, title, operation, property_type, price, area, bedrooms, bathrooms, address, city, zone, description, features, images, status, agent_id)
SELECT 
  'MV-2024-001',
  'Ático de lujo con terraza panorámica',
  'venta',
  'atico',
  485000,
  145,
  3,
  2,
  'Calle Gran Vía 45, 8º',
  'Madrid',
  'Centro',
  'Espectacular ático en pleno centro de Madrid con vistas panorámicas a la ciudad. Acabados de primera calidad, domótica integrada y terraza de 40m².',
  ARRAY['Terraza', 'Ascensor', 'Aire acondicionado', 'Calefacción central', 'Trastero', 'Plaza de garaje'],
  ARRAY['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'],
  'disponible',
  id
FROM agents WHERE email = 'maria.garcia@inmomarvic.com';

INSERT INTO properties (reference, title, operation, property_type, price, area, bedrooms, bathrooms, address, city, zone, description, features, images, status, agent_id)
SELECT 
  'MV-2024-002',
  'Piso reformado en Salamanca',
  'venta',
  'piso',
  375000,
  95,
  2,
  2,
  'Calle Velázquez 78, 3º B',
  'Madrid',
  'Salamanca',
  'Precioso piso completamente reformado en el barrio de Salamanca. Cocina americana equipada, suelos de parquet y mucha luz natural.',
  ARRAY['Reformado', 'Ascensor', 'Aire acondicionado', 'Armarios empotrados'],
  ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
  'disponible',
  id
FROM agents WHERE email = 'carlos.rodriguez@inmomarvic.com';

INSERT INTO properties (reference, title, operation, property_type, price, area, bedrooms, bathrooms, address, city, zone, description, features, images, status, agent_id)
SELECT 
  'MV-2024-003',
  'Estudio moderno en Malasaña',
  'alquiler',
  'piso',
  950,
  45,
  1,
  1,
  'Calle Fuencarral 89, 2º',
  'Madrid',
  'Malasaña',
  'Estudio totalmente amueblado y equipado en el corazón de Malasaña. Ideal para profesionales.',
  ARRAY['Amueblado', 'Equipado', 'Aire acondicionado', 'Internet incluido'],
  ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
  'disponible',
  id
FROM agents WHERE email = 'ana.fernandez@inmomarvic.com';

INSERT INTO properties (reference, title, operation, property_type, price, area, bedrooms, bathrooms, address, city, zone, description, features, images, status, agent_id)
SELECT 
  'MV-2024-004',
  'Local comercial en zona prime',
  'alquiler',
  'local',
  2800,
  120,
  0,
  1,
  'Calle Serrano 45',
  'Madrid',
  'Salamanca',
  'Local comercial a pie de calle en una de las mejores zonas comerciales de Madrid.',
  ARRAY['Escaparate', 'Aire acondicionado', 'Almacén', 'Salida de humos'],
  ARRAY['https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800'],
  'disponible',
  id
FROM agents WHERE email = 'carlos.rodriguez@inmomarvic.com';

INSERT INTO properties (reference, title, operation, property_type, price, area, bedrooms, bathrooms, address, city, zone, description, features, images, status, agent_id)
SELECT 
  'MV-2024-005',
  'Chalet independiente con piscina',
  'venta',
  'chalet',
  650000,
  280,
  5,
  3,
  'Urbanización Los Robles, 12',
  'Pozuelo de Alarcón',
  'La Finca',
  'Impresionante chalet independiente en urbanización privada con seguridad 24h.',
  ARRAY['Piscina', 'Jardín', 'Garaje', 'Seguridad 24h', 'Calefacción por suelo radiante'],
  ARRAY['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'],
  'reservado',
  id
FROM agents WHERE email = 'maria.garcia@inmomarvic.com';

-- Insertar clientes
INSERT INTO clients (name, email, phone, type, source, preferences, budget_min, budget_max, zones, notes) VALUES
  ('Laura Martínez Pérez', 'laura.martinez@email.com', '+34 666 111 222', 'comprador', 'manual', 'Busca piso de 3 habitaciones en zona centro o Chamberí', 350000, 450000, ARRAY['Centro', 'Chamberí', 'Retiro'], 'Trabaja cerca de Nuevos Ministerios.'),
  ('Roberto Jiménez García', 'roberto.jimenez@email.com', '+34 666 222 333', 'vendedor', 'manual', 'Quiere vender su piso en Salamanca', NULL, NULL, ARRAY['Salamanca'], 'Tiene prisa por vender.'),
  ('Ana Belén González', 'anabelen.gonzalez@email.com', '+34 666 333 444', 'inquilino', 'manual', 'Busca estudio o piso pequeño para alquilar', NULL, 1200, ARRAY['Malasaña', 'Chueca', 'La Latina'], 'Profesional freelance.'),
  ('Carmen López Sánchez', 'carmen.lopez@email.com', '+34 666 555 666', 'comprador', 'manual', 'Chalet o casa adosada con jardín', 400000, 600000, ARRAY['Las Rozas', 'Pozuelo', 'Majadahonda'], 'Familia con 2 hijos.');

-- Insertar algunos leads de ejemplo (simulando Idealista)
INSERT INTO leads (property_id, client_id, source, original_email, message, status, assigned_agent_id)
SELECT 
  p.id,
  NULL,
  'idealista',
  'alertas@idealista.com',
  'Hola, estoy interesado en el ático de Gran Vía. ¿Podría concertar una visita? Mi teléfono es 666777888. Saludos, Juan.',
  'nuevo',
  a.id
FROM properties p, agents a
WHERE p.reference = 'MV-2024-001' AND a.email = 'maria.garcia@inmomarvic.com';

INSERT INTO leads (property_id, client_id, source, original_email, message, status, assigned_agent_id)
SELECT 
  p.id,
  NULL,
  'idealista',
  'alertas@idealista.com',
  'Buenos días, me gustaría tener más información sobre el piso en Salamanca. Contacto: maria@test.com',
  'nuevo',
  a.id
FROM properties p, agents a
WHERE p.reference = 'MV-2024-002' AND a.email = 'carlos.rodriguez@inmomarvic.com';

-- Insertar visitas
INSERT INTO visits (property_id, client_id, agent_id, scheduled_at, status, notes)
SELECT 
  p.id,
  c.id,
  a.id,
  NOW() + INTERVAL '1 day' + INTERVAL '10 hours',
  'programada',
  'Primera visita. Cliente muy interesada.'
FROM properties p, clients c, agents a
WHERE p.reference = 'MV-2024-001' 
  AND c.email = 'laura.martinez@email.com'
  AND a.email = 'maria.garcia@inmomarvic.com';

INSERT INTO visits (property_id, client_id, agent_id, scheduled_at, status, notes)
SELECT 
  p.id,
  c.id,
  a.id,
  NOW() + INTERVAL '2 days' + INTERVAL '11 hours',
  'programada',
  'Ver también zona de colegios.'
FROM properties p, clients c, agents a
WHERE p.reference = 'MV-2024-005' 
  AND c.email = 'carmen.lopez@email.com'
  AND a.email = 'maria.garcia@inmomarvic.com';

-- Insertar interacciones
INSERT INTO interactions (client_id, type, description)
SELECT id, 'llamada', 'Llamada inicial para conocer preferencias.' FROM clients WHERE email = 'laura.martinez@email.com';

INSERT INTO interactions (client_id, type, description)
SELECT id, 'email', 'Enviadas 3 propiedades que encajan con sus criterios.' FROM clients WHERE email = 'laura.martinez@email.com';

INSERT INTO interactions (client_id, type, description)
SELECT id, 'whatsapp', 'Confirmación visita para mañana.' FROM clients WHERE email = 'carmen.lopez@email.com';

-- =====================
-- FUNCIÓN: updated_at trigger
-- =====================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_properties_updated_at
    BEFORE UPDATE ON properties
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================
-- REALTIME (opcional)
-- =====================
-- Habilitar realtime para la tabla leads (para notificaciones en vivo)
ALTER PUBLICATION supabase_realtime ADD TABLE leads;
