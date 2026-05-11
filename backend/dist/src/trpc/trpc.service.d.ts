export declare class TrpcService {
    readonly appRouter: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
        ctx: import("./trpc.router").TrpcContext;
        meta: object;
        errorShape: never;
        transformer: import("@trpc/server").DataTransformerOptions;
    }>, {
        health: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.router").TrpcContext;
                meta: object;
                errorShape: never;
                transformer: import("@trpc/server").DataTransformerOptions;
            }>;
            _ctx_out: import("./trpc.router").TrpcContext;
            _input_in: typeof import("@trpc/server").unsetMarker;
            _input_out: typeof import("@trpc/server").unsetMarker;
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
            _meta: object;
        }, {
            status: string;
        }>;
        auth: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
            ctx: import("./trpc.router").TrpcContext;
            meta: object;
            errorShape: never;
            transformer: import("@trpc/server").DataTransformerOptions;
        }>, {
            login: import("@trpc/server").BuildProcedure<"mutation", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: import("./trpc.router").TrpcContext;
                    meta: object;
                    errorShape: never;
                    transformer: import("@trpc/server").DataTransformerOptions;
                }>;
                _meta: object;
                _ctx_out: import("./trpc.router").TrpcContext;
                _input_in: {
                    email: string;
                    password: string;
                };
                _input_out: {
                    email: string;
                    password: string;
                };
                _output_in: typeof import("@trpc/server").unsetMarker;
                _output_out: typeof import("@trpc/server").unsetMarker;
            }, {
                access_token: string;
            }>;
            getMe: import("@trpc/server").BuildProcedure<"query", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: import("./trpc.router").TrpcContext;
                    meta: object;
                    errorShape: never;
                    transformer: import("@trpc/server").DataTransformerOptions;
                }>;
                _meta: object;
                _ctx_out: {
                    user: {
                        id: string;
                        email: string;
                        role: string;
                    };
                    prisma: import("../prisma/prisma.service").PrismaService;
                };
                _input_in: typeof import("@trpc/server").unsetMarker;
                _input_out: typeof import("@trpc/server").unsetMarker;
                _output_in: typeof import("@trpc/server").unsetMarker;
                _output_out: typeof import("@trpc/server").unsetMarker;
            }, {
                id: string;
                email: string;
                role: string;
            }>;
        }>;
        dashboard: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
            ctx: import("./trpc.router").TrpcContext;
            meta: object;
            errorShape: never;
            transformer: import("@trpc/server").DataTransformerOptions;
        }>, {
            getGlobalKpis: import("@trpc/server").BuildProcedure<"query", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: import("./trpc.router").TrpcContext;
                    meta: object;
                    errorShape: never;
                    transformer: import("@trpc/server").DataTransformerOptions;
                }>;
                _meta: object;
                _ctx_out: {
                    user: {
                        id: string;
                        email: string;
                        role: string;
                    };
                    prisma: import("../prisma/prisma.service").PrismaService;
                };
                _input_in: typeof import("@trpc/server").unsetMarker;
                _input_out: typeof import("@trpc/server").unsetMarker;
                _output_in: typeof import("@trpc/server").unsetMarker;
                _output_out: typeof import("@trpc/server").unsetMarker;
            }, import("../modules/dashboard/interfaces").KpiResult>;
            getOfertasVsPostulacionesMensual: import("@trpc/server").BuildProcedure<"query", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: import("./trpc.router").TrpcContext;
                    meta: object;
                    errorShape: never;
                    transformer: import("@trpc/server").DataTransformerOptions;
                }>;
                _meta: object;
                _ctx_out: {
                    user: {
                        id: string;
                        email: string;
                        role: string;
                    };
                    prisma: import("../prisma/prisma.service").PrismaService;
                };
                _input_in: {
                    anio: number;
                };
                _input_out: {
                    anio: number;
                };
                _output_in: typeof import("@trpc/server").unsetMarker;
                _output_out: typeof import("@trpc/server").unsetMarker;
            }, any[]>;
            getDemandaHabilidades: import("@trpc/server").BuildProcedure<"query", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: import("./trpc.router").TrpcContext;
                    meta: object;
                    errorShape: never;
                    transformer: import("@trpc/server").DataTransformerOptions;
                }>;
                _meta: object;
                _ctx_out: {
                    user: {
                        id: string;
                        email: string;
                        role: string;
                    };
                    prisma: import("../prisma/prisma.service").PrismaService;
                };
                _input_in: typeof import("@trpc/server").unsetMarker;
                _input_out: typeof import("@trpc/server").unsetMarker;
                _output_in: typeof import("@trpc/server").unsetMarker;
                _output_out: typeof import("@trpc/server").unsetMarker;
            }, {
                habilidad_id: string;
                habilidad_nombre: string;
                cantidad_ofertas: number;
                cantidad_egresados: number;
                porcentaje_demanda: number;
            }[]>;
        }>;
        egresados_list: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.router").TrpcContext;
                meta: object;
                errorShape: never;
                transformer: import("@trpc/server").DataTransformerOptions;
            }>;
            _meta: object;
            _ctx_out: {
                user: {
                    id: string;
                    email: string;
                    role: string;
                };
                prisma: import("../prisma/prisma.service").PrismaService;
            };
            _input_in: {
                carrera?: string;
                anioEgreso?: number;
            };
            _input_out: {
                carrera?: string;
                anioEgreso?: number;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, ({
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
        habilidades_list: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.router").TrpcContext;
                meta: object;
                errorShape: never;
                transformer: import("@trpc/server").DataTransformerOptions;
            }>;
            _ctx_out: import("./trpc.router").TrpcContext;
            _input_in: typeof import("@trpc/server").unsetMarker;
            _input_out: typeof import("@trpc/server").unsetMarker;
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
            _meta: object;
        }, {
            id: string;
            nombre: string;
            categoria: import(".prisma/client").$Enums.CategoriaHabilidad;
        }[]>;
        egresados_create: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.router").TrpcContext;
                meta: object;
                errorShape: never;
                transformer: import("@trpc/server").DataTransformerOptions;
            }>;
            _meta: object;
            _ctx_out: {
                user: {
                    id: string;
                    email: string;
                    role: string;
                };
                prisma: import("../prisma/prisma.service").PrismaService;
            };
            _input_in: {
                email: string;
                password: string;
                nombres: string;
                apellidos: string;
                carrera: string;
                anioEgreso: number;
                habilidades: {
                    habilidadId: string;
                    nivel: number;
                }[];
                telefono?: string;
                cvUrl?: string;
                habilidadesBlandas?: string;
                fechaNacimiento?: string;
            };
            _input_out: {
                email: string;
                password: string;
                nombres: string;
                apellidos: string;
                carrera: string;
                anioEgreso: number;
                habilidades: {
                    habilidadId: string;
                    nivel: number;
                }[];
                telefono?: string;
                cvUrl?: string;
                habilidadesBlandas?: string;
                fechaNacimiento?: Date;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            egresado: {
                id: string;
                nombres: string;
                apellidos: string;
                telefono: string | null;
                carrera: string | null;
                anioEgreso: number | null;
                cvUrl: string | null;
                habilidadesBlandas: string | null;
                fechaNacimiento: Date | null;
            };
        } & {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            passwordHash: string;
            createdAt: Date;
            updatedAt: Date;
        }>;
        ofertas_list: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.router").TrpcContext;
                meta: object;
                errorShape: never;
                transformer: import("@trpc/server").DataTransformerOptions;
            }>;
            _meta: object;
            _ctx_out: {
                user: {
                    id: string;
                    email: string;
                    role: string;
                };
                prisma: import("../prisma/prisma.service").PrismaService;
            };
            _input_in: {
                titulo?: string;
                modalidad?: string;
            };
            _input_out: {
                titulo?: string;
                modalidad?: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, ({
            empresa: {
                id: string;
                ubicacion: string | null;
                nombreEmpresa: string;
                sector: string | null;
                website: string | null;
            };
            habilidades: ({
                habilidad: {
                    id: string;
                    nombre: string;
                    categoria: import(".prisma/client").$Enums.CategoriaHabilidad;
                };
            } & {
                ofertaId: string;
                habilidadId: string;
            })[];
        } & {
            id: string;
            empresaId: string;
            titulo: string;
            descripcion: string;
            ubicacion: string | null;
            modalidad: import(".prisma/client").$Enums.Modalidad | null;
            tipoContrato: string | null;
            salarioMin: number | null;
            salarioMax: number | null;
            activa: boolean;
            fechaPublicacion: Date;
            fechaCierre: Date | null;
            vacantes: number;
            vacantesCubiertas: number;
        })[]>;
        ofertas_create: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.router").TrpcContext;
                meta: object;
                errorShape: never;
                transformer: import("@trpc/server").DataTransformerOptions;
            }>;
            _meta: object;
            _ctx_out: {
                user: {
                    id: string;
                    email: string;
                    role: string;
                };
                prisma: import("../prisma/prisma.service").PrismaService;
            };
            _input_in: {
                titulo: string;
                descripcion: string;
                modalidad: "remoto" | "hibrido" | "presencial";
                ubicacion?: string;
                tipoContrato?: string;
                salarioMin?: number;
                salarioMax?: number;
                vacantes?: number;
                fechaCierre?: string;
            };
            _input_out: {
                titulo: string;
                descripcion: string;
                modalidad: "remoto" | "hibrido" | "presencial";
                vacantes: number;
                ubicacion?: string;
                tipoContrato?: string;
                salarioMin?: number;
                salarioMax?: number;
                fechaCierre?: Date;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            id: string;
            empresaId: string;
            titulo: string;
            descripcion: string;
            ubicacion: string | null;
            modalidad: import(".prisma/client").$Enums.Modalidad | null;
            tipoContrato: string | null;
            salarioMin: number | null;
            salarioMax: number | null;
            activa: boolean;
            fechaPublicacion: Date;
            fechaCierre: Date | null;
            vacantes: number;
            vacantesCubiertas: number;
        }>;
        ofertas_update: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.router").TrpcContext;
                meta: object;
                errorShape: never;
                transformer: import("@trpc/server").DataTransformerOptions;
            }>;
            _meta: object;
            _ctx_out: {
                user: {
                    id: string;
                    email: string;
                    role: string;
                };
                prisma: import("../prisma/prisma.service").PrismaService;
            };
            _input_in: {
                id: string;
                titulo?: string;
                descripcion?: string;
                ubicacion?: string;
                modalidad?: "remoto" | "hibrido" | "presencial";
                tipoContrato?: string;
                salarioMin?: number;
                salarioMax?: number;
                vacantes?: number;
                activa?: boolean;
            };
            _input_out: {
                id: string;
                titulo?: string;
                descripcion?: string;
                ubicacion?: string;
                modalidad?: "remoto" | "hibrido" | "presencial";
                tipoContrato?: string;
                salarioMin?: number;
                salarioMax?: number;
                vacantes?: number;
                activa?: boolean;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            id: string;
            empresaId: string;
            titulo: string;
            descripcion: string;
            ubicacion: string | null;
            modalidad: import(".prisma/client").$Enums.Modalidad | null;
            tipoContrato: string | null;
            salarioMin: number | null;
            salarioMax: number | null;
            activa: boolean;
            fechaPublicacion: Date;
            fechaCierre: Date | null;
            vacantes: number;
            vacantesCubiertas: number;
        }>;
        ofertas_cerrar: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.router").TrpcContext;
                meta: object;
                errorShape: never;
                transformer: import("@trpc/server").DataTransformerOptions;
            }>;
            _meta: object;
            _ctx_out: {
                user: {
                    id: string;
                    email: string;
                    role: string;
                };
                prisma: import("../prisma/prisma.service").PrismaService;
            };
            _input_in: {
                id: string;
            };
            _input_out: {
                id: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            id: string;
            empresaId: string;
            titulo: string;
            descripcion: string;
            ubicacion: string | null;
            modalidad: import(".prisma/client").$Enums.Modalidad | null;
            tipoContrato: string | null;
            salarioMin: number | null;
            salarioMax: number | null;
            activa: boolean;
            fechaPublicacion: Date;
            fechaCierre: Date | null;
            vacantes: number;
            vacantesCubiertas: number;
        }>;
        ofertas_postular: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.router").TrpcContext;
                meta: object;
                errorShape: never;
                transformer: import("@trpc/server").DataTransformerOptions;
            }>;
            _meta: object;
            _ctx_out: {
                user: {
                    id: string;
                    email: string;
                    role: string;
                };
                prisma: import("../prisma/prisma.service").PrismaService;
            };
            _input_in: {
                ofertaId: string;
                comentario?: string;
            };
            _input_out: {
                ofertaId: string;
                comentario?: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            id: string;
            ofertaId: string;
            egresadoId: string;
            estado: import(".prisma/client").$Enums.EstadoPostulacion;
            fechaPostulacion: Date;
            fechaEstado: Date;
            comentario: string | null;
        }>;
        postulaciones_actualizar_estado: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.router").TrpcContext;
                meta: object;
                errorShape: never;
                transformer: import("@trpc/server").DataTransformerOptions;
            }>;
            _meta: object;
            _ctx_out: {
                user: {
                    id: string;
                    email: string;
                    role: string;
                };
                prisma: import("../prisma/prisma.service").PrismaService;
            };
            _input_in: {
                postulacionId: string;
                estado: "contratado" | "postulado" | "revision" | "entrevista" | "rechazado";
            };
            _input_out: {
                postulacionId: string;
                estado: "contratado" | "postulado" | "revision" | "entrevista" | "rechazado";
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            id: string;
            ofertaId: string;
            egresadoId: string;
            estado: import(".prisma/client").$Enums.EstadoPostulacion;
            fechaPostulacion: Date;
            fechaEstado: Date;
            comentario: string | null;
        }>;
        postulaciones_mis_ofertas: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.router").TrpcContext;
                meta: object;
                errorShape: never;
                transformer: import("@trpc/server").DataTransformerOptions;
            }>;
            _meta: object;
            _ctx_out: {
                user: {
                    id: string;
                    email: string;
                    role: string;
                };
                prisma: import("../prisma/prisma.service").PrismaService;
            };
            _input_in: typeof import("@trpc/server").unsetMarker;
            _input_out: typeof import("@trpc/server").unsetMarker;
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, ({
            egresado: {
                user: {
                    email: string;
                };
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
            };
            oferta: {
                id: string;
                empresaId: string;
                titulo: string;
                descripcion: string;
                ubicacion: string | null;
                modalidad: import(".prisma/client").$Enums.Modalidad | null;
                tipoContrato: string | null;
                salarioMin: number | null;
                salarioMax: number | null;
                activa: boolean;
                fechaPublicacion: Date;
                fechaCierre: Date | null;
                vacantes: number;
                vacantesCubiertas: number;
            };
        } & {
            id: string;
            ofertaId: string;
            egresadoId: string;
            estado: import(".prisma/client").$Enums.EstadoPostulacion;
            fechaPostulacion: Date;
            fechaEstado: Date;
            comentario: string | null;
        })[]>;
        ofertas_delete: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.router").TrpcContext;
                meta: object;
                errorShape: never;
                transformer: import("@trpc/server").DataTransformerOptions;
            }>;
            _meta: object;
            _ctx_out: {
                user: {
                    id: string;
                    email: string;
                    role: string;
                };
                prisma: import("../prisma/prisma.service").PrismaService;
            };
            _input_in: {
                id: string;
            };
            _input_out: {
                id: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            id: string;
            empresaId: string;
            titulo: string;
            descripcion: string;
            ubicacion: string | null;
            modalidad: import(".prisma/client").$Enums.Modalidad | null;
            tipoContrato: string | null;
            salarioMin: number | null;
            salarioMax: number | null;
            activa: boolean;
            fechaPublicacion: Date;
            fechaCierre: Date | null;
            vacantes: number;
            vacantesCubiertas: number;
        }>;
        ofertas_mis_ofertas: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.router").TrpcContext;
                meta: object;
                errorShape: never;
                transformer: import("@trpc/server").DataTransformerOptions;
            }>;
            _meta: object;
            _ctx_out: {
                user: {
                    id: string;
                    email: string;
                    role: string;
                };
                prisma: import("../prisma/prisma.service").PrismaService;
            };
            _input_in: typeof import("@trpc/server").unsetMarker;
            _input_out: typeof import("@trpc/server").unsetMarker;
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, ({
            empresa: {
                id: string;
                ubicacion: string | null;
                nombreEmpresa: string;
                sector: string | null;
                website: string | null;
            };
        } & {
            id: string;
            empresaId: string;
            titulo: string;
            descripcion: string;
            ubicacion: string | null;
            modalidad: import(".prisma/client").$Enums.Modalidad | null;
            tipoContrato: string | null;
            salarioMin: number | null;
            salarioMax: number | null;
            activa: boolean;
            fechaPublicacion: Date;
            fechaCierre: Date | null;
            vacantes: number;
            vacantesCubiertas: number;
        })[]>;
        analitica: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
            ctx: import("./trpc.router").TrpcContext;
            meta: object;
            errorShape: never;
            transformer: import("@trpc/server").DataTransformerOptions;
        }>, {
            getEgresadosPorCarrera: import("@trpc/server").BuildProcedure<"query", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: import("./trpc.router").TrpcContext;
                    meta: object;
                    errorShape: never;
                    transformer: import("@trpc/server").DataTransformerOptions;
                }>;
                _meta: object;
                _ctx_out: {
                    user: {
                        id: string;
                        email: string;
                        role: string;
                    };
                    prisma: import("../prisma/prisma.service").PrismaService;
                };
                _input_in: typeof import("@trpc/server").unsetMarker;
                _input_out: typeof import("@trpc/server").unsetMarker;
                _output_in: typeof import("@trpc/server").unsetMarker;
                _output_out: typeof import("@trpc/server").unsetMarker;
            }, {
                carrera: string;
                total: number;
            }[]>;
            getEvolucionPostulaciones: import("@trpc/server").BuildProcedure<"query", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: import("./trpc.router").TrpcContext;
                    meta: object;
                    errorShape: never;
                    transformer: import("@trpc/server").DataTransformerOptions;
                }>;
                _meta: object;
                _ctx_out: {
                    user: {
                        id: string;
                        email: string;
                        role: string;
                    };
                    prisma: import("../prisma/prisma.service").PrismaService;
                };
                _input_in: typeof import("@trpc/server").unsetMarker;
                _input_out: typeof import("@trpc/server").unsetMarker;
                _output_in: typeof import("@trpc/server").unsetMarker;
                _output_out: typeof import("@trpc/server").unsetMarker;
            }, {
                mes: string;
                postulaciones: number;
            }[]>;
            getEmpleabilidadPorCarrera: import("@trpc/server").BuildProcedure<"query", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: import("./trpc.router").TrpcContext;
                    meta: object;
                    errorShape: never;
                    transformer: import("@trpc/server").DataTransformerOptions;
                }>;
                _meta: object;
                _ctx_out: {
                    user: {
                        id: string;
                        email: string;
                        role: string;
                    };
                    prisma: import("../prisma/prisma.service").PrismaService;
                };
                _input_in: typeof import("@trpc/server").unsetMarker;
                _input_out: typeof import("@trpc/server").unsetMarker;
                _output_in: typeof import("@trpc/server").unsetMarker;
                _output_out: typeof import("@trpc/server").unsetMarker;
            }, {
                carrera: string;
                tasa_empleabilidad: number;
            }[]>;
        }>;
        egresados_delete: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.router").TrpcContext;
                meta: object;
                errorShape: never;
                transformer: import("@trpc/server").DataTransformerOptions;
            }>;
            _meta: object;
            _ctx_out: {
                user: {
                    id: string;
                    email: string;
                    role: string;
                };
                prisma: import("../prisma/prisma.service").PrismaService;
            };
            _input_in: {
                id: string;
            };
            _input_out: {
                id: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
        }>;
        egresados_getById: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.router").TrpcContext;
                meta: object;
                errorShape: never;
                transformer: import("@trpc/server").DataTransformerOptions;
            }>;
            _meta: object;
            _ctx_out: {
                user: {
                    id: string;
                    email: string;
                    role: string;
                };
                prisma: import("../prisma/prisma.service").PrismaService;
            };
            _input_in: {
                id: string;
            };
            _input_out: {
                id: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
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
        }>;
        reportes: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
            ctx: import("./trpc.router").TrpcContext;
            meta: object;
            errorShape: never;
            transformer: import("@trpc/server").DataTransformerOptions;
        }>, {
            solicitar: import("@trpc/server").BuildProcedure<"mutation", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: import("./trpc.router").TrpcContext;
                    meta: object;
                    errorShape: never;
                    transformer: import("@trpc/server").DataTransformerOptions;
                }>;
                _meta: object;
                _ctx_out: {
                    user: {
                        id: string;
                        email: string;
                        role: string;
                    };
                    prisma: import("../prisma/prisma.service").PrismaService;
                };
                _input_in: {
                    tipo: string;
                    filtros?: Record<string, any>;
                };
                _input_out: {
                    tipo: string;
                    filtros?: Record<string, any>;
                };
                _output_in: typeof import("@trpc/server").unsetMarker;
                _output_out: typeof import("@trpc/server").unsetMarker;
            }, {
                id: string;
                estado: import(".prisma/client").$Enums.EstadoReporte;
                tipoReporte: string;
                filtrosAplicados: import("@prisma/client/runtime/library").JsonValue | null;
                urlPdf: string | null;
                fechaSolicitud: Date;
                fechaCompletado: Date | null;
                usuarioId: string;
            }>;
            listar: import("@trpc/server").BuildProcedure<"query", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: import("./trpc.router").TrpcContext;
                    meta: object;
                    errorShape: never;
                    transformer: import("@trpc/server").DataTransformerOptions;
                }>;
                _meta: object;
                _ctx_out: {
                    user: {
                        id: string;
                        email: string;
                        role: string;
                    };
                    prisma: import("../prisma/prisma.service").PrismaService;
                };
                _input_in: typeof import("@trpc/server").unsetMarker;
                _input_out: typeof import("@trpc/server").unsetMarker;
                _output_in: typeof import("@trpc/server").unsetMarker;
                _output_out: typeof import("@trpc/server").unsetMarker;
            }, {
                id: string;
                estado: import(".prisma/client").$Enums.EstadoReporte;
                tipoReporte: string;
                filtrosAplicados: import("@prisma/client/runtime/library").JsonValue | null;
                urlPdf: string | null;
                fechaSolicitud: Date;
                fechaCompletado: Date | null;
                usuarioId: string;
            }[]>;
            descargar: import("@trpc/server").BuildProcedure<"query", {
                _config: import("@trpc/server").RootConfig<{
                    ctx: import("./trpc.router").TrpcContext;
                    meta: object;
                    errorShape: never;
                    transformer: import("@trpc/server").DataTransformerOptions;
                }>;
                _meta: object;
                _ctx_out: {
                    user: {
                        id: string;
                        email: string;
                        role: string;
                    };
                    prisma: import("../prisma/prisma.service").PrismaService;
                };
                _input_in: {
                    reporteId: string;
                };
                _input_out: {
                    reporteId: string;
                };
                _output_in: typeof import("@trpc/server").unsetMarker;
                _output_out: typeof import("@trpc/server").unsetMarker;
            }, {
                id: string;
                estado: import(".prisma/client").$Enums.EstadoReporte;
                tipoReporte: string;
                filtrosAplicados: import("@prisma/client/runtime/library").JsonValue | null;
                urlPdf: string | null;
                fechaSolicitud: Date;
                fechaCompletado: Date | null;
                usuarioId: string;
            }>;
        }>;
        postulaciones_mis_postulaciones: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.router").TrpcContext;
                meta: object;
                errorShape: never;
                transformer: import("@trpc/server").DataTransformerOptions;
            }>;
            _meta: object;
            _ctx_out: {
                user: {
                    id: string;
                    email: string;
                    role: string;
                };
                prisma: import("../prisma/prisma.service").PrismaService;
            };
            _input_in: typeof import("@trpc/server").unsetMarker;
            _input_out: typeof import("@trpc/server").unsetMarker;
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, ({
            oferta: {
                empresa: {
                    id: string;
                    ubicacion: string | null;
                    nombreEmpresa: string;
                    sector: string | null;
                    website: string | null;
                };
            } & {
                id: string;
                empresaId: string;
                titulo: string;
                descripcion: string;
                ubicacion: string | null;
                modalidad: import(".prisma/client").$Enums.Modalidad | null;
                tipoContrato: string | null;
                salarioMin: number | null;
                salarioMax: number | null;
                activa: boolean;
                fechaPublicacion: Date;
                fechaCierre: Date | null;
                vacantes: number;
                vacantesCubiertas: number;
            };
        } & {
            id: string;
            ofertaId: string;
            egresadoId: string;
            estado: import(".prisma/client").$Enums.EstadoPostulacion;
            fechaPostulacion: Date;
            fechaEstado: Date;
            comentario: string | null;
        })[]>;
    }>;
}
