export declare enum Role {
    ADMIN = "admin",
    EGRESADO = "egresado",
    EMPRESA = "empresa"
}
export declare class RegisterDto {
    email: string;
    password: string;
    role: Role;
}
