import { User } from '../schemas/user.schema.js'
import { SECRET_KEY } from '../settings.js'
import jwt from 'jsonwebtoken'
import { AccessToken } from '../structures/AccessToken.js'

export function getAccessToken (user: User): AccessToken {
  const payload: jwt.JwtPayload = {
    user: {
      id: user.id
    }
  }

  return {
    token: jwt.sign(payload, SECRET_KEY, { expiresIn: '24h' }),
    config: {
      httpOnly: false,
      sameSite: "none",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000
    }
  } as AccessToken
}
