import jwt from 'jsonwebtoken'
import { SECRET_KEY } from '../config.js'

export function getAccessToken (user) {
  const payload = {
    user: {
      id: user.id
    }
  }

  return {
    token: jwt.sign(payload, SECRET_KEY, { expiresIn: '24h' }),
    config: {
      httpOnly: false,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000
    }
  }
}
