import { NextFunction, Request, Response } from 'express'
import { ALLOWED_ORIGINS } from '../settings.js'
import { Data } from '../structures/Data.js'

export function originMiddleware (
  request: Request,
  response: Response,
  next: NextFunction
) {
  const requestOrigin = request.headers['x-origin'] as string | undefined

  console.log('⚠️ Request Origin: ', requestOrigin)

  if (!requestOrigin) {
    console.warn('⚠️ No origin detected, add "x-origin" header')
    return
  }

  if (!ALLOWED_ORIGINS.includes(requestOrigin)) {
    response.status(403).json(Data.failure('Access not authorized'))
    return
  }

  next()
}
