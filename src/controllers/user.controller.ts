import { Request, Response } from 'express'
import { User, validatePartialUser } from '../schemas/user.schema.js'
import { UserModel } from '../models/user.model.js'
import { SafeParseReturnType } from 'zod'
import { CLOUDINARY, COOKIES } from '../settings.js'
import { isString } from '../utilities/isString.js'
import { isEmpty } from '../utilities/isEmpty.js'
import { Data } from '../structures/Data.js'
import { SessionCookie } from '../structures/SessionCookie.js'
import { getSessionCookie } from '../utilities/getSessionCookie.js'

export class UserController {
  static async getAll (request: Request, response: Response): Promise<void> {
    const { amount, page } = request.query
    const users: User[] = await UserModel.getAll({ amount, page })

    response.json(Data.success(users))
  }

  static async search (request: Request, response: Response): Promise<void> {
    const { query } = request.query

    if (!isString(query) || isEmpty(query)) {
      response.status(400).json(Data.failure('Query parameter is missing'))
      return
    }

    const users: User[] = await UserModel.search({ query })

    response.json(Data.success(users))
  }

  static async getById (request: Request, response: Response): Promise<void> {
    const { id } = request.query

    if (!isString(id) || isEmpty(id)) {
      response.status(400).json(Data.failure('ID is missing'))
      return
    }

    const user: User | null = await UserModel.getById({ id: Number(id) })

    response.json(Data.success(user))
  }

  static async getByName (request: Request, response: Response): Promise<void> {
    const { name } = request.query

    if (!isString(name) || isEmpty(name)) {
      response.status(400).json(Data.failure('Name is missing'))
      return
    }

    const user: User | null = await UserModel.getByName({ name })

    response.json(user)
  }

  static async getByEmail (request: Request, response: Response): Promise<void> {
    const { email } = request.query

    if (!isString(email) || isEmpty(email)) {
      response.status(400).json(Data.failure('Email is missing'))
      return
    }

    const user: User | null = await UserModel.getByEmail({ email })

    response.json(Data.success(user))
  }

  static async register (request: Request, response: Response): Promise<void> {
    const { name, email, password } = request.body
    const result: SafeParseReturnType<User, {}> = validatePartialUser({
      name,
      email,
      password
    })

    if (result.error) {
      response.status(400).json(Data.failure('Invalid user data'))
      return
    }

    const user: User | null = await UserModel.register({
      name,
      email,
      password
    })

    if (!user) {
      response.status(400).json(Data.failure('Error during register'))
      return
    }

    const sessionCookie: SessionCookie = getSessionCookie(user)

    response
      .cookie(COOKIES.SESSION, sessionCookie.token, sessionCookie.options)
      .status(201)
      .json(Data.success(true))
  }

  static async login (request: Request, response: Response): Promise<void> {
    const { name, password } = request.body
    const result: SafeParseReturnType<User, {}> = validatePartialUser({
      name,
      password
    })

    if (!result.success) {
      response.status(400).json(Data.failure('invalid user data'))
      return
    }

    const user: User | null = await UserModel.login({ name, password })

    if (!user) {
      response.json(false)
      return
    }

    const sessionCookie: SessionCookie = getSessionCookie(user)

    response
      .cookie(COOKIES.SESSION, sessionCookie.token, sessionCookie.options)
      .json(Data.success(true))
  }

  static async logout (_request: Request, response: Response): Promise<void> {
    response.clearCookie(COOKIES.SESSION).json(Data.success(true))
  }

  static async deleteImage (
    request: Request,
    response: Response
  ): Promise<void> {
    const { id } = request.query

    if (!isString(id) || isEmpty(id)) {
      response.status(400).json(Data.failure('ID is missing'))
      return
    }

    const result = await CLOUDINARY.uploader.destroy(id as string)

    if (result.result === 'ok') {
      response.status(200).json(Data.success(true))
    } else {
      response
        .status(400)
        .json(Data.failure('Error during Cloudinary image destroy'))
    }
  }

  static async delete (request: Request, response: Response): Promise<void> {
    const { id } = request.query

    if (!isString(id) || isEmpty(id)) {
      response.status(400).json(Data.failure('ID is missing'))
      return
    }

    const deleteSuccess: boolean = await UserModel.delete({ id: Number(id) })

    if (!deleteSuccess) {
      response.status(404).json(Data.failure('User not found'))
      return
    }

    response.json(Data.success(true))
  }

  static async update (request: Request, response: Response): Promise<void> {
    const result: SafeParseReturnType<User, {}> = validatePartialUser(
      request.body
    )

    if (!result.success) {
      response.status(400).json(Data.failure(JSON.parse(result.error.message)))
      return
    }

    const { id } = request.params

    const updateSuccess: boolean = await UserModel.update({
      id: Number(id),
      object: result.data
    })

    if (!updateSuccess) {
      response.status(404).json(Data.failure('No changes made'))
      return
    }

    const user: User | null = await UserModel.getById({ id: Number(id) })

    if (!user) {
      response.json(Data.failure('User not found'))
      return
    }

    const sessionCookie: SessionCookie = getSessionCookie(user)

    response
      .cookie(COOKIES.SESSION, sessionCookie.token, sessionCookie.options)
      .json(Data.success(user))
  }
}
