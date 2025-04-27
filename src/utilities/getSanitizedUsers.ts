import { User } from '../schemas/user.schema.js'
import { getSanitizedUser } from './getSanitizedUser.js'

export function getSanitizedUsers (users: User[]): Partial<User>[] {
  return users.map(user => getSanitizedUser(user))
}
