-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'egresado', 'empresa');

-- CreateEnum
CREATE TYPE "CategoriaHabilidad" AS ENUM ('tecnica', 'blanda');

-- CreateEnum
CREATE TYPE "Modalidad" AS ENUM ('remoto', 'hibrido', 'presencial');

-- CreateEnum
CREATE TYPE "EstadoPostulacion" AS ENUM ('postulado', 'revision', 'entrevista', 'contratado', 'rechazado');

-- CreateEnum
CREATE TYPE "TipoNotificacion" AS ENUM ('email', 'interna');

-- CreateEnum
CREATE TYPE "EstadoReporte" AS ENUM ('en_cola', 'procesando', 'completado', 'error');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "egresados" (
    "id" TEXT NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "telefono" TEXT,
    "carrera" TEXT,
    "anio_egreso" INTEGER,
    "cv_url" TEXT,
    "habilidades_blandas" TEXT,
    "fecha_nacimiento" TIMESTAMP(3),

    CONSTRAINT "egresados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "empresas" (
    "id" TEXT NOT NULL,
    "nombre_empresa" TEXT NOT NULL,
    "sector" TEXT,
    "ubicacion" TEXT,
    "website" TEXT,

    CONSTRAINT "empresas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "habilidades" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "categoria" "CategoriaHabilidad" NOT NULL,

    CONSTRAINT "habilidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "egresado_habilidad" (
    "egresado_id" TEXT NOT NULL,
    "habilidad_id" TEXT NOT NULL,
    "nivel" INTEGER NOT NULL,

    CONSTRAINT "egresado_habilidad_pkey" PRIMARY KEY ("egresado_id","habilidad_id")
);

-- CreateTable
CREATE TABLE "ofertas" (
    "id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "ubicacion" TEXT,
    "modalidad" "Modalidad",
    "tipo_contrato" TEXT,
    "salario_min" INTEGER,
    "salario_max" INTEGER,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "fecha_publicacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_cierre" TIMESTAMP(3),

    CONSTRAINT "ofertas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oferta_habilidad" (
    "oferta_id" TEXT NOT NULL,
    "habilidad_id" TEXT NOT NULL,

    CONSTRAINT "oferta_habilidad_pkey" PRIMARY KEY ("oferta_id","habilidad_id")
);

-- CreateTable
CREATE TABLE "postulaciones" (
    "id" TEXT NOT NULL,
    "oferta_id" TEXT NOT NULL,
    "egresado_id" TEXT NOT NULL,
    "estado" "EstadoPostulacion" NOT NULL DEFAULT 'postulado',
    "fecha_postulacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_estado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "comentario" TEXT,

    CONSTRAINT "postulaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historial_estados" (
    "id" TEXT NOT NULL,
    "postulacion_id" TEXT NOT NULL,
    "estado_anterior" TEXT,
    "estadoNuevo" TEXT NOT NULL,
    "fecha_cambio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cambiado_por" TEXT,

    CONSTRAINT "historial_estados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notificaciones" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "tipo" "TipoNotificacion" NOT NULL,
    "asunto" TEXT,
    "contenido" TEXT NOT NULL,
    "leida" BOOLEAN NOT NULL DEFAULT false,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_envio" TIMESTAMP(3),

    CONSTRAINT "notificaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reportes" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "tipo_reporte" TEXT NOT NULL,
    "filtros_aplicados" JSONB,
    "url_pdf" TEXT,
    "estado" "EstadoReporte" NOT NULL DEFAULT 'en_cola',
    "fecha_solicitud" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_completado" TIMESTAMP(3),

    CONSTRAINT "reportes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auditoria_logs" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT,
    "accion" TEXT NOT NULL,
    "entidad" TEXT NOT NULL,
    "datos_previos" JSONB,
    "datos_nuevos" JSONB,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auditoria_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "habilidades_nombre_key" ON "habilidades"("nombre");

-- CreateIndex
CREATE INDEX "ofertas_empresa_id_idx" ON "ofertas"("empresa_id");

-- CreateIndex
CREATE INDEX "ofertas_activa_fecha_publicacion_idx" ON "ofertas"("activa", "fecha_publicacion");

-- CreateIndex
CREATE INDEX "ofertas_modalidad_idx" ON "ofertas"("modalidad");

-- CreateIndex
CREATE INDEX "postulaciones_oferta_id_idx" ON "postulaciones"("oferta_id");

-- CreateIndex
CREATE INDEX "postulaciones_egresado_id_idx" ON "postulaciones"("egresado_id");

-- CreateIndex
CREATE INDEX "postulaciones_estado_fecha_postulacion_idx" ON "postulaciones"("estado", "fecha_postulacion");

-- CreateIndex
CREATE UNIQUE INDEX "postulaciones_oferta_id_egresado_id_key" ON "postulaciones"("oferta_id", "egresado_id");

-- CreateIndex
CREATE INDEX "notificaciones_usuario_id_leida_idx" ON "notificaciones"("usuario_id", "leida");

-- CreateIndex
CREATE INDEX "reportes_usuario_id_estado_idx" ON "reportes"("usuario_id", "estado");

-- AddForeignKey
ALTER TABLE "egresados" ADD CONSTRAINT "egresados_id_fkey" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empresas" ADD CONSTRAINT "empresas_id_fkey" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "egresado_habilidad" ADD CONSTRAINT "egresado_habilidad_egresado_id_fkey" FOREIGN KEY ("egresado_id") REFERENCES "egresados"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "egresado_habilidad" ADD CONSTRAINT "egresado_habilidad_habilidad_id_fkey" FOREIGN KEY ("habilidad_id") REFERENCES "habilidades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ofertas" ADD CONSTRAINT "ofertas_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oferta_habilidad" ADD CONSTRAINT "oferta_habilidad_oferta_id_fkey" FOREIGN KEY ("oferta_id") REFERENCES "ofertas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oferta_habilidad" ADD CONSTRAINT "oferta_habilidad_habilidad_id_fkey" FOREIGN KEY ("habilidad_id") REFERENCES "habilidades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postulaciones" ADD CONSTRAINT "postulaciones_oferta_id_fkey" FOREIGN KEY ("oferta_id") REFERENCES "ofertas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postulaciones" ADD CONSTRAINT "postulaciones_egresado_id_fkey" FOREIGN KEY ("egresado_id") REFERENCES "egresados"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial_estados" ADD CONSTRAINT "historial_estados_postulacion_id_fkey" FOREIGN KEY ("postulacion_id") REFERENCES "postulaciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reportes" ADD CONSTRAINT "reportes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auditoria_logs" ADD CONSTRAINT "auditoria_logs_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
