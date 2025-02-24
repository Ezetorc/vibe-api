import { JwtPayload } from 'jsonwebtoken'
import { User } from '../schemas/user.schema.js'

export interface CustomJwtPayload extends JwtPayload {
  user: User
}
