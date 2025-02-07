import { UsersModel } from '../models/users.model.js'
import { validatePartialUser } from '../schemas/user.schema.js'
import { getAccessToken } from '../utilities/getAccessToken.js'

export class UsersController {
  static async getAll (_request, response) {
    const users = await UsersModel.getAll()
    response.json(users)
  }

  static async getByUsername (request, response) {
    const { username } = request.params
    const users = await UsersModel.getByUsername({ username })
    response.json(users)
  }

  static async getById (request, response) {
    const { id } = request.params
    const users = await UsersModel.getById({ id })
    response.json(users)
  }

  static async search (request, response) {
    const { query } = request.params

    if (!query || query.trim() === '') {
      return response.status(400).json({ error: 'Query parameter is required' })
    }

    try {
      const posts = await UsersModel.search({ query })
      response.json(posts)
    } catch (error) {
      console.error('Search error:', error)
      response.status(500).json({ error: 'Internal Server Error' })
    }
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
      const accessToken = getAccessToken(newUser)

      response
        .cookie('access_token', accessToken.token, accessToken.config)
        .status(201)
        .json({ success: true, id: newUser.id })
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
      const accessToken = getAccessToken(user)

      response
        .cookie('access_token', accessToken.token, accessToken.config)
        .json({ success: true, user })
    } catch (error) {
      response.status(400).json({ success: false, error: error.message })
    }
  }

  static async logout (_request, response) {
    response.clearCookie('access_token').json({ message: 'Logged out' })
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

    try {
      const updatedUser = await UsersModel.update({ id, object: result.data })

      if (!updatedUser) {
        return response
          .status(404)
          .json({ message: 'User not found or no changes made' })
      }

      const accessToken = getAccessToken(updatedUser)

      return response
        .cookie('access_token', accessToken.token, accessToken.config)
        .json({
          message: 'User updated successfully',
          user: updatedUser
        })
    } catch (error) {
      console.error(error)
      return response.status(500).json({ message: 'Internal server error' })
    }
  }
}
