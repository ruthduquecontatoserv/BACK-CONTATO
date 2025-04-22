import { Request, Response, NextFunction } from "express";

export const catchAsync = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch(next);
    }
}

export function catchAsync2<
    P = any,
    ResBody = any,
    ReqBody = any,
    ReqQuery = any
>(
    fn: (
        req: Request<P, ResBody, ReqBody, ReqQuery>,
        res: Response,
        next: NextFunction
    ) => Promise<any>
) {
    return (
        req: Request<P, ResBody, ReqBody, ReqQuery>,
        res: Response,
        next: NextFunction
    ) => {
        fn(req, res, next).catch(next)
    }
}