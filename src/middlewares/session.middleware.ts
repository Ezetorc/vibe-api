import jsonwebtoken, { JwtPayload } from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
import { SECRET_KEY } from '../settings.js'
import { dataFailure } from '../structures/Data.js'

declare module 'express-serve-static-core' {
  interface Request {
    userId?: number
  }
}

export function sessionMiddleware (
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authorization = request.headers['authorization']?.split(' ')[1]

  if (!authorization) {
    response.status(401).json(dataFailure('No authorization token provided'))
    return
  }

  jsonwebtoken.verify(authorization, SECRET_KEY, (error, userId) => {
    if (error || !userId) {
      response
        .status(403)
        .json(dataFailure('Invalid or expired authorization token'))
      return
    }

    request.userId = Number((userId as JwtPayload).userId)
    next()
  })
}
