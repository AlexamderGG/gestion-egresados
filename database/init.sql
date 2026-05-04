-- schema.sql

-- Extensión para UUID
SET client_encoding = 'UTF8';
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tabla principal de usuarios (autenticación y roles)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'egresado', 'empresa')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Perfil egresado
CREATE TABLE egresados (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    carrera VARCHAR(100),
    anio_egreso INT CHECK (anio_egreso BETWEEN 1950 AND EXTRACT(YEAR FROM NOW())),
    cv_url TEXT,
    habilidades_blandas TEXT,
    fecha_nacimiento DATE
);

-- Perfil empresa
CREATE TABLE empresas (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    nombre_empresa VARCHAR(150) NOT NULL,
    sector VARCHAR(100),
    ubicacion VARCHAR(200),
    website VARCHAR(255)
);

-- Catálogo de habilidades
CREATE TABLE habilidades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) NOT NULL UNIQUE,
    categoria VARCHAR(20) CHECK (categoria IN ('tecnica', 'blanda'))
);

-- Relación egresado - habilidades (muchos a muchos)
CREATE TABLE egresado_habilidad (
    egresado_id UUID REFERENCES egresados(id) ON DELETE CASCADE,
    habilidad_id UUID REFERENCES habilidades(id) ON DELETE CASCADE,
    nivel INT CHECK (nivel BETWEEN 1 AND 5),
    PRIMARY KEY (egresado_id, habilidad_id)
);

-- Ofertas laborales
CREATE TABLE ofertas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT NOT NULL,
    ubicacion VARCHAR(200),
    modalidad VARCHAR(20) CHECK (modalidad IN ('remoto', 'hibrido', 'presencial')),
    tipo_contrato VARCHAR(50),
    salario_min INT,
    salario_max INT,
    activa BOOLEAN DEFAULT TRUE,
    fecha_publicacion TIMESTAMPTZ DEFAULT NOW(),
    fecha_cierre TIMESTAMPTZ,
    CONSTRAINT salario_check CHECK (salario_min <= salario_max)
);

CREATE INDEX idx_ofertas_empresa ON ofertas(empresa_id);
CREATE INDEX idx_ofertas_activa_fecha ON ofertas(activa, fecha_publicacion);
CREATE INDEX idx_ofertas_modalidad ON ofertas(modalidad);
CREATE INDEX idx_ofertas_salario ON ofertas(salario_min, salario_max);

-- Habilidades por oferta
CREATE TABLE oferta_habilidad (
    oferta_id UUID REFERENCES ofertas(id) ON DELETE CASCADE,
    habilidad_id UUID REFERENCES habilidades(id) ON DELETE CASCADE,
    PRIMARY KEY (oferta_id, habilidad_id)
);

-- Postulaciones
CREATE TABLE postulaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    oferta_id UUID NOT NULL REFERENCES ofertas(id) ON DELETE CASCADE,
    egresado_id UUID NOT NULL REFERENCES egresados(id) ON DELETE CASCADE,
    estado VARCHAR(20) NOT NULL DEFAULT 'postulado',
    fecha_postulacion TIMESTAMPTZ DEFAULT NOW(),
    fecha_estado TIMESTAMPTZ DEFAULT NOW(),
    comentario TEXT,
    UNIQUE(oferta_id, egresado_id) -- Evita doble postulación
);

CREATE INDEX idx_postulaciones_oferta ON postulaciones(oferta_id);
CREATE INDEX idx_postulaciones_egresado ON postulaciones(egresado_id);
CREATE INDEX idx_postulaciones_estado_fecha ON postulaciones(estado, fecha_postulacion);

-- Historial de cambios de estado en postulaciones
CREATE TABLE historial_estados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    postulacion_id UUID NOT NULL REFERENCES postulaciones(id) ON DELETE CASCADE,
    estado_anterior VARCHAR(20),
    estado_nuevo VARCHAR(20) NOT NULL,
    fecha_cambio TIMESTAMPTZ DEFAULT NOW(),
    cambiado_por UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Notificaciones
CREATE TABLE notificaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tipo VARCHAR(10) CHECK (tipo IN ('email', 'interna')),
    asunto VARCHAR(255),
    contenido TEXT,
    leida BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMPTZ DEFAULT NOW(),
    fecha_envio TIMESTAMPTZ
);
CREATE INDEX idx_notificaciones_usuario_leida ON notificaciones(usuario_id, leida);

-- Reportes generados
CREATE TABLE reportes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tipo_reporte VARCHAR(50) NOT NULL,
    filtros_aplicados JSONB,
    url_pdf TEXT,
    estado VARCHAR(20) DEFAULT 'en_cola',
    fecha_solicitud TIMESTAMPTZ DEFAULT NOW(),
    fecha_completado TIMESTAMPTZ
);
CREATE INDEX idx_reportes_usuario_estado ON reportes(usuario_id, estado);

-- Auditoría
CREATE TABLE auditoria_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES users(id) ON DELETE SET NULL,
    accion VARCHAR(100),
    entidad VARCHAR(50),
    datos_previos JSONB,
    datos_nuevos JSONB,
    fecha TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- Vistas materializadas para dashboards
-- ========================
CREATE MATERIALIZED VIEW mv_empleabilidad_por_carrera AS
SELECT 
    e.carrera,
    EXTRACT(YEAR FROM p.fecha_postulacion) AS anio,
    COUNT(DISTINCT e.id) AS total_egresados,
    COUNT(DISTINCT CASE WHEN p.estado = 'contratado' THEN p.egresado_id END) AS empleados,
    ROUND(100.0 * COUNT(DISTINCT CASE WHEN p.estado = 'contratado' THEN p.egresado_id END) / NULLIF(COUNT(DISTINCT e.id), 0), 2) AS tasa_empleabilidad
FROM egresados e
LEFT JOIN postulaciones p ON e.id = p.egresado_id
GROUP BY e.carrera, anio;

CREATE MATERIALIZED VIEW mv_demanda_habilidades AS
SELECT 
    h.id AS habilidad_id,
    h.nombre AS habilidad_nombre,
    COUNT(DISTINCT oh.oferta_id) AS cantidad_ofertas,
    COUNT(DISTINCT eh.egresado_id) AS cantidad_egresados,
    ROUND(100.0 * COUNT(DISTINCT oh.oferta_id) / NULLIF((SELECT COUNT(*) FROM ofertas WHERE activa = true), 0), 2) AS porcentaje_demanda
FROM habilidades h
LEFT JOIN oferta_habilidad oh ON h.id = oh.habilidad_id
LEFT JOIN egresado_habilidad eh ON h.id = eh.habilidad_id
GROUP BY h.id, h.nombre;

-- Índices para vistas materializadas
CREATE UNIQUE INDEX idx_mv_empleabilidad_carrera_anio ON mv_empleabilidad_por_carrera(carrera, anio);
CREATE UNIQUE INDEX idx_mv_demanda_habilidad ON mv_demanda_habilidades(habilidad_id);

-- ========================
-- Funciones y triggers
-- ========================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para actualizar fecha_estado en postulaciones
CREATE OR REPLACE FUNCTION update_postulacion_fecha_estado()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_estado = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_postulaciones_fecha_estado
    BEFORE UPDATE OF estado ON postulaciones
    FOR EACH ROW EXECUTE FUNCTION update_postulacion_fecha_estado();

-- Trigger para registrar historial de cambios en postulaciones
CREATE OR REPLACE FUNCTION log_estado_postulacion()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.estado IS DISTINCT FROM NEW.estado THEN
        INSERT INTO historial_estados (postulacion_id, estado_anterior, estado_nuevo, cambiado_por)
        VALUES (NEW.id, OLD.estado, NEW.estado, auth_user_id()); -- auth_user_id debe ser definida por contexto de sesión
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_log_estado_postulacion
    AFTER UPDATE OF estado ON postulaciones
    FOR EACH ROW EXECUTE FUNCTION log_estado_postulacion();

-- Función para refrescar vistas materializadas periódicamente (usar cron o pg_cron)
CREATE OR REPLACE FUNCTION refresh_dashboard_views()
RETURNS VOID AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_empleabilidad_por_carrera;
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_demanda_habilidades;
END;
$$ LANGUAGE plpgsql;