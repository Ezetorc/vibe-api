import { SECRET_KEY } from '../config.js'
import { UsersModel } from '../models/users.model.js'
import { validatePartialUser } from '../schemas/user.schema.js'
import jwt from 'jsonwebtoken'

export class UsersController {
  static async getAll (_request, response) {
    const users = await UsersModel.getAll()
    response.json(users)
  }

  static async getById (request, response) {
    const { id } = request.params
    const users = await UsersModel.getById({ id })
    response.json(users)
  }

  static async register (request, response) {
    const { name, email, password } = request.body
    const result = validatePartialUser({ name, email, password })

    if (result.error) {
      return response
        .status(400)
        .json({ error: JSON.parse(result.error.message) })
    }

    try {
      const newUser = await UsersModel.register({ name, email, password })
      return response.status(201).json({ success: true, id: newUser.id })
    } catch (error) {
      return response.status(400).json({ success: false, id: -1 })
    }
  }

  static async login (request, response) {
    const { name, password } = request.body
    const result = validatePartialUser({ name, password })

    if (result.error) {
      return response
        .status(400)
        .json({ error: JSON.parse(result.error.message) })
    }

    try {
      const user = await UsersModel.login({ name, password })
      const token = jwt.sign({ user }, SECRET_KEY, {
        expiresIn: '1h'
      })
      response
        .cookie('access_token', token, {
          httpOnly: true,
          secure: process.env.NODE_END === 'production',
          sameSite: 'strict',
          maxAge: 1000 * 60 * 60
        })
        .json({ success: true, id: user.id })
    } catch (error) {
      response.status(401).json({ success: false, id: -1 })
    }
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
