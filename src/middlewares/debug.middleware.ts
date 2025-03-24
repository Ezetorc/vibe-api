import { NextFunction, Request, Response } from 'express'

export function debugMiddleware (
  request: Request,
  response: Response,
  next: NextFunction
) {
  console.log('Origin: ', request.headers.origin)
  console.log('Referer: ', request.headers.referer)
  console.log('Request: ', Boolean(request))
  console.log('Response: ', Boolean(response))
  console.log('Request Headers: ', request.headers)

  next()
}
