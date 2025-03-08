import { NextFunction, Request, Response } from 'express'
import { API_KEYS } from '../settings.js'

export function keyMiddleware (
  request: Request,
  response: Response,
  next: NextFunction
) {
  const apiKey = request.headers['x-api-key']

  if (!apiKey || typeof apiKey !== 'string' || !API_KEYS.includes(apiKey)) {
    response.status(403).json({ error: 'Access denied. Invalid API key' })
    return
  }

  next()
}
