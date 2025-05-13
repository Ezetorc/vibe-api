import { Request, Response } from 'express'
import { User, validatePartialUser } from '../schemas/UserSchema.js'
import { UserModel } from '../models/UserModel.js'
import { CLOUDINARY } from '../settings.js'
import { dataFailure, dataSuccess } from '../structures/Data.js'
import { getAuthorization } from '../utilities/getAuthorization.js'
import { SanitizedUser } from '../structures/SanitizedUser.js'

export class UserController {
  static async exists (request: Request, response: Response): Promise<void> {
    const { name, email } = request.query

    if (!name && !email) {
      response
        .status(400)
        .json(dataFailure('Any name or email has been passed'))
      return
    }

    if (name) {
      const nameExists = await UserModel.nameExists({ name: String(name) })
      response.json(dataSuccess(nameExists))
    } else if (email) {
      const emailExists = await UserModel.emailExists({ email: String(email) })
      response.json(dataSuccess(emailExists))
    }
  }

  static async liked (request: Request, response: Response): Promise<void> {
    const { id } = request.params
    const { type, targetId } = request.query

    if (!type) {
      response.status(400).json(dataFailure('Type is missing'))
      return
    }

    if (type !== 'comment' && type !== 'post') {
      response.status(400).json(dataFailure('Invalid type'))
      return
    }

    if (!id) {
      response.status(400).json(dataFailure('User ID is missing'))
      return
    }

    if (!targetId) {
      response.status(400).json(dataFailure('Target ID is missing'))
      return
    }

    if (type === 'comment') {
      const liked = await UserModel.likedComment({
        commentId: Number(targetId),
        userId: Number(id)
      })
      response.json(dataSuccess(liked))
    } else if (type === 'post') {
      const liked = await UserModel.likedPost({
        postId: Number(targetId),
        userId: Number(id)
      })
      response.json(dataSuccess(liked))
    }
  }

  static async getAll (request: Request, response: Response): Promise<void> {
    const { amount, page } = request.query
    const users: User[] = await UserModel.getAll({ amount, page })
    const sanitizedUsers: SanitizedUser[] = SanitizedUser.getFromUsers(users)

    response.json(dataSuccess(sanitizedUsers))
  }

  static async search (request: Request, response: Response): Promise<void> {
    const { query } = request.params
    const { amount, page } = request.query

    if (!query) {
      response.status(400).json(dataFailure('Query parameter is missing'))
      return
    }

    const users: User[] = await UserModel.search({
      query: String(query),
      amount,
      page
    })
    const sanitizedUsers: Partial<User>[] = SanitizedUser.getFromUsers(users)

    response.json(dataSuccess(sanitizedUsers))
  }

  static async getById (request: Request, response: Response): Promise<void> {
    const { id } = request.params

    if (!id) {
      response.status(400).json(dataFailure('ID is missing'))
      return
    }

    const user: User | null = await UserModel.getById({ id: Number(id) })

    if (user) {
      const sanitizedUser = SanitizedUser.getFromUser(user)
      response.json(dataSuccess(sanitizedUser))
    } else {
      response.status(404).json(dataFailure('User not found'))
    }
  }

  static async register (request: Request, response: Response): Promise<void> {
    const result = validatePartialUser(request.body)

    if (
      result.error ||
      !result.data.name ||
      !result.data.email ||
      !result.data.password
    ) {
      response.status(400).json(dataFailure('Invalid user data'))
      return
    }

    const user: User | null = await UserModel.register({
      name: result.data.name.trim(),
      email: result.data.email.trim(),
      password: result.data.password.trim()
    })

    if (!user) {
      response.status(401).json(dataFailure('Error during register'))
      return
    }

    const authorization = getAuthorization(user.id!)

    response
      .setHeader('Authorization', `Bearer ${authorization}`)
      .setHeader('Access-Control-Expose-Headers', 'Authorization')
      .json(dataSuccess(true))
  }

  static async login (request: Request, response: Response): Promise<void> {
    const result = validatePartialUser(request.body)

    if (!result.success || !result.data.name || !result.data.password) {
      response.status(400).json(dataFailure('Invalid user data'))
      return
    }

    const user: User | null = await UserModel.login({
      name: result.data.name.trim(),
      password: result.data.password.trim()
    })

    if (!user) {
      response.json(dataSuccess(false))
      return
    }

    const authorization = getAuthorization(user.id!)

    response
      .setHeader('Authorization', `Bearer ${authorization}`)
      .setHeader('Access-Control-Expose-Headers', 'Authorization')
      .json(dataSuccess(true))
  }

  static async deleteImage (
    request: Request,
    response: Response
  ): Promise<void> {
    const publicId = request.params

    if (!publicId) {
      response.status(400).json(dataFailure('ID is missing'))
      return
    }

    const result = await CLOUDINARY.uploader.destroy(String(publicId.publicId))

    if (result.result === 'ok') {
      response.status(200).json(dataSuccess(true))
    } else {
      response
        .status(400)
        .json(dataFailure('Error during Cloudinary image destroy'))
    }
  }

  static async delete (request: Request, response: Response): Promise<void> {
    const { userId } = request

    if (!userId) {
      response.status(400).json(dataFailure('ID is missing'))
      return
    }

    const deleteSuccess: boolean = await UserModel.delete({ id: userId })

    if (!deleteSuccess) {
      response.status(404).json(dataFailure('User not found'))
      return
    }

    response.json(dataSuccess(true))
  }

  static async update (request: Request, response: Response): Promise<void> {
    const id = request.userId

    if (!id) {
      response.status(400).json(dataFailure('ID is missing'))
      return
    }

    const result = validatePartialUser(request.body)

    if (!result.success) {
      response.status(400).json(dataFailure(JSON.parse(result.error.message)))
      return
    }

    const updateSuccess: boolean = await UserModel.update({
      id: Number(id),
      object: result.data
    })

    if (!updateSuccess) {
      response.status(404).json(dataFailure('No changes made'))
      return
    }

    const user: User | null = await UserModel.getById({ id: Number(id) })

    if (!user) {
      response.json(dataFailure('User not found'))
      return
    }

    const sanitizedUser = SanitizedUser.getFromUser(user)

    response.json(dataSuccess(sanitizedUser))
  }
}
