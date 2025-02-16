import { JwtPayload } from 'jsonwebtoken'
import { User } from '../schemas/user.schema'

export interface CustomJwtPayload extends JwtPayload {
  user: User
}
