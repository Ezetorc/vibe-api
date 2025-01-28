import jwt from 'jsonwebtoken'
import { SECRET_KEY } from '../config.js'

export function tokenMiddleware (request, response, next) {
  const token = request.cookies?.access_token
  if (!token) {
    return response.status(401).json({ message: 'Access token is missing' })
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY)

    if (!decoded.user) {
      throw new Error('Invalid token structure')
    }

    request.user = decoded.user
    next()
  } catch (error) {
    response.status(403).json({ message: 'Invalid or expired token' })
  }
}
