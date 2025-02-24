import { Request, Response } from 'express'
import { CommentModel } from '../models/comment.model.js'
import { Comment, validateComment } from '../schemas/comment.schema.js'

export class CommentController {
  static async getAll (request: Request, response: Response): Promise<void> {
    const { amount, page } = request.query
    const comments: Comment[] = await CommentModel.getAll({ amount, page })

    response.json(comments)
  }

  static async create (request: Request, response: Response): Promise<void> {
    const isNewCommentValid = validateComment(request.body)

    if (!isNewCommentValid.success) {
      response.status(400).json({ error: isNewCommentValid.error })
      return
    }

    const { post_id: postId, content, user_id: userId } = isNewCommentValid.data
    const newCommentCreated: boolean = await CommentModel.create({
      content,
      postId,
      userId
    })

    if (!newCommentCreated) {
      response.status(404).json({ message: 'Error while creating comment' })
      return
    }

    response.json({ message: 'Comment created successfully' })
  }

  static async delete (request: Request, response: Response): Promise<void> {
    const { id } = request.params
    const commentDeleted: boolean = await CommentModel.delete({
      commentId: Number(id)
    })

    if (commentDeleted) {
      response.json({ message: 'Comment deleted successfully' })
    } else {
      response.status(404).json({ message: 'Comment not found' })
    }
  }

  static async getById (request: Request, response: Response): Promise<void> {
    const { id } = request.params
    const comment: Comment = await CommentModel.getById({
      commentId: Number(id)
    })

    response.json(comment)
  }

  static async getAllOfPost (
    request: Request,
    response: Response
  ): Promise<void> {
    const { id } = request.params
    const comments: Comment[] = await CommentModel.getAllOfPost({
      postId: Number(id)
    })

    response.json(comments)
  }
}
