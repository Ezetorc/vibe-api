import { CookieOptions } from 'express'

export interface SessionCookie {
  token: string
  options: CookieOptions
}
