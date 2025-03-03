import { Request, Response } from 'express'
import { LikeModel } from '../models/like.model.js'
import { Like, validateLike } from '../schemas/like.schema.js'

export class LikeController {
  static async getAllOfPost (
    request: Request,
    response: Response
  ): Promise<void> {
    const { id } = request.params
    const likes: Like[] = await LikeModel.getAllOfPost({ postId: Number(id) })

    response.json(likes)
  }

  static async getAllOfComment (
    request: Request,
    response: Response
  ): Promise<void> {
    const { id } = request.params
    const likes: Like[] = await LikeModel.getAllOfComment({
      commentId: Number(id)
    })

    response.json(likes)
  }

  static async getAllOfPosts (
    _request: Request,
    response: Response
  ): Promise<void> {
    const likes: Like[] = await LikeModel.getAllOfPosts()

    response.json(likes)
  }

  static async getAllOfComments (
    _request: Request,
    response: Response
  ): Promise<void> {
    const likes: Like[] = await LikeModel.getAllOfComments()

    response.json(likes)
  }

  static async create (request: Request, response: Response): Promise<void> {
    const isNewLikeValid = validateLike(request.body)

    if (!isNewLikeValid.success) {
      response.status(400).json({ error: isNewLikeValid.error })
      return
    }

    const { target_id: targetId, type, user_id: userId } = isNewLikeValid.data
    const newLikeCreated: Like | null = await LikeModel.create({
      targetId,
      type,
      userId
    })

    if (!newLikeCreated) {
      response.status(404).json('Error while creating like')
      return
    }

    response.json(newLikeCreated)
  }

  static async delete (request: Request, response: Response): Promise<void> {
    const { id } = request.params
    const likeDeleted = await LikeModel.delete({ id: Number(id) })

    if (!likeDeleted) {
      response.status(404).json({ message: 'Like not found' })
      return
    }

    response.json({ message: 'Like deleted successfully' })
  }
}