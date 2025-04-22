import { ITokenPayload } from "../interfaces/auth.interface";

declare global {
    namespace Express {
        interface Request {
            user?: ITokenPayload
        }
    }
}