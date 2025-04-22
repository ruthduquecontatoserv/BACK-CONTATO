export interface IAuthService {
    login(email: string, password: string): Promise<ILoginResponse>;
    refreshToken(refreshToken: string): Promise<ILoginResponse>;
    logout(userId: string): Promise<void>;
}

export interface ILoginResponse {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
        department?: string;
    };
}

export interface ITokenPayload {
    userId: string;
    role: string;
}