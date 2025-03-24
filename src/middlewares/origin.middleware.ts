import { NextFunction, Request, Response } from 'express'
import { ALLOWED_ORIGINS } from '../settings.js'
import { Data } from '../structures/Data.js'

export function originMiddleware (
  request: Request,
  response: Response,
  next: NextFunction
) {
  const requestOrigin = request.headers.origin ?? request.headers.referer

  if (!requestOrigin) {
    console.warn('⚠️  No origin detected, add "referer" or "origin" header')
    response.status(400).json(Data.failure('Missing origin'))
    return
  }

  if (!ALLOWED_ORIGINS.includes(requestOrigin)) {
    response.status(403).json(Data.failure('Access not authorized'))
    console.log('Access not authorized')
    return
  }

  response.setHeader('Access-Control-Allow-Origin', requestOrigin)
  response.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  )
  
  response.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  )
  response.setHeader('Access-Control-Allow-Credentials', 'true')

  console.log('request.method: ', request.method)

  if (request.method === 'OPTIONS') {
    response.status(204).end()
    return
  }

  console.log('next?:  next()')

  next()
}
