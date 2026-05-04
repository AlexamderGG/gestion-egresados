// backend/src/trpc/trpc.router.ts
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';
import { PrismaService } from '../prisma/prisma.service';
import { DashboardService } from '../modules/dashboard/dashboard.service';

// Definir el contexto (debe tener prisma y opcionalmente user)
export interface TrpcContext {
  prisma: PrismaService;
  user?: { id: string; email: string; role: string };
}

const t = initTRPC.context<TrpcContext>().create();

// Middleware de autenticación
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });
  return next({ ctx: { user: ctx.user } });
});

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
export const router = t.router;

// Instancia del servicio (lo puedes obtener del contenedor de NestJS, pero aquí simplificamos)
const prisma = new PrismaService();
const dashboardService = new DashboardService(prisma, null as any); // Inyección simple, luego ajusta

export const appRouter = router({
  health: publicProcedure.query(() => ({ status: 'ok' })),

  auth: router({
    // Login (público)
    login: publicProcedure
      .input(z.object({ email: z.string().email(), password: z.string() }))
      .mutation(async ({ input }) => {
        const { email, password } = input;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Credenciales inválidas' });
        }
        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
          throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Credenciales inválidas' });
        }
        const token = jwt.sign(
          { sub: user.id, email: user.email, role: user.role },
          process.env.JWT_SECRET || 'secreto-temporal',
          { expiresIn: '7d' }
        );
        return { access_token: token };
      }),

    // Obtener usuario actual (protegido)
    getMe: protectedProcedure.query(({ ctx }) => {
      return ctx.user;
    }),
  }),
  // =================================================
  // Dashboard namespace
  dashboard: router({
    getGlobalKpis: protectedProcedure.query(async () => {
      return dashboardService.getGlobalKpis();
    }),
    getOfertasVsPostulacionesMensual: protectedProcedure
      .input(z.object({ anio: z.number() }))
      .query(async ({ input }) => {
        return dashboardService.getOfertasVsPostulacionesMensual(input.anio);
      }),
    getDemandaHabilidades: protectedProcedure.query(async () => {
      return dashboardService.getDemandaHabilidades();
    }),
  }),

  egresados_list: protectedProcedure
    .input(z.object({ carrera: z.string().optional(), anioEgreso: z.number().optional() }))
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

  habilidades_list: publicProcedure.query(() => {
    return prisma.habilidad.findMany();
  }),
  

  egresados_create: protectedProcedure
  .input(z.object({
    email: z.string().email(),
    password: z.string().min(6),
    nombres: z.string(),
    apellidos: z.string(),
    telefono: z.string().optional(),
    carrera: z.string(),
    anioEgreso: z.number(),
    cvUrl: z.string().optional(),
    habilidadesBlandas: z.string().optional(),
    fechaNacimiento: z.date().optional(),
    habilidades: z.array(z.object({ habilidadId: z.string(), nivel: z.number().min(1).max(5) }))
  }))
  .mutation(async ({ input }) => {
    const hashedPassword = await bcrypt.hash(input.password, 10);
    // Crear usuario con rol 'egresado'
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

  // Aquí agregarás los routers de egresados, ofertas, etc.
});

export type AppRouter = typeof appRouter;