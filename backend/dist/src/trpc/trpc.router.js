"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = exports.router = exports.protectedProcedure = exports.publicProcedure = void 0;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const server_1 = require("@trpc/server");
const zod_1 = require("zod");
const prisma_service_1 = require("../prisma/prisma.service");
const dashboard_service_1 = require("../modules/dashboard/dashboard.service");
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
            return dashboardService.getOfertasVsPostulacionesMensual(input.anio);
        }),
        getDemandaHabilidades: exports.protectedProcedure.query(async () => {
            return dashboardService.getDemandaHabilidades();
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
        fechaNacimiento: zod_1.z.date().optional(),
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
});
//# sourceMappingURL=trpc.router.js.map