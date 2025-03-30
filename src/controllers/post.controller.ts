import { Request, Response } from 'express'
import { PostModel } from '../models/post.model.js'
import { Post, validatePartialPost } from '../schemas/post.schema.js'
import { Data } from '../structures/Data.js'

export class PostController {
  static async getCount (request: Request, response: Response): Promise<void> {
    const { userId } = request.query

    if (!userId) {
      response.status(400).json(Data.failure('User ID is missing'))
      return
    }

    const postsAmount: number = await PostModel.getCount({
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
    const { id } = request.params

    if (!id) {
      response.status(400).json(Data.failure('ID is missing'))
      return
    }

    const post: Post | null = await PostModel.getById({ id: Number(id) })

    if (post) {
      response.json(Data.success(post))
    } else {
      response.status(404).json(Data.failure('Post not found'))
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
    const result = validatePartialPost(request.body)
    const userId = request.userId

    if (!result.success || !result.data.content || !userId) {
      response
        .status(400)
        .json(
          Data.failure(result.error?.toString() ?? 'Error during post creation')
        )
      return
    }

    const { content } = result.data
    const postCreated = await PostModel.create({ userId, content })

    if (postCreated) {
      response.status(201).json(Data.success(postCreated))
    } else {
      response.status(404).json(Data.failure('Error during post creation'))
    }
  }

  static async delete (request: Request, response: Response): Promise<void> {
    const { id } = request.params

    if (!id) {
      response.status(400).json(Data.failure('ID is missing'))
      return
    }

    const postUserId = await PostModel.getPostUserId({ postId: Number(id) })

    if (postUserId !== request.userId) {
      response.status(401).json(Data.failure('Post delete unauthorized'))
      return
    }

    const deleteSuccess = await PostModel.delete({ id: Number(id) })

    if (!deleteSuccess) {
      response.status(404).json(Data.failure('Post not found'))
    } else {
      response.json(Data.success(true))
    }
  }
}
