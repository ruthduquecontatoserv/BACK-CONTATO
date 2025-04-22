import jwt, { Secret } from "jsonwebtoken";
import { ITokenPayload } from "../interfaces/auth.interface";

export const signJwt = (
  payload: ITokenPayload,
  expiresIn: string,
  secret: Secret // Alteração aqui
): string => {
  return jwt.sign(payload, secret, {
    expiresIn, // `expiresIn` is already a string, no need for explicit casting
  } as jwt.SignOptions);
};

export const verifyJwt = <T>(token: string, secret: Secret): T | null => {
  try {
    return jwt.verify(token, secret) as T;
  } catch (error) {
    return null;
  }
};
