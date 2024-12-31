import { UsersModel } from '../models/users.model.js'
import { validatePartialUser, validateUser } from '../schemas/user.schema.js'

export class UsersController {
  static async getAll (_request, response) {
    const users = await UsersModel.getAll()
    response.json(users)
  }

  static async getByEmail (request, response) {
    const { email } = request.params
    const users = await UsersModel.getByEmail({ email })
    response.json(users)
  }

  static async getById (request, response) {
    const { id } = request.params
    const users = await UsersModel.getById({ id })
    response.json(users)
  }

  static async create (request, response) {
    const result = validateUser(request.body)

    if (result.error) {
      return response
        .status(400)
        .json({ error: JSON.parse(result.error.message) })
    }

    const existingUser = await UsersModel.getByEmail(result.data.email)
    if (existingUser) {
      return response.status(400).json({ error: 'Email already in use' })
    }

    const newUser = await UsersModel.create(result.data)
    response.status(201).json(newUser)
  }

  static async delete (request, response) {
    const { id } = request.params
    const result = await UsersModel.delete({ id })

    if (result === 0) {
      return response.status(404).json({ message: 'User not found' })
    }

    return response.json({ message: 'User deleted successfully' })
  }

  static async update (request, response) {
    const result = validatePartialUser(request.body)

    if (!result.success) {
      return response
        .status(400)
        .json({ error: JSON.parse(result.error.message) })
    }

    const { id } = request.params

    const updatedUser = await UsersModel.update({ id, object: result.data })

    if (!updatedUser || updatedUser.changes === 0) {
      return response
        .status(404)
        .json({ message: 'User not found or no changes made' })
    }

    return response.json({ message: 'User updated successfully', updatedUser })
  }
}
