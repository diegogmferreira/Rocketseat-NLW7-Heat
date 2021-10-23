import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

interface IPayload {
  sub: string;
}

export function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
  const authToken = request.headers.authorization;

  if (!authToken) {
    return response.status(401).json({
      errorCode: 'Token.invalid'
    });
  }

  // Bearer 1092310217298371981231
  // [0] Bearer
  // [1] 1092310217298371981231

  const [bearer, token] = authToken.split(" ");

  try {
    const { sub } = verify(token, process.env.JWT_SECRET) as IPayload;
    request.user_id = sub;
    
    return next();

  } catch (error) {
    return response.status(401).json({ errorCode: 'token.expired' });
  }
}