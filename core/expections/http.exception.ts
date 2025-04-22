export class HttpException extends Error {
    constructor(
        public readonly message: string,
        public readonly statusCode: number
    ) {
        super(message)
    }
}

export class UnauthorizedException extends HttpException {
    constructor(message = 'Não autorizado') {
        super(message, 401)
    }
}

export class NotFoundException extends HttpException {
    constructor(message = 'Não encontrado') {
        super(message, 404)
    }
}

export class BadRequestException extends HttpException {
    constructor(message = 'Requisição inválida') {
        super(message, 400)
    }
}

export class ForbiddenException extends HttpException {
    constructor(message = 'Acesso proibido') {
        super(message, 403)
    }
}

export class InternalServerErrorException extends HttpException {
    constructor(message = 'Erro interno do servidor') {
        super(message, 500)
    }
}