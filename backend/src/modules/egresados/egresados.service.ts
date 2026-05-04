import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEgresadoDto } from './dto/create-egresado.dto';
import { UpdateEgresadoDto } from './dto/update-egresado.dto';

@Injectable()
export class EgresadosService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateEgresadoDto & { userId: string }) {
    // Crear perfil de egresado vinculado al usuario
    return this.prisma.egresado.create({
      data: {
        id: data.userId,
        nombres: data.nombres,
        apellidos: data.apellidos,
        telefono: data.telefono,
        carrera: data.carrera,
        anioEgreso: data.anio_egreso,
        cvUrl: data.cv_url,
        habilidadesBlandas: data.habilidades_blandas,
        fechaNacimiento: data.fecha_nacimiento,
        habilidades: {
          create: data.habilidades.map(h => ({
            habilidad: { connect: { id: h.habilidadId } },
            nivel: h.nivel,
          })),
        },
      },
      include: { habilidades: true },
    });
  }

  async findAll(filtros: any) {
    const where: any = {};
    if (filtros.carrera) where.carrera = filtros.carrera;
    if (filtros.anio_egreso) where.anio_egreso = filtros.anio_egreso;
    if (filtros.habilidad) {
      where.habilidades = { some: { habilidadId: filtros.habilidad } };
    }
    return this.prisma.egresado.findMany({
      where,
      include: { user: { select: { email: true } }, habilidades: { include: { habilidad: true } } },
    });
  }

  async findOne(id: string) {
    const egresado = await this.prisma.egresado.findUnique({
      where: { id },
      include: { user: true, habilidades: { include: { habilidad: true } }, postulaciones: true },
    });
    if (!egresado) throw new NotFoundException('Egresado no encontrado');
    return egresado;
  }

  async update(id: string, data: UpdateEgresadoDto) {
    return this.prisma.egresado.update({
      where: { id },
      data: {
        ...data,
        habilidades: data.habilidades ? {
          deleteMany: {},
          create: data.habilidades.map(h => ({ habilidad: { connect: { id: h.habilidadId } }, nivel: h.nivel })),
        } : undefined,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.egresado.delete({ where: { id } });
  }
}