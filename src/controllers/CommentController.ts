import { Request, Response } from 'express'
import { CommentModel } from '../models/CommentModel.js'
import { Comment, validatePartialComment } from '../schemas/CommentSchema.js'
import { dataSuccess, dataFailure } from '../structures/Data.js'
import { SanitizedComment } from '../structures/SanitizedComment.js'

export class CommentController {
  static async getAll (request: Request, response: Response): Promise<void> {
    const { amount, page } = request.query
    const comments: Comment[] = await CommentModel.getAll({ amount, page })
    const sanitizedComments = await SanitizedComment.getFromComments(comments)

    response.json(dataSuccess(sanitizedComments))
  }

  static async getOfPost (request: Request, response: Response): Promise<void> {
    const { amount, page } = request.query
    const { postId } = request.params

    if (!postId) {
      response.status(400).json(dataFailure('Post ID param is missing'))
      return
    }

    const comments: Comment[] = await CommentModel.getAllOfPost({
      postId: Number(postId),
      amount,
      page
    })

    const sanitizedComments = await SanitizedComment.getFromComments(comments)

    response.json(dataSuccess(sanitizedComments))
  }

  static async getAmountOfPost (
    request: Request,
    response: Response
  ): Promise<void> {
    const { postId } = request.params

    if (!postId) {
      response.status(400).json(dataFailure('Post ID param is missing'))
      return
    }

    const commentsAmount: number = await CommentModel.getAmountOfPost({
      postId: Number(postId)
    })

    if (commentsAmount >= 0) {
      response.json(dataSuccess(commentsAmount))
    } else {
      response.json(dataFailure('Error during data fetching'))
    }
  }

  static async create (request: Request, response: Response): Promise<void> {
    const isNewCommentValid = validatePartialComment(request.body)

    if (
      !isNewCommentValid.success ||
      !isNewCommentValid.data.content ||
      !isNewCommentValid.data.post_id
    ) {
      response.status(400).json(dataFailure('Invalid request body'))
      return
    }

    const { post_id: postId, content } = isNewCommentValid.data
    const newComment: Comment | null = await CommentModel.create({
      content,
      postId,
      userId: Number(request.userId)
    })

    if (!newComment) {
      response.status(404).json(dataFailure('Error during comment creation'))
    } else {
      const sanitizedComment = await SanitizedComment.getFromComment(newComment)
      response.json(dataSuccess(sanitizedComment))
    }
  }

  static async delete (request: Request, response: Response): Promise<void> {
    const { id } = request.params

    if (!id) {
      response.status(400).json(dataFailure('ID is missing'))
      return
    }

    const commentUserId = await CommentModel.getCommentUserId({
      commentId: Number(id)
    })

    if (commentUserId !== request.userId) {
      response.status(401).json(dataFailure('Comment delete unauthorized'))
      return
    }

    const deletedCommentId: number = await CommentModel.delete({
      commentId: Number(id)
    })

    if (deletedCommentId >= 0) {
      response.json(dataSuccess(deletedCommentId))
    } else {
      response.status(404).json(dataFailure('Comment not found'))
    }
  }

  static async getById (request: Request, response: Response): Promise<void> {
    const { id } = request.params

    if (!id) {
      response.status(400).json(dataFailure('ID is missing'))
      return
    }

    const comment: Comment | null = await CommentModel.getById({
      commentId: Number(id)
    })

    if (comment) {
      const sanitizedComment = await SanitizedComment.getFromComment(comment)
      response.json(dataSuccess(sanitizedComment))
    } else {
      response.status(404).json(dataFailure('Comment not found'))
    }
  }
}
