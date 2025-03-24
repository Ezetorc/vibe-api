import { NextFunction, Request, Response } from 'express'

export function debugMiddleware (
  request: Request,
  response: Response,
  next: NextFunction
) {
  const requestOrigin = request.headers.origin ?? request.headers.referer
  
  console.log('Origin: ', requestOrigin)
  console.log('Request: ', Boolean(request))
  console.log('Response: ', Boolean(response))
  console.log('Request Headers: ', request.headers)

  next()
}
