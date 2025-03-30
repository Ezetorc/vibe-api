import { NextFunction, Request, Response } from 'express'

export function debugMiddleware (
  request: Request,
  response: Response,
  next: NextFunction
) {
  console.log('⚠️ Request Headers: ', request.headers)
  console.log('⚠️ Request Method: ', request.method)

  next()
}
