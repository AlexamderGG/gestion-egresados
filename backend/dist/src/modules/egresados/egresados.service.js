"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EgresadosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let EgresadosService = class EgresadosService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
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
    async findAll(filtros) {
        const where = {};
        if (filtros.carrera)
            where.carrera = filtros.carrera;
        if (filtros.anio_egreso)
            where.anio_egreso = filtros.anio_egreso;
        if (filtros.habilidad) {
            where.habilidades = { some: { habilidadId: filtros.habilidad } };
        }
        return this.prisma.egresado.findMany({
            where,
            include: { user: { select: { email: true } }, habilidades: { include: { habilidad: true } } },
        });
    }
    async findOne(id) {
        const egresado = await this.prisma.egresado.findUnique({
            where: { id },
            include: { user: true, habilidades: { include: { habilidad: true } }, postulaciones: true },
        });
        if (!egresado)
            throw new common_1.NotFoundException('Egresado no encontrado');
        return egresado;
    }
    async update(id, data) {
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
    async remove(id) {
        return this.prisma.egresado.delete({ where: { id } });
    }
};
exports.EgresadosService = EgresadosService;
exports.EgresadosService = EgresadosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EgresadosService);
//# sourceMappingURL=egresados.service.js.map