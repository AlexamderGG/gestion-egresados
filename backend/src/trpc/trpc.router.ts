// backend/src/trpc/trpc.router.ts
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';
import { PrismaService } from '../prisma/prisma.service';
import { DashboardService } from '../modules/dashboard/dashboard.service';
import { ReportesService } from '../modules/reportes/reportes.service';
import { StorageService } from '../common/storage/storage.service';



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

// ✅ 1. Primero declara prisma (una sola vez)
const prisma = new PrismaService();
// ✅ 2. Luego instancia los servicios que necesiten prisma
const dashboardService = new DashboardService(prisma, null as any); // Inyección simple, luego ajusta
const storageService = new StorageService();
const reportesService = new ReportesService(prisma, storageService); // Orden: prisma, storage

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
        const { anio } = input;
        
        // Obtener todas las ofertas del año
        const ofertas = await prisma.oferta.findMany({
          where: { fechaPublicacion: { gte: new Date(`${anio}-01-01`), lt: new Date(`${anio + 1}-01-01`) } },
          select: { id: true, fechaPublicacion: true },
        });
        
        // Obtener todas las postulaciones de ofertas del año
        const postulaciones = await prisma.postulacion.findMany({
          where: { oferta: { fechaPublicacion: { gte: new Date(`${anio}-01-01`), lt: new Date(`${anio + 1}-01-01`) } } },
          select: { ofertaId: true, fechaPostulacion: true },
        });
        
        // Contar ofertas por mes
        const ofertasPorMes: Record<number, number> = {};
        for (let mes = 1; mes <= 12; mes++) ofertasPorMes[mes] = 0;
        
        for (const oferta of ofertas) {
          const mes = new Date(oferta.fechaPublicacion).getMonth() + 1;
          ofertasPorMes[mes]++;
        }
        
        // Contar postulaciones por mes
        const postulacionesPorMes: Record<number, number> = {};
        for (let mes = 1; mes <= 12; mes++) postulacionesPorMes[mes] = 0;
        
        for (const postulacion of postulaciones) {
          const mes = new Date(postulacion.fechaPostulacion).getMonth() + 1;
          postulacionesPorMes[mes]++;
        }
        
        // Construir resultado
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
    getDemandaHabilidades: protectedProcedure.query(async () => {
      // Consulta directa a la base de datos sin usar vistas materializadas
      const result = await prisma.ofertaHabilidad.groupBy({
        by: ['habilidadId'],
        _count: { ofertaId: true },
        orderBy: { _count: { ofertaId: 'desc' } },
        take: 10,
      });
      
      // Obtener los nombres de las habilidades
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
        cantidad_egresados: 0, // Opcional, se puede calcular después
        porcentaje_demanda: 0,  // Opcional, se puede calcular después
      }));
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
    fechaNacimiento: z.string().optional().transform((val) => val ? new Date(val) : null),
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

  ofertas_list: protectedProcedure
  .input(z.object({ titulo: z.string().optional(), modalidad: z.string().optional() }))
  .query(async ({ input }) => {
    return prisma.oferta.findMany({
      where: {
        ...(input.titulo ? { titulo: { contains: input.titulo, mode: 'insensitive' } } : {}),
        ...(input.modalidad ? { modalidad: input.modalidad as any } : {}),
      },
      include: { empresa: true, habilidades: { include: { habilidad: true } } },
    });
  }),

// Crear oferta (actualizado)
ofertas_create: protectedProcedure
  .input(z.object({
    titulo: z.string().min(1),
    descripcion: z.string().min(10),
    ubicacion: z.string().optional(),
    modalidad: z.enum(['remoto', 'hibrido', 'presencial']),
    tipoContrato: z.string().optional(),
    salarioMin: z.number().optional(),
    salarioMax: z.number().optional(),
    vacantes: z.number().int().min(1).default(1),
    fechaCierre: z.string().optional().transform(val => val ? new Date(val) : null),
  }))
  .mutation(async ({ ctx, input }) => {
    if (ctx.user.role !== 'empresa') {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Solo empresas pueden publicar ofertas' });
    }
    const empresa = await prisma.empresa.findUnique({ where: { id: ctx.user.id } });
    if (!empresa) throw new TRPCError({ code: 'FORBIDDEN', message: 'Perfil de empresa no encontrado' });
    
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

// Editar oferta (nuevo)
ofertas_update: protectedProcedure
  .input(z.object({
    id: z.string(),
    titulo: z.string().optional(),
    descripcion: z.string().optional(),
    ubicacion: z.string().optional(),
    modalidad: z.enum(['remoto', 'hibrido', 'presencial']).optional(),
    tipoContrato: z.string().optional(),
    salarioMin: z.number().optional(),
    salarioMax: z.number().optional(),
    vacantes: z.number().int().min(1).optional(),
    activa: z.boolean().optional(),
  }))
  .mutation(async ({ ctx, input }) => {
    const oferta = await prisma.oferta.findUnique({ where: { id: input.id } });
    if (!oferta) throw new TRPCError({ code: 'NOT_FOUND' });
    if (ctx.user.role !== 'empresa' || oferta.empresaId !== ctx.user.id) {
      throw new TRPCError({ code: 'FORBIDDEN' });
    }
    
    // Preparar datos para actualizar
    const updateData: any = {};
    if (input.titulo !== undefined) updateData.titulo = input.titulo;
    if (input.descripcion !== undefined) updateData.descripcion = input.descripcion;
    if (input.ubicacion !== undefined) updateData.ubicacion = input.ubicacion;
    if (input.modalidad !== undefined) updateData.modalidad = input.modalidad;
    if (input.tipoContrato !== undefined) updateData.tipoContrato = input.tipoContrato;
    if (input.salarioMin !== undefined) updateData.salarioMin = input.salarioMin;
    if (input.salarioMax !== undefined) updateData.salarioMax = input.salarioMax;
    if (input.vacantes !== undefined) updateData.vacantes = input.vacantes;
    if (input.activa !== undefined) updateData.activa = input.activa;
    
    return prisma.oferta.update({
      where: { id: input.id },
      data: updateData,
    });
  }),

// Cerrar oferta manualmente (nuevo)
ofertas_cerrar: protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    const oferta = await prisma.oferta.findUnique({ where: { id: input.id } });
    if (!oferta) throw new TRPCError({ code: 'NOT_FOUND' });
    if (ctx.user.role !== 'empresa' || oferta.empresaId !== ctx.user.id) {
      throw new TRPCError({ code: 'FORBIDDEN' });
    }
    return prisma.oferta.update({
      where: { id: input.id },
      data: { activa: false, fechaCierre: new Date() },
    });
  }),

// Postularse a oferta (actualizado con control de vacantes)
ofertas_postular: protectedProcedure
  .input(z.object({ ofertaId: z.string(), comentario: z.string().optional() }))
  .mutation(async ({ ctx, input }) => {
    if (ctx.user.role !== 'egresado') {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Solo egresados pueden postular' });
    }
    
    const oferta = await prisma.oferta.findUnique({ where: { id: input.ofertaId } });
    if (!oferta) throw new TRPCError({ code: 'NOT_FOUND', message: 'Oferta no encontrada' });
    
    if (!oferta.activa) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Esta oferta ya está cerrada' });
    }
    
    if (oferta.fechaCierre && new Date(oferta.fechaCierre) < new Date()) {
      await prisma.oferta.update({
        where: { id: input.ofertaId },
        data: { activa: false },
      });
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'La fecha de cierre ha pasado' });
    }
    
    // Verificar vacantes disponibles
    if (oferta.vacantesCubiertas >= oferta.vacantes) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'No hay vacantes disponibles para esta oferta' });
    }
    
    const yaPostulado = await prisma.postulacion.findFirst({
      where: { ofertaId: input.ofertaId, egresadoId: ctx.user.id },
    });
    if (yaPostulado) {
      throw new TRPCError({ code: 'CONFLICT', message: 'Ya te has postulado a esta oferta' });
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

// Actualizar estado de postulación (aprobación/rechazo) - NUEVO
postulaciones_actualizar_estado: protectedProcedure
  .input(z.object({
    postulacionId: z.string(),
    estado: z.enum(['postulado', 'revision', 'entrevista', 'contratado', 'rechazado']),
  }))
  .mutation(async ({ ctx, input }) => {
    const postulacion = await prisma.postulacion.findUnique({
      where: { id: input.postulacionId },
      include: { oferta: true },
    });
    if (!postulacion) throw new TRPCError({ code: 'NOT_FOUND' });
    
    if (ctx.user.role !== 'empresa' || postulacion.oferta.empresaId !== ctx.user.id) {
      throw new TRPCError({ code: 'FORBIDDEN' });
    }
    
    // Registrar historial
    await prisma.historialEstado.create({
      data: {
        postulacionId: input.postulacionId,
        estadoAnterior: postulacion.estado,
        estadoNuevo: input.estado,
        cambiadoPor: ctx.user.id,
      },
    });
    
    // Si se aprueba como contratado, incrementar vacantes cubiertas
    if (input.estado === 'contratado' && postulacion.estado !== 'contratado') {
      await prisma.oferta.update({
        where: { id: postulacion.ofertaId },
        data: { vacantesCubiertas: { increment: 1 } },
      });
      
      // Verificar si ya se cubrieron todas las vacantes
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

// Listar postulaciones de mis ofertas (para empresas)
postulaciones_mis_ofertas: protectedProcedure.query(async ({ ctx }) => {
  if (ctx.user.role !== 'empresa') return [];
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

ofertas_delete: protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    const oferta = await prisma.oferta.findUnique({ where: { id: input.id } });
    if (!oferta) throw new TRPCError({ code: 'NOT_FOUND' });
    if (ctx.user.role !== 'empresa' || oferta.empresaId !== ctx.user.id) throw new TRPCError({ code: 'FORBIDDEN' });
    return prisma.oferta.delete({ where: { id: input.id } });
  }),

  ofertas_mis_ofertas: protectedProcedure.query(async ({ ctx }) => {
  if (ctx.user.role !== 'empresa') return [];
  return prisma.oferta.findMany({
    where: { empresaId: ctx.user.id },
    include: { empresa: true },
    orderBy: { fechaPublicacion: 'desc' },
  });
}),

analitica: router({
  // Distribución de egresados por carrera
  getEgresadosPorCarrera: protectedProcedure.query(async () => {
    const result = await prisma.egresado.groupBy({
      by: ['carrera'],
      _count: { id: true },
    });
    return result.map((item) => ({
      carrera: item.carrera || 'No especificada',
      total: item._count.id,
    }));
  }),

  // Evolución de postulaciones (versión simplificada)
  getEvolucionPostulaciones: protectedProcedure.query(async () => {
    const postulaciones = await prisma.postulacion.findMany({
      select: { fechaPostulacion: true },
      orderBy: { fechaPostulacion: 'asc' },
    });
    
    const meses: Record<string, number> = {};
    for (const p of postulaciones) {
      const fecha = new Date(p.fechaPostulacion);
      const mes = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
      meses[mes] = (meses[mes] || 0) + 1;
    }
    
    return Object.entries(meses).map(([mes, postulaciones]) => ({ mes, postulaciones }));
  }),

  // Empleabilidad por carrera (versión simplificada)
  getEmpleabilidadPorCarrera: protectedProcedure.query(async () => {
    // Obtener todos los egresados
    const egresados = await prisma.egresado.findMany({
      select: { id: true, carrera: true },
    });
    
    // Obtener IDs de egresados contratados
    const contratadosRaw = await prisma.postulacion.findMany({
      where: { estado: 'contratado' },
      select: { egresadoId: true },
      distinct: ['egresadoId'],
    });
    
    const contratadosIds = new Set(contratadosRaw.map(c => c.egresadoId));
    
    // Contar por carrera
    const carreraStats: Record<string, { total: number; contratados: number }> = {};
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
    
    // Calcular porcentajes
    return Object.entries(carreraStats).map(([carrera, stats]) => ({
      carrera,
      tasa_empleabilidad: stats.total === 0 ? 0 : Math.round((stats.contratados / stats.total) * 100),
    }));
  }),
}),
  egresados_delete: protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Verificar permiso de administrador
    if (ctx.user.role !== 'admin') {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'No autorizado' });
    }

    // Verificar existencia del egresado
    const egresado = await prisma.egresado.findUnique({ where: { id: input.id } });
    if (!egresado) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Egresado no encontrado' });
    }

    // Eliminar en orden para evitar conflictos de claves foráneas
    await prisma.$transaction([
      // 1. Historial de estados (relacionado a postulaciones)
      prisma.historialEstado.deleteMany({
        where: { postulacion: { egresadoId: input.id } },
      }),
      // 2. Postulaciones del egresado
      prisma.postulacion.deleteMany({ where: { egresadoId: input.id } }),
      // 3. Habilidades del egresado (tabla puente)
      prisma.egresadoHabilidad.deleteMany({ where: { egresadoId: input.id } }),
      // 4. Notificaciones del usuario
      prisma.notificacion.deleteMany({ where: { usuarioId: input.id } }),
      // 5. Reportes del usuario
      prisma.reporte.deleteMany({ where: { usuarioId: input.id } }),
      // 6. Auditoría del usuario
      prisma.auditoriaLog.deleteMany({ where: { usuarioId: input.id } }),
      // 7. Perfil de egresado (éste tiene relación con usuario)
      prisma.egresado.delete({ where: { id: input.id } }),
      // 8. Usuario principal (por último)
      prisma.user.delete({ where: { id: input.id } }),
    ]);

    return { success: true };
  }),

  egresados_getById: protectedProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ input }) => {
    return prisma.egresado.findUnique({
      where: { id: input.id },
      include: {
        user: { select: { email: true } },
        habilidades: { include: { habilidad: true } },
      },
    });
  }),

  reportes: router({
    solicitar: protectedProcedure
    .input(z.object({ 
      tipo: z.string(), 
      filtros: z.record(z.string(), z.any()).optional()  // ← aquí
    }))
      .mutation(({ ctx, input }) => {
        // Asegúrate que reportesService esté correctamente instanciado
        return reportesService.solicitarReporte(ctx.user.id, input.tipo, input.filtros || {});
      }),
    listar: protectedProcedure.query(({ ctx }) => {
      return reportesService.listarReportes(ctx.user.id);
    }),
    descargar: protectedProcedure
      .input(z.object({ reporteId: z.string() }))
      .query(({ input }) => {
        return reportesService.descargarReporte(input.reporteId);
      }),
  }),
  postulaciones_mis_postulaciones: protectedProcedure.query(async ({ ctx }) => {
  if (ctx.user.role !== 'egresado') return [];
  return prisma.postulacion.findMany({
    where: { egresadoId: ctx.user.id },
    include: { oferta: { include: { empresa: true } } },
    orderBy: { fechaPostulacion: 'desc' },
  });
}),
  // Aquí agregarás los routers de egresados, ofertas, etc.
});

export type AppRouter = typeof appRouter;