import { User } from '../schemas/user.schema.js'

export function getSanitizedUser (user: User): Partial<User> {
  return {
    id: user.id,
    name: user.name,
    created_at: user.created_at,
    ...(user.image != null && { image: user.image }),
    ...(user.description != null && { description: user.description })
  }
}
