import { Request, Response } from 'express'
import { CommentModel } from '../models/comment.model.js'
import { Comment, validateComment } from '../schemas/comment.schema.js'
import { Data } from 'api-responser'
import { isString } from '../utilities/isString.js'
import { isEmpty } from '../utilities/isEmpty.js'

export class CommentController {
  static async getAll (request: Request, response: Response): Promise<void> {
    const { amount, page, postId } = request.query
    let comments: Comment[] = []

    if (postId) {
      const newComments: Comment[] = await CommentModel.getAllOfPost({
        postId: Number(postId)
      })
      comments = newComments
    } else {
      const newComments: Comment[] = await CommentModel.getAll({ amount, page })
      comments = newComments
    }

    response.json(Data.success(comments))
  }

  static async create (request: Request, response: Response): Promise<void> {
    const isNewCommentValid = validateComment(request.body)

    if (!isNewCommentValid.success) {
      response.status(400).json(Data.failure(isNewCommentValid.error))
      return
    }

    const { post_id: postId, content, user_id: userId } = isNewCommentValid.data
    const newComment: Comment | null = await CommentModel.create({
      content,
      postId,
      userId
    })

    if (!newComment) {
      response.status(404).json(Data.failure('Error during comment creation'))
    } else {
      response.json(Data.success(newComment))
    }
  }

  static async delete (request: Request, response: Response): Promise<void> {
    const { id } = request.query

    if (!isString(id) || isEmpty(id)) {
      response.status(400).json(Data.failure('ID is missing'))
      return
    }

    const deleteSuccess: boolean = await CommentModel.delete({
      commentId: Number(id)
    })

    if (deleteSuccess) {
      response.json(Data.success(true))
    } else {
      response.status(404).json(Data.failure('Comment not found'))
    }
  }

  static async getById (request: Request, response: Response): Promise<void> {
    const { id } = request.query

    if (!isString(id) || isEmpty(id)) {
      response.status(400).json(Data.failure('ID is missing'))
      return
    }

    const comment: Comment | null = await CommentModel.getById({
      commentId: Number(id)
    })

    if (comment) {
      response.json(Data.success(comment))
    } else {
      response.status(404).json(Data.failure('Comment not found'))
    }
  }
}
