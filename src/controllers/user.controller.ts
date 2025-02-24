import { Request, Response } from 'express'
import { User, validatePartialUser } from '../schemas/user.schema.js'
import { getAccessToken } from '../utilities/getAccessToken.js'
import { UserModel } from '../models/user.model.js'
import { SafeParseReturnType } from 'zod'
import { AccessToken } from '../structures/AccessToken.js'

export class UserController {
  static async getAll (request: Request, response: Response): Promise<void> {
    const { amount, page } = request.query
    const users: User[] = await UserModel.getAll({ amount, page })

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

  static async nameExists (request: Request, response: Response): Promise<void> {
    const { name } = request.params
    const nameExists: boolean = await UserModel.exists({ name })

    response.json(nameExists)
  }

  static async getByUsername (
    request: Request,
    response: Response
  ): Promise<void> {
    const { username } = request.params
    const user: User | null = await UserModel.getByName({ name: username })

    response.json(user)
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

    const registeredUser: User | null = await UserModel.getByName({ name })

    if (!registeredUser) {
      response.status(400).json({ message: 'User not found' })
      return
    }

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

    if (!result.success) {
      response.status(400).json({ error: "Invalid name or password" })
      return
    }

    const user: User | null = await UserModel.login({ name, password })

    if (!user) {
      response.json({ success: false })
      return
    }

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
