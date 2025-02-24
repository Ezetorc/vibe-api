const jsonwebtoken = await import('jsonwebtoken');
const { verify } = jsonwebtoken.default;
import { NextFunction, Request, Response } from 'express'
import { SECRET_KEY } from '../settings.js'
import { User } from '../schemas/user.schema.js'
import { CustomJwtPayload } from '../structures/CustomJWTPayload.js'

declare global {
  namespace Express {
    interface Request {
      user?: User
    }
  }
}

export async function tokenMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  const codedToken: string | undefined = request.cookies?.access_token

  if (!codedToken) {
    response.status(401).json({ message: 'Access token is missing' })
    return 
  }

  try {
    const decodedToken = verify(codedToken, SECRET_KEY) as CustomJwtPayload

    if (!decodedToken.user) {
      throw new Error('Invalid token structure')
    }

    request.user = decodedToken.user

    next()
  } catch (error) {
    response.status(403).json({ message: 'Invalid or expired token' })
  }
}
