import { Request, Response } from 'express'
import { User, validatePartialUser } from '../schemas/user.schema.js'
import { getAccessToken } from '../utilities/getAccessToken.js'
import { UserModel } from '../models/user.model.js'
import { SafeParseReturnType } from 'zod'
import { AccessToken } from '../structures/AccessToken.js'

export class UserController {
  static async getAll (_request: Request, response: Response): Promise<void> {
    const users: User[] = await UserModel.getAll()

    response.json(users)
  }

  static async emailExists (
    request: Request,
    response: Response
  ): Promise<void> {
    const { email } = request.params
    const emailExists: boolean = await UserModel.exists({ email })

    response.json(emailExists)
  }

  static async getByUsername (
    request: Request,
    response: Response
  ): Promise<void> {
    const { username } = request.params
    const users: User = await UserModel.getByName({ name: username })

    response.json(users)
  }

  static async getById (request: Request, response: Response): Promise<void> {
    const { id } = request.params
    const users: User = await UserModel.getById({ id: Number(id) })

    response.json(users)
  }

  static async search (request: Request, response: Response): Promise<void> {
    const { query } = request.params

    if (!query || query.trim() === '') {
      response.status(400).json({ error: 'Query parameter is required' })
      return
    }

    const users: User[] = await UserModel.search({ query })

    response.json(users)
  }

  static async register (request: Request, response: Response): Promise<void> {
    const { name, email, password } = request.body
    const result: SafeParseReturnType<User, {}> = validatePartialUser({
      name,
      email,
      password
    })

    if (result.error) {
      response.status(400).json({ error: JSON.parse(result.error.message) })
      return
    }

    const registered: boolean = await UserModel.register({
      name,
      email,
      password
    })

    if (!registered) {
      response.status(400).json({ message: 'Error when registering' })
      return
    }

    const registeredUser: User = await UserModel.getByName({ name })
    const accessToken: AccessToken = getAccessToken(registeredUser)

    response
      .cookie('access_token', accessToken.token, accessToken.config)
      .status(201)
      .json({ success: true, id: registeredUser.id })
  }

  static async login (request: Request, response: Response): Promise<void> {
    const { name, password } = request.body
    const result: SafeParseReturnType<User, {}> = validatePartialUser({
      name,
      password
    })

    if (result.error) {
      response.status(400).json({ error: JSON.parse(result.error.message) })
      return
    }

    const user: User = await UserModel.login({ name, password })
    const accessToken: AccessToken = getAccessToken(user)

    response
      .cookie('access_token', accessToken.token, accessToken.config)
      .json({ success: true, user })
  }

  static async logout (_request: Request, response: Response): Promise<void> {
    response.clearCookie('access_token').json({ message: 'Logged out' })
  }

  static async delete (request: Request, response: Response): Promise<void> {
    const { id } = request.params
    const userDeleted: boolean = await UserModel.delete({ id: Number(id) })

    if (!userDeleted) {
      response.status(404).json({ message: 'User not found' })
      return
    }

    response.json({ message: 'User deleted successfully' })
  }

  static async update (request: Request, response: Response): Promise<void> {
    const result: SafeParseReturnType<User, {}> = validatePartialUser(
      request.body
    )

    if (!result.success) {
      response.status(400).json({ error: JSON.parse(result.error.message) })
      return
    }

    const { id } = request.params

    const userUpdate: boolean = await UserModel.update({
      id: Number(id),
      object: result.data
    })

    if (!userUpdate) {
      response
        .status(404)
        .json({ message: 'User not found or no changes made' })
      return
    }

    const updatedUser: User = await UserModel.getById({ id: Number(id) })
    const accessToken: AccessToken = getAccessToken(updatedUser)

    response
      .cookie('access_token', accessToken.token, accessToken.config)
      .json({
        message: 'User updated successfully',
        user: updatedUser
      })
  }
}
