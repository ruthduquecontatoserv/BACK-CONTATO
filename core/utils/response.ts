import { Response } from "express";

export class SuccessResponse {
    constructor(
        public message: string,
        public data?: any,
        public statusCode: number = 200
    ) {}

    send(res: Response) {
        return res.status(this.statusCode).json({
            success: true,
            message: this.message,
            data: this.data,
        })
    }
}

export class ErrorResponse {
    constructor(
        public message: string,
        public statusCode: number = 400,
        public errors?: any
    ) {}

    send(res: Response) {
        return res.status(this.statusCode).json({
            success: false,
            message: this.message,
            errors: this.errors,
        })
    }
}
