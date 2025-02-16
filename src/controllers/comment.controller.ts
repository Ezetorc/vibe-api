import { Request, Response } from 'express'
import { CommentModel } from '../models/comment.model'
import { Comment } from '../schemas/comment.schema'

export class CommentController {
  static async getAll (_request: Request, response: Response): Promise<void> {
    const comments: Comment[] = await CommentModel.getAll()

    response.json(comments)
  }

  static async delete (request: Request, response: Response): Promise<void> {
    const { id } = request.params
    const commentDeleted: boolean = await CommentModel.delete({ commentId: Number(id) })

    if (commentDeleted) {
      response.json({ message: 'Comment deleted successfully' })
    } else {
      response.status(404).json({ message: 'Comment not found' })
    }
  }

  static async getById (request: Request, response: Response): Promise<void> {
    const { id } = request.params
    const comment: Comment = await CommentModel.getById({ commentId: Number(id) })

    response.json(comment)
  }

  static async getAllOfPost (request: Request, response: Response): Promise<void> {
    const { id } = request.params
    const comments: Comment[] = await CommentModel.getAllOfPost({ postId: Number(id) })

    response.json(comments)
  }
}
