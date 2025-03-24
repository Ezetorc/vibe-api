import jsonwebtoken from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
import { SECRET_KEY } from '../settings.js'

declare module 'express-serve-static-core' {
  interface Request {
    userId?: number
  }
}

interface JwtPayload {
  userId: number
}

export function sessionMiddleware (
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authorization = request.headers['authorization']?.split(' ')[1]

  if (!authorization) {
    response.status(401).json({ message: 'No token provided' })
    return
  }

  try {
    const decoded = jsonwebtoken.verify(authorization, SECRET_KEY) as JwtPayload
    request.userId = decoded.userId
    next()
  } catch {
    response.status(403).json({ message: 'Invalid or expired token' })
  }
}
