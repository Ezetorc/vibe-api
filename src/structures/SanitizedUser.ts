import { User } from '../schemas/UserSchema'

export class SanitizedUser {
  public id: User['id']
  public name: User['name']
  public created_at: User['created_at']
  public image?: User['image']
  public description?: User['description']

  constructor (props: {
    id: User['id']
    name: User['name']
    created_at: User['created_at']
    image?: User['image']
    description?: User['description']
  }) {
    this.id = props.id
    this.name = props.name
    this.created_at = props.created_at
    this.image = props.image
    this.description = props.description
  }

  static getFromUser (user: User): SanitizedUser {
    return {
      id: user.id,
      name: user.name,
      created_at: user.created_at,
      ...(user.image != null && { image: user.image }),
      ...(user.description != null && { description: user.description })
    }
  }

  static getFromUsers (users: User[]): SanitizedUser[] {
    return users.map(user => this.getFromUser(user))
  }
}
