import { Request, Response } from 'express'
import { PostModel } from '../models/post.model.js'
import {
  Post,
  validatePartialPost,
  validatePost
} from '../schemas/post.schema.js'
import { SafeParseReturnType } from 'zod'
import { Data } from '../structures/Data.js'

export class PostController {
  static async getAmount (request: Request, response: Response): Promise<void> {
    const { userId } = request.query

    if (!userId) {
      response.status(400).json(Data.failure('User ID is missing'))
      return
    }

    const postsAmount: number = await PostModel.getAmount({
      userId: Number(userId)
    })

    if (postsAmount >= 0) {
      response.json(Data.success(postsAmount))
    } else {
      response.json(Data.failure('Error when getting posts amount'))
    }
  }

  static async getAll (request: Request, response: Response): Promise<void> {
    const { amount, page, userId } = request.query
    const posts: Post[] = await PostModel.getAll({
      amount,
      page,
      userId: Number(userId)
    })

    response.json(Data.success(posts))
  }

  static async getById (request: Request, response: Response): Promise<void> {
    const { id } = request.query

    if (!id) {
      response.status(400).json(Data.failure('ID is missing'))
      return
    }

    const post: Post | null = await PostModel.getById({ id: Number(id) })

    if (post) {
      response.json(Data.success(post))
    } else {
      response.json(Data.failure('Post not found'))
    }
  }

  static async search (request: Request, response: Response): Promise<void> {
    const { query, userId } = request.query

    if (!query) {
      response.status(400).json(Data.failure('Query is missing'))
      return
    }

    const posts: Post[] = await PostModel.search({
      query: String(query),
      userId
    })

    response.json(Data.success(posts))
  }

  static async create (request: Request, response: Response): Promise<void> {
    const result: SafeParseReturnType<Post, Post> = validatePost(request.body)

    if (!result.success) {
      response.status(400).json(Data.failure(result.error.toString()))
      return
    }

    const { user_id: userId, content } = result.data
    const postCreated = await PostModel.create({ userId, content })

    if (postCreated) {
      response.status(201).json(Data.success(postCreated))
    } else {
      response.status(404).json(Data.failure('Error during post creation'))
    }
  }

  static async delete (request: Request, response: Response): Promise<void> {
    const { id } = request.query

    if (!id) {
      response.status(400).json(Data.failure('ID is missing'))
      return
    }

    const deleteSuccess = await PostModel.delete({ id: Number(id) })

    if (!deleteSuccess) {
      response.status(404).json(Data.failure('Post not found'))
    } else {
      response.json(Data.success(true))
    }
  }

  static async update (request: Request, response: Response): Promise<void> {
    const postValidation = validatePartialPost(request.body)

    if (!postValidation.success) {
      response
        .status(400)
        .json(Data.failure(JSON.parse(postValidation.error.message)))
      return
    }

    const { id } = request.query

    const updateSuccess: boolean = await PostModel.update({
      id: Number(id),
      object: postValidation.data
    })

    if (!updateSuccess) {
      response
        .status(404)
        .json(Data.failure('Post not found or no changes made'))
      return
    }

    response.json(Data.success(true))
  }
}
