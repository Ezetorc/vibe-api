import jsonwebtoken from 'jsonwebtoken'
import { SECRET_KEY } from '../settings.js'

export function getAuthorization (userId: string | number): string {
  const payload = { userId: String(userId) }
  const authorization = jsonwebtoken.sign(payload, SECRET_KEY, {
    expiresIn: '1d'
  })

  return authorization
}
