import { NextFunction, Request, Response } from 'express'
import { ALLOWED_ORIGINS } from '../settings.js'
import { Data } from '../structures/Data.js'

export function originMiddleware (
  request: Request,
  response: Response,
  next: NextFunction
) {
  console.log('⚠️ Headers: ', request.headers)
  const requestOrigin = request.headers.origin || request.headers.referer

  console.log('⚠️ Request Origin: ', requestOrigin)
  
  console.log(
    '⚠️ isValid?: ',
    !requestOrigin || !ALLOWED_ORIGINS.includes(requestOrigin)
  )

  if (!requestOrigin) {
    console.warn(
      '⚠️ No origin detected, request may come from Postman or a server.'
    )
    return
  }

  if (!ALLOWED_ORIGINS.includes(requestOrigin)) {
    response.status(403).json(Data.failure('Access not authorized'))
    return
  }

  next()
}
