import { Request, Response } from 'express'
import { PostModel } from '../models/post.model.js'
import {
  Post,
  validatePartialPost,
  validatePost
} from '../schemas/post.schema.js'
import { SafeParseReturnType } from 'zod'

export class PostController {
  static async getAll (_request: Request, response: Response): Promise<void> {
    const posts: Post[] = await PostModel.getAll()

    response.json(posts)
  }

  static async getById (request: Request, response: Response): Promise<void> {
    const { id } = request.params
    const post: Post = await PostModel.getById({ id: Number(id) })

    response.json(post)
  }

  static async search (request: Request, response: Response): Promise<void> {
    const { query } = request.params

    if (!query || query.trim() === '') {
      response.status(400).json({ error: 'Query parameter is required' })
      return
    }

    const posts: Post[] = await PostModel.search({ query })

    response.json(posts)
  }

  static async create (request: Request, response: Response): Promise<void> {
    const result: SafeParseReturnType<Post, Post> = validatePost(request.body)

    if (!result.success) {
      response.status(400).json({ error: result.error })
      return
    }

    const { user_id: userId, content } = result.data
    const postCreation = await PostModel.create({ userId, content })

    response.status(201).json(postCreation)
  }

  static async delete (request: Request, response: Response): Promise<void> {
    const { id } = request.params
    const postDeleted = await PostModel.delete({ id: Number(id) })

    if (!postDeleted) {
      response.status(404).json({ message: 'Post not found' })
      return
    }

    response.json({ message: 'Post deleted successfully' })
    return
  }

  static async update (request: Request, response: Response): Promise<void> {
    const postValidation = validatePartialPost(request.body)

    if (!postValidation.success) {
      response
        .status(400)
        .json({ error: JSON.parse(postValidation.error.message) })
      return
    }

    const { id } = request.params

    const postUpdate: boolean = await PostModel.update({
      id: Number(id),
      object: postValidation.data
    })

    if (!postUpdate) {
      response
        .status(404)
        .json({ message: 'Post not found or no changes made' })
      return
    }

    response.json({ message: 'Post updated successfully' })
  }
}
