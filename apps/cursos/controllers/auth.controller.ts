import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { SuccessResponse } from '../../../core/utils/response';
import { catchAsync } from '../../../core/middlewares/catch-async.middleware';
import { PrismaClient } from '@/database/generated/prisma';
import { NotFoundException } from '@/core/expections/http.exception';

const prisma = new PrismaClient();
const authService = new AuthService();

export class AuthController {
    login = catchAsync(async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const { accessToken, refreshToken, user } = await authService.login(email, password);

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: Number(process.env.COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000,
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: Number(process.env.COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000,
        });

        return new SuccessResponse('Login realizado com sucesso', { user }).send(res);
    });

    refreshToken = catchAsync(async (req: Request, res: Response) => {
        const refreshToken = req.cookies?.refreshToken;
        const { accessToken, refreshToken: newRefreshToken, user } = await authService.refreshToken(refreshToken);

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: Number(process.env.COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000,
        });

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: Number(process.env.COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000,
        });

        return new SuccessResponse('Token atualizado com sucesso', { user }).send(res);
    });

    logout = catchAsync(async (req: Request, res:Response) => {
        const userId = req.user?.userId;
        if (userId) {
            await authService.logout(userId);
        }

        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        return new SuccessResponse('Logout realizado com sucesso').send(res);
    });

    me = catchAsync(async (req: Request, res: Response) => {
        const user = await prisma.user.findUnique({
            where: { id: req.user?.userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                department: true,
            },
        });

        if (!user) {
            throw new NotFoundException('Usuário não encontrado');
        }

        return new SuccessResponse('Informações do usuário', { user }).send(res);
    });
}
