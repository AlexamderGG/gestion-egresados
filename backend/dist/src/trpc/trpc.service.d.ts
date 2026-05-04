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
            }, import("../modules/dashboard/interfaces").OfertaDemandaMensual[]>;
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
            }, unknown>;
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
                habilidadId: string;
                nivel: number;
                egresadoId: string;
            })[];
        } & {
            id: string;
            carrera: string | null;
            anioEgreso: number | null;
            nombres: string;
            apellidos: string;
            telefono: string | null;
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
                fechaNacimiento?: Date;
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
                carrera: string | null;
                anioEgreso: number | null;
                nombres: string;
                apellidos: string;
                telefono: string | null;
                cvUrl: string | null;
                habilidadesBlandas: string | null;
                fechaNacimiento: Date | null;
            };
        } & {
            email: string;
            role: import(".prisma/client").$Enums.Role;
            id: string;
            passwordHash: string;
            createdAt: Date;
            updatedAt: Date;
        }>;
    }>;
}
