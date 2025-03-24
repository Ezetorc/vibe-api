import jsonwebtoken from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
import { SECRET_KEY } from '../settings.js'
import { User } from '../schemas/user.schema.js'
import { CustomJwtPayload } from '../structures/CustomJWTPayload.js'
import { Data } from '../structures/Data.js'
import { UserModel } from '../models/user.model.js'

declare module 'express-serve-static-core' {
  interface Request {
    user?: User
  }
}

export async function sessionMiddleware (
  request: Request,
  response: Response,
  next: NextFunction
) {
  const codedSessionCookie: string | undefined = request.cookies?.session

  if (!codedSessionCookie) {
    response.status(401).json(Data.failure('Session Cookie is missing'))
    return
  }

  try {
    const decodedSessionCookie = jsonwebtoken.verify(
      codedSessionCookie,
      SECRET_KEY
    ) as CustomJwtPayload

    if (!decodedSessionCookie.user) {
      response.status(400).json(Data.failure('Invalid cookie structure'))
      return
    }

    const user = await UserModel.getById({ id: decodedSessionCookie.user.id! })

    if (!user) {
      response.clearCookie('session', { httpOnly: true, secure: true })
      response.status(404).json(Data.failure('User not found'))
      return
    }

    request.user = user
    next()
  } catch (error) {
    if (!(error instanceof Error)) return

    if (error.name === 'TokenExpiredError') {
      response.status(401).json(Data.failure('Session expired'))
      return
    }

    if (error.name === 'JsonWebTokenError') {
      response.status(403).json(Data.failure('Invalid token'))
      return
    }

    response.status(500).json(Data.failure('Internal server error'))
  }
}
