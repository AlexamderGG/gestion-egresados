import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(body: {
        email: string;
        password: string;
    }): Promise<{
        access_token: string;
    } | {
        message: string;
    }>;
    register(body: {
        email: string;
        password: string;
        role: string;
        profileData?: any;
    }): Promise<{
        access_token: string;
    }>;
}
