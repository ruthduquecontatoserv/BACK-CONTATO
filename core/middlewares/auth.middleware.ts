import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../utils/jwt.util';
import { ITokenPayload } from '../interfaces/auth.interface';
import { UnauthorizedException } from '../expections/http.exception';

export const authenticate = (roles?: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const accessToken = req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];

        if (!accessToken) {
            throw new UnauthorizedException('Token de acesso não fornecido');
        }

        const decoded = verifyJwt<ITokenPayload>(accessToken, process.env.JWT_SECRET!);

        if (!decoded) {
            throw new UnauthorizedException('Token de acesso inválido ou expirado');
        }

        if (roles && !roles.includes(decoded.role)) {
            throw new UnauthorizedException('Acesso não autorizado');
        }

        req.user = decoded;
        next();
    };
};
