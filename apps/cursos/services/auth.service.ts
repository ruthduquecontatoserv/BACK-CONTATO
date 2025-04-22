import bcrypt from 'bcryptjs';
import { PrismaClient } from '@/database/generated/prisma';
import { signJwt, verifyJwt } from '@/core/utils/jwt.util';
import { IAuthService, ILoginResponse, ITokenPayload } from '@/core/interfaces/auth.interface';
import { NotFoundException, UnauthorizedException } from '@/core/expections/http.exception';

const prisma = new PrismaClient();

export class AuthService implements IAuthService {
    async login(email: string, password: string): Promise<ILoginResponse> {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            throw new NotFoundException('Usuário não encontrado');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        const accessToken = signJwt(
            { userId: user.id, role: user.role },
            process.env.JWT_EXPIRES_IN!,
            process.env.JWT_SECRET!
        );

        const refreshToken = signJwt(
            { userId: user.id, role: user.role },
            process.env.REFRESH_TOKEN_EXPIRES_IN!,
            process.env.JWT_SECRET!
        );

        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken },
        });

        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department || undefined,
            },
        };
    }

    async refreshToken(refreshToken: string): Promise<ILoginResponse> {
        const decoded = verifyJwt<ITokenPayload>(refreshToken, process.env.JWT_SECRET!);

        if (!decoded) {
            throw new UnauthorizedException('Token de refresh inválido ou expirado');
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId, refreshToken },
        });

        if (!user) {
            throw new UnauthorizedException('Token de refresh inválido');
        }

        const newAccessToken = signJwt(
            { userId: user.id, role: user.role },
            process.env.JWT_EXPIRES_IN!,
            process.env.JWT_SECRET!
        );

        const newRefreshToken = signJwt(
            { userId: user.id, role: user.role },
            process.env.REFRESH_TOKEN_EXPIRES_IN!,
            process.env.JWT_SECRET!
        );

        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken: newRefreshToken },
        });

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department || undefined,
            },
        };
    }

    async logout(userId: string): Promise<void> {
        await prisma.user.update({
            where: { id: userId },
            data: { refreshToken: null },
        });
    }
}