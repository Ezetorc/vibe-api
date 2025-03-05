export interface AccessToken {
  token: string
  config: {
    httpOnly: boolean
    sameSite: boolean | undefined | 'lax' | 'strict' | 'none'
    secure: boolean
    maxAge: number
  }
}
