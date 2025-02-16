import { User } from '../schemas/user.schema.ts';
import { SECRET_KEY } from '../settings.ts';
import jwt, { JwtPayload } from 'jsonwebtoken'
import { AccessToken } from '../structures/AccessToken.ts';

export function getAccessToken (user: User): AccessToken {
  const payload: JwtPayload = {
    user: {
      id: user.id
    }
  }

  return {
    token: jwt.sign(payload, SECRET_KEY, { expiresIn: '24h' }),
    config: {
      httpOnly: false,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000
    }
  } as AccessToken
}
