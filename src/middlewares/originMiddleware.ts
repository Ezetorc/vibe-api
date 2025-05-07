import { NextFunction, Request, Response } from 'express'
import { dataFailure } from '../structures/Data.js'
import { FRONTEND_URL } from '../settings.js'

export function originMiddleware (
  request: Request,
  response: Response,
  next: NextFunction
) {
  const requestOrigin = request.headers.origin ?? request.headers.referer

  if (!requestOrigin) {
    response
      .status(400)
      .json(
        dataFailure('⚠️ No origin detected, add "referer" or "origin" header')
      )
    return
  }

  if (!FRONTEND_URL.includes(requestOrigin)) {
    response.status(403).json(dataFailure('Access not authorized'))
    return
  }

  response.setHeader('Access-Control-Allow-Origin', requestOrigin)
  response.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS, PATCH'
  )
  response.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  )
  response.setHeader('Access-Control-Allow-Credentials', 'true')

  if (request.method === 'OPTIONS') {
    response.status(204).end()
    return
  }

  next()
}
