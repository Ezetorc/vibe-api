const jsonwebtoken = await import('jsonwebtoken')
const { verify } = jsonwebtoken.default
import { NextFunction, Request, Response } from 'express'
import { SECRET_KEY } from '../settings.js'
import { User } from '../schemas/user.schema.js'
import { CustomJwtPayload } from '../structures/CustomJWTPayload.js'
import { Data } from '../structures/Data.js'

declare global {
  namespace Express {
    interface Request {
      user?: User
    }
  }
}

export async function sessionMiddleware (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  const codedSessionCookie: string | undefined = request.cookies?.session

  if (!codedSessionCookie) {
    response.status(401).json(Data.failure('Session Cookie is missing'))
    return
  }

  try {
    const decodedSessionCookie = verify(
      codedSessionCookie,
      SECRET_KEY
    ) as CustomJwtPayload

    if (!decodedSessionCookie.user) {
      response.status(400).json(Data.failure('Invalid cookie structure'))
      return
    }

    request.user = decodedSessionCookie.user

    next()
  } catch (error) {
    response.status(403).json(Data.failure('Invalid or expired token'))
  }
}
