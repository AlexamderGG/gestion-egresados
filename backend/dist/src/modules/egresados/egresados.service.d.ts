import { PrismaService } from '../../prisma/prisma.service';
import { CreateEgresadoDto } from './dto/create-egresado.dto';
import { UpdateEgresadoDto } from './dto/update-egresado.dto';
export declare class EgresadosService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: CreateEgresadoDto & {
        userId: string;
    }): Promise<{
        habilidades: {
            egresadoId: string;
            habilidadId: string;
            nivel: number;
        }[];
    } & {
        id: string;
        nombres: string;
        apellidos: string;
        telefono: string | null;
        carrera: string | null;
        anioEgreso: number | null;
        cvUrl: string | null;
        habilidadesBlandas: string | null;
        fechaNacimiento: Date | null;
    }>;
    findAll(filtros: any): Promise<({
        user: {
            email: string;
        };
        habilidades: ({
            habilidad: {
                id: string;
                nombre: string;
                categoria: import(".prisma/client").$Enums.CategoriaHabilidad;
            };
        } & {
            egresadoId: string;
            habilidadId: string;
            nivel: number;
        })[];
    } & {
        id: string;
        nombres: string;
        apellidos: string;
        telefono: string | null;
        carrera: string | null;
        anioEgreso: number | null;
        cvUrl: string | null;
        habilidadesBlandas: string | null;
        fechaNacimiento: Date | null;
    })[]>;
    findOne(id: string): Promise<{
        user: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            passwordHash: string;
            createdAt: Date;
            updatedAt: Date;
        };
        habilidades: ({
            habilidad: {
                id: string;
                nombre: string;
                categoria: import(".prisma/client").$Enums.CategoriaHabilidad;
            };
        } & {
            egresadoId: string;
            habilidadId: string;
            nivel: number;
        })[];
        postulaciones: {
            id: string;
            ofertaId: string;
            egresadoId: string;
            estado: import(".prisma/client").$Enums.EstadoPostulacion;
            fechaPostulacion: Date;
            fechaEstado: Date;
            comentario: string | null;
        }[];
    } & {
        id: string;
        nombres: string;
        apellidos: string;
        telefono: string | null;
        carrera: string | null;
        anioEgreso: number | null;
        cvUrl: string | null;
        habilidadesBlandas: string | null;
        fechaNacimiento: Date | null;
    }>;
    update(id: string, data: UpdateEgresadoDto): Promise<{
        id: string;
        nombres: string;
        apellidos: string;
        telefono: string | null;
        carrera: string | null;
        anioEgreso: number | null;
        cvUrl: string | null;
        habilidadesBlandas: string | null;
        fechaNacimiento: Date | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        nombres: string;
        apellidos: string;
        telefono: string | null;
        carrera: string | null;
        anioEgreso: number | null;
        cvUrl: string | null;
        habilidadesBlandas: string | null;
        fechaNacimiento: Date | null;
    }>;
}
