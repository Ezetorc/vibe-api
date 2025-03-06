import { CookieOptions } from 'express'
import { User } from '../schemas/user.schema.js'
import { NODE_ENV, SECRET_KEY } from '../settings.js'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { SessionCookie } from '../structures/SessionCookie.js'

export function getSessionCookie (user: User): SessionCookie {
  const isProduction: boolean = NODE_ENV === 'production'
  const payload: JwtPayload = { user: { id: user.id } }
  const token: string = jwt.sign(payload, SECRET_KEY, { expiresIn: '24h' })
  const options: CookieOptions = {
    httpOnly: false,
    sameSite: isProduction ? 'none' : 'strict',
    secure: isProduction,
    maxAge: 24 * 60 * 60 * 1000
  }

  return { token, options }
}
