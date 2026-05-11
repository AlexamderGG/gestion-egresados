"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = exports.router = exports.protectedProcedure = exports.publicProcedure = void 0;
const bcrypt = __importStar(require("bcryptjs"));
const jwt = __importStar(require("jsonwebtoken"));
const server_1 = require("@trpc/server");
const zod_1 = require("zod");
const prisma_service_1 = require("../prisma/prisma.service");
const dashboard_service_1 = require("../modules/dashboard/dashboard.service");
const reportes_service_1 = require("../modules/reportes/reportes.service");
const storage_service_1 = require("../common/storage/storage.service");
const t = server_1.initTRPC.context().create();
const isAuthed = t.middleware(({ ctx, next }) => {
    if (!ctx.user)
        throw new server_1.TRPCError({ code: 'UNAUTHORIZED' });
    return next({ ctx: { user: ctx.user } });
});
exports.publicProcedure = t.procedure;
exports.protectedProcedure = t.procedure.use(isAuthed);
exports.router = t.router;
const prisma = new prisma_service_1.PrismaService();
const dashboardService = new dashboard_service_1.DashboardService(prisma, null);
const storageService = new storage_service_1.StorageService();
const reportesService = new reportes_service_1.ReportesService(prisma, storageService);
exports.appRouter = (0, exports.router)({
    health: exports.publicProcedure.query(() => ({ status: 'ok' })),
    auth: (0, exports.router)({
        login: exports.publicProcedure
            .input(zod_1.z.object({ email: zod_1.z.string().email(), password: zod_1.z.string() }))
            .mutation(async ({ input }) => {
            const { email, password } = input;
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                throw new server_1.TRPCError({ code: 'UNAUTHORIZED', message: 'Credenciales inválidas' });
            }
            const isValid = await bcrypt.compare(password, user.passwordHash);
            if (!isValid) {
                throw new server_1.TRPCError({ code: 'UNAUTHORIZED', message: 'Credenciales inválidas' });
            }
            const token = jwt.sign({ sub: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'secreto-temporal', { expiresIn: '7d' });
            return { access_token: token };
        }),
        getMe: exports.protectedProcedure.query(({ ctx }) => {
            return ctx.user;
        }),
    }),
    dashboard: (0, exports.router)({
        getGlobalKpis: exports.protectedProcedure.query(async () => {
            return dashboardService.getGlobalKpis();
        }),
        getOfertasVsPostulacionesMensual: exports.protectedProcedure
            .input(zod_1.z.object({ anio: zod_1.z.number() }))
            .query(async ({ input }) => {
            const { anio } = input;
            const ofertas = await prisma.oferta.findMany({
                where: { fechaPublicacion: { gte: new Date(`${anio}-01-01`), lt: new Date(`${anio + 1}-01-01`) } },
                select: { id: true, fechaPublicacion: true },
            });
            const postulaciones = await prisma.postulacion.findMany({
                where: { oferta: { fechaPublicacion: { gte: new Date(`${anio}-01-01`), lt: new Date(`${anio + 1}-01-01`) } } },
                select: { ofertaId: true, fechaPostulacion: true },
            });
            const ofertasPorMes = {};
            for (let mes = 1; mes <= 12; mes++)
                ofertasPorMes[mes] = 0;
            for (const oferta of ofertas) {
                const mes = new Date(oferta.fechaPublicacion).getMonth() + 1;
                ofertasPorMes[mes]++;
            }
            const postulacionesPorMes = {};
            for (let mes = 1; mes <= 12; mes++)
                postulacionesPorMes[mes] = 0;
            for (const postulacion of postulaciones) {
                const mes = new Date(postulacion.fechaPostulacion).getMonth() + 1;
                postulacionesPorMes[mes]++;
            }
            const result = [];
            for (let mes = 1; mes <= 12; mes++) {
                result.push({
                    mes: mes,
                    ofertas: ofertasPorMes[mes],
                    postulaciones: postulacionesPorMes[mes],
                });
            }
            return result;
        }),
        getDemandaHabilidades: exports.protectedProcedure.query(async () => {
            const result = await prisma.ofertaHabilidad.groupBy({
                by: ['habilidadId'],
                _count: { ofertaId: true },
                orderBy: { _count: { ofertaId: 'desc' } },
                take: 10,
            });
            const habilidadesIds = result.map(r => r.habilidadId);
            const habilidades = await prisma.habilidad.findMany({
                where: { id: { in: habilidadesIds } },
                select: { id: true, nombre: true },
            });
            const habilidadMap = new Map(habilidades.map(h => [h.id, h.nombre]));
            return result.map((item) => ({
                habilidad_id: item.habilidadId,
                habilidad_nombre: habilidadMap.get(item.habilidadId) || 'Desconocida',
                cantidad_ofertas: item._count.ofertaId,
                cantidad_egresados: 0,
                porcentaje_demanda: 0,
            }));
        }),
    }),
    egresados_list: exports.protectedProcedure
        .input(zod_1.z.object({ carrera: zod_1.z.string().optional(), anioEgreso: zod_1.z.number().optional() }))
        .query(async ({ input }) => {
        return prisma.egresado.findMany({
            where: {
                ...(input.carrera ? { carrera: { contains: input.carrera, mode: 'insensitive' } } : {}),
                ...(input.anioEgreso ? { anioEgreso: input.anioEgreso } : {}),
            },
            include: {
                user: { select: { email: true } },
                habilidades: { include: { habilidad: true } },
            },
        });
    }),
    habilidades_list: exports.publicProcedure.query(() => {
        return prisma.habilidad.findMany();
    }),
    egresados_create: exports.protectedProcedure
        .input(zod_1.z.object({
        email: zod_1.z.string().email(),
        password: zod_1.z.string().min(6),
        nombres: zod_1.z.string(),
        apellidos: zod_1.z.string(),
        telefono: zod_1.z.string().optional(),
        carrera: zod_1.z.string(),
        anioEgreso: zod_1.z.number(),
        cvUrl: zod_1.z.string().optional(),
        habilidadesBlandas: zod_1.z.string().optional(),
        fechaNacimiento: zod_1.z.string().optional().transform((val) => val ? new Date(val) : null),
        habilidades: zod_1.z.array(zod_1.z.object({ habilidadId: zod_1.z.string(), nivel: zod_1.z.number().min(1).max(5) }))
    }))
        .mutation(async ({ input }) => {
        const hashedPassword = await bcrypt.hash(input.password, 10);
        const user = await prisma.user.create({
            data: {
                email: input.email,
                passwordHash: hashedPassword,
                role: 'egresado',
                egresado: {
                    create: {
                        nombres: input.nombres,
                        apellidos: input.apellidos,
                        telefono: input.telefono,
                        carrera: input.carrera,
                        anioEgreso: input.anioEgreso,
                        cvUrl: input.cvUrl,
                        habilidadesBlandas: input.habilidadesBlandas,
                        fechaNacimiento: input.fechaNacimiento,
                        habilidades: {
                            create: input.habilidades.map(h => ({
                                habilidadId: h.habilidadId,
                                nivel: h.nivel
                            }))
                        }
                    }
                }
            },
            include: { egresado: true }
        });
        return user;
    }),
    ofertas_list: exports.protectedProcedure
        .input(zod_1.z.object({ titulo: zod_1.z.string().optional(), modalidad: zod_1.z.string().optional() }))
        .query(async ({ input }) => {
        return prisma.oferta.findMany({
            where: {
                ...(input.titulo ? { titulo: { contains: input.titulo, mode: 'insensitive' } } : {}),
                ...(input.modalidad ? { modalidad: input.modalidad } : {}),
            },
            include: { empresa: true, habilidades: { include: { habilidad: true } } },
        });
    }),
    ofertas_create: exports.protectedProcedure
        .input(zod_1.z.object({
        titulo: zod_1.z.string().min(1),
        descripcion: zod_1.z.string().min(10),
        ubicacion: zod_1.z.string().optional(),
        modalidad: zod_1.z.enum(['remoto', 'hibrido', 'presencial']),
        tipoContrato: zod_1.z.string().optional(),
        salarioMin: zod_1.z.number().optional(),
        salarioMax: zod_1.z.number().optional(),
        vacantes: zod_1.z.number().int().min(1).default(1),
        fechaCierre: zod_1.z.string().optional().transform(val => val ? new Date(val) : null),
    }))
        .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== 'empresa') {
            throw new server_1.TRPCError({ code: 'FORBIDDEN', message: 'Solo empresas pueden publicar ofertas' });
        }
        const empresa = await prisma.empresa.findUnique({ where: { id: ctx.user.id } });
        if (!empresa)
            throw new server_1.TRPCError({ code: 'FORBIDDEN', message: 'Perfil de empresa no encontrado' });
        return prisma.oferta.create({
            data: {
                empresaId: ctx.user.id,
                titulo: input.titulo,
                descripcion: input.descripcion,
                ubicacion: input.ubicacion,
                modalidad: input.modalidad,
                tipoContrato: input.tipoContrato,
                salarioMin: input.salarioMin,
                salarioMax: input.salarioMax,
                vacantes: input.vacantes,
                fechaCierre: input.fechaCierre,
                activa: true,
            },
        });
    }),
    ofertas_update: exports.protectedProcedure
        .input(zod_1.z.object({
        id: zod_1.z.string(),
        titulo: zod_1.z.string().optional(),
        descripcion: zod_1.z.string().optional(),
        ubicacion: zod_1.z.string().optional(),
        modalidad: zod_1.z.enum(['remoto', 'hibrido', 'presencial']).optional(),
        tipoContrato: zod_1.z.string().optional(),
        salarioMin: zod_1.z.number().optional(),
        salarioMax: zod_1.z.number().optional(),
        vacantes: zod_1.z.number().int().min(1).optional(),
        activa: zod_1.z.boolean().optional(),
    }))
        .mutation(async ({ ctx, input }) => {
        const oferta = await prisma.oferta.findUnique({ where: { id: input.id } });
        if (!oferta)
            throw new server_1.TRPCError({ code: 'NOT_FOUND' });
        if (ctx.user.role !== 'empresa' || oferta.empresaId !== ctx.user.id) {
            throw new server_1.TRPCError({ code: 'FORBIDDEN' });
        }
        const updateData = {};
        if (input.titulo !== undefined)
            updateData.titulo = input.titulo;
        if (input.descripcion !== undefined)
            updateData.descripcion = input.descripcion;
        if (input.ubicacion !== undefined)
            updateData.ubicacion = input.ubicacion;
        if (input.modalidad !== undefined)
            updateData.modalidad = input.modalidad;
        if (input.tipoContrato !== undefined)
            updateData.tipoContrato = input.tipoContrato;
        if (input.salarioMin !== undefined)
            updateData.salarioMin = input.salarioMin;
        if (input.salarioMax !== undefined)
            updateData.salarioMax = input.salarioMax;
        if (input.vacantes !== undefined)
            updateData.vacantes = input.vacantes;
        if (input.activa !== undefined)
            updateData.activa = input.activa;
        return prisma.oferta.update({
            where: { id: input.id },
            data: updateData,
        });
    }),
    ofertas_cerrar: exports.protectedProcedure
        .input(zod_1.z.object({ id: zod_1.z.string() }))
        .mutation(async ({ ctx, input }) => {
        const oferta = await prisma.oferta.findUnique({ where: { id: input.id } });
        if (!oferta)
            throw new server_1.TRPCError({ code: 'NOT_FOUND' });
        if (ctx.user.role !== 'empresa' || oferta.empresaId !== ctx.user.id) {
            throw new server_1.TRPCError({ code: 'FORBIDDEN' });
        }
        return prisma.oferta.update({
            where: { id: input.id },
            data: { activa: false, fechaCierre: new Date() },
        });
    }),
    ofertas_postular: exports.protectedProcedure
        .input(zod_1.z.object({ ofertaId: zod_1.z.string(), comentario: zod_1.z.string().optional() }))
        .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== 'egresado') {
            throw new server_1.TRPCError({ code: 'FORBIDDEN', message: 'Solo egresados pueden postular' });
        }
        const oferta = await prisma.oferta.findUnique({ where: { id: input.ofertaId } });
        if (!oferta)
            throw new server_1.TRPCError({ code: 'NOT_FOUND', message: 'Oferta no encontrada' });
        if (!oferta.activa) {
            throw new server_1.TRPCError({ code: 'BAD_REQUEST', message: 'Esta oferta ya está cerrada' });
        }
        if (oferta.fechaCierre && new Date(oferta.fechaCierre) < new Date()) {
            await prisma.oferta.update({
                where: { id: input.ofertaId },
                data: { activa: false },
            });
            throw new server_1.TRPCError({ code: 'BAD_REQUEST', message: 'La fecha de cierre ha pasado' });
        }
        if (oferta.vacantesCubiertas >= oferta.vacantes) {
            throw new server_1.TRPCError({ code: 'BAD_REQUEST', message: 'No hay vacantes disponibles para esta oferta' });
        }
        const yaPostulado = await prisma.postulacion.findFirst({
            where: { ofertaId: input.ofertaId, egresadoId: ctx.user.id },
        });
        if (yaPostulado) {
            throw new server_1.TRPCError({ code: 'CONFLICT', message: 'Ya te has postulado a esta oferta' });
        }
        return prisma.postulacion.create({
            data: {
                ofertaId: input.ofertaId,
                egresadoId: ctx.user.id,
                estado: 'postulado',
                comentario: input.comentario,
            },
        });
    }),
    postulaciones_actualizar_estado: exports.protectedProcedure
        .input(zod_1.z.object({
        postulacionId: zod_1.z.string(),
        estado: zod_1.z.enum(['postulado', 'revision', 'entrevista', 'contratado', 'rechazado']),
    }))
        .mutation(async ({ ctx, input }) => {
        const postulacion = await prisma.postulacion.findUnique({
            where: { id: input.postulacionId },
            include: { oferta: true },
        });
        if (!postulacion)
            throw new server_1.TRPCError({ code: 'NOT_FOUND' });
        if (ctx.user.role !== 'empresa' || postulacion.oferta.empresaId !== ctx.user.id) {
            throw new server_1.TRPCError({ code: 'FORBIDDEN' });
        }
        await prisma.historialEstado.create({
            data: {
                postulacionId: input.postulacionId,
                estadoAnterior: postulacion.estado,
                estadoNuevo: input.estado,
                cambiadoPor: ctx.user.id,
            },
        });
        if (input.estado === 'contratado' && postulacion.estado !== 'contratado') {
            await prisma.oferta.update({
                where: { id: postulacion.ofertaId },
                data: { vacantesCubiertas: { increment: 1 } },
            });
            const ofertaActualizada = await prisma.oferta.findUnique({
                where: { id: postulacion.ofertaId },
            });
            if (ofertaActualizada && ofertaActualizada.vacantesCubiertas >= ofertaActualizada.vacantes) {
                await prisma.oferta.update({
                    where: { id: postulacion.ofertaId },
                    data: { activa: false, fechaCierre: new Date() },
                });
            }
        }
        return prisma.postulacion.update({
            where: { id: input.postulacionId },
            data: { estado: input.estado, fechaEstado: new Date() },
        });
    }),
    postulaciones_mis_ofertas: exports.protectedProcedure.query(async ({ ctx }) => {
        if (ctx.user.role !== 'empresa')
            return [];
        return prisma.postulacion.findMany({
            where: { oferta: { empresaId: ctx.user.id } },
            include: {
                egresado: {
                    include: { user: { select: { email: true } } },
                },
                oferta: true,
            },
            orderBy: { fechaPostulacion: 'desc' },
        });
    }),
    ofertas_delete: exports.protectedProcedure
        .input(zod_1.z.object({ id: zod_1.z.string() }))
        .mutation(async ({ ctx, input }) => {
        const oferta = await prisma.oferta.findUnique({ where: { id: input.id } });
        if (!oferta)
            throw new server_1.TRPCError({ code: 'NOT_FOUND' });
        if (ctx.user.role !== 'empresa' || oferta.empresaId !== ctx.user.id)
            throw new server_1.TRPCError({ code: 'FORBIDDEN' });
        return prisma.oferta.delete({ where: { id: input.id } });
    }),
    ofertas_mis_ofertas: exports.protectedProcedure.query(async ({ ctx }) => {
        if (ctx.user.role !== 'empresa')
            return [];
        return prisma.oferta.findMany({
            where: { empresaId: ctx.user.id },
            include: { empresa: true },
            orderBy: { fechaPublicacion: 'desc' },
        });
    }),
    analitica: (0, exports.router)({
        getEgresadosPorCarrera: exports.protectedProcedure.query(async () => {
            const result = await prisma.egresado.groupBy({
                by: ['carrera'],
                _count: { id: true },
            });
            return result.map((item) => ({
                carrera: item.carrera || 'No especificada',
                total: item._count.id,
            }));
        }),
        getEvolucionPostulaciones: exports.protectedProcedure.query(async () => {
            const postulaciones = await prisma.postulacion.findMany({
                select: { fechaPostulacion: true },
                orderBy: { fechaPostulacion: 'asc' },
            });
            const meses = {};
            for (const p of postulaciones) {
                const fecha = new Date(p.fechaPostulacion);
                const mes = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
                meses[mes] = (meses[mes] || 0) + 1;
            }
            return Object.entries(meses).map(([mes, postulaciones]) => ({ mes, postulaciones }));
        }),
        getEmpleabilidadPorCarrera: exports.protectedProcedure.query(async () => {
            const egresados = await prisma.egresado.findMany({
                select: { id: true, carrera: true },
            });
            const contratadosRaw = await prisma.postulacion.findMany({
                where: { estado: 'contratado' },
                select: { egresadoId: true },
                distinct: ['egresadoId'],
            });
            const contratadosIds = new Set(contratadosRaw.map(c => c.egresadoId));
            const carreraStats = {};
            for (const eg of egresados) {
                const carrera = eg.carrera || 'No especificada';
                if (!carreraStats[carrera]) {
                    carreraStats[carrera] = { total: 0, contratados: 0 };
                }
                carreraStats[carrera].total++;
                if (contratadosIds.has(eg.id)) {
                    carreraStats[carrera].contratados++;
                }
            }
            return Object.entries(carreraStats).map(([carrera, stats]) => ({
                carrera,
                tasa_empleabilidad: stats.total === 0 ? 0 : Math.round((stats.contratados / stats.total) * 100),
            }));
        }),
    }),
    egresados_delete: exports.protectedProcedure
        .input(zod_1.z.object({ id: zod_1.z.string() }))
        .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== 'admin') {
            throw new server_1.TRPCError({ code: 'FORBIDDEN', message: 'No autorizado' });
        }
        const egresado = await prisma.egresado.findUnique({ where: { id: input.id } });
        if (!egresado) {
            throw new server_1.TRPCError({ code: 'NOT_FOUND', message: 'Egresado no encontrado' });
        }
        await prisma.$transaction([
            prisma.historialEstado.deleteMany({
                where: { postulacion: { egresadoId: input.id } },
            }),
            prisma.postulacion.deleteMany({ where: { egresadoId: input.id } }),
            prisma.egresadoHabilidad.deleteMany({ where: { egresadoId: input.id } }),
            prisma.notificacion.deleteMany({ where: { usuarioId: input.id } }),
            prisma.reporte.deleteMany({ where: { usuarioId: input.id } }),
            prisma.auditoriaLog.deleteMany({ where: { usuarioId: input.id } }),
            prisma.egresado.delete({ where: { id: input.id } }),
            prisma.user.delete({ where: { id: input.id } }),
        ]);
        return { success: true };
    }),
    egresados_getById: exports.protectedProcedure
        .input(zod_1.z.object({ id: zod_1.z.string() }))
        .query(async ({ input }) => {
        return prisma.egresado.findUnique({
            where: { id: input.id },
            include: {
                user: { select: { email: true } },
                habilidades: { include: { habilidad: true } },
            },
        });
    }),
    reportes: (0, exports.router)({
        solicitar: exports.protectedProcedure
            .input(zod_1.z.object({
            tipo: zod_1.z.string(),
            filtros: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional()
        }))
            .mutation(({ ctx, input }) => {
            return reportesService.solicitarReporte(ctx.user.id, input.tipo, input.filtros || {});
        }),
        listar: exports.protectedProcedure.query(({ ctx }) => {
            return reportesService.listarReportes(ctx.user.id);
        }),
        descargar: exports.protectedProcedure
            .input(zod_1.z.object({ reporteId: zod_1.z.string() }))
            .query(({ input }) => {
            return reportesService.descargarReporte(input.reporteId);
        }),
    }),
    postulaciones_mis_postulaciones: exports.protectedProcedure.query(async ({ ctx }) => {
        if (ctx.user.role !== 'egresado')
            return [];
        return prisma.postulacion.findMany({
            where: { egresadoId: ctx.user.id },
            include: { oferta: { include: { empresa: true } } },
            orderBy: { fechaPostulacion: 'desc' },
        });
    }),
});
//# sourceMappingURL=trpc.router.js.map