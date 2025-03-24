import { Request, Response } from 'express'
import { LikeModel } from '../models/like.model.js'
import { Like, validateLike } from '../schemas/like.schema.js'
import { Data } from '../structures/Data.js'

export class LikeController {
  static async getAll (request: Request, response: Response): Promise<void> {
    const { id, type } = request.query

    if (!type) {
      response.status(400).json(Data.failure('Type is missing'))
      return
    }

    if (type !== 'comment' && type !== 'post') {
      response.status(400).json(Data.failure('Invalid type'))
      return
    }

    let likes: Like[] = []

    if (id) {
      const likeId = Number(id)

      if (isNaN(likeId)) {
        response.status(400).json(Data.failure('Invalid ID'))
        return
      }

      likes =
        type === 'comment'
          ? await LikeModel.getAllOfComment({ commentId: likeId })
          : await LikeModel.getAllOfPost({ postId: likeId })
    } else {
      likes =
        type === 'comment'
          ? await LikeModel.getAllOfComments()
          : await LikeModel.getAllOfPosts()
    }

    response.json(Data.success(likes))
  }

  static async getAmount (request: Request, response: Response): Promise<void> {
    const { targetId, type } = request.query

    if (!type) {
      response.status(400).json(Data.failure('Type is missing'))
      return
    }

    if (type !== 'comment' && type !== 'post') {
      response.status(400).json(Data.failure('Invalid type'))
      return
    }

    if (!targetId) {
      response.status(400).json(Data.failure('Target ID is missing'))
      return
    }

    const likesAmount: number = await LikeModel.getAmount({
      targetId: Number(targetId),
      type
    })

    if (likesAmount >= 0) {
      response.json(Data.success(likesAmount))
    } else {
      response.json(Data.failure('Error when getting likes amount'))
    }
  }

  static async create (request: Request, response: Response): Promise<void> {
    const isNewLikeValid = validateLike(request.body)

    if (!isNewLikeValid.success) {
      response.status(400).json(Data.failure(isNewLikeValid.error.toString()))
      return
    }

    const { target_id: targetId, type, user_id: userId } = isNewLikeValid.data
    const newLikeCreated: Like | null = await LikeModel.create({
      targetId,
      type,
      userId
    })

    if (!newLikeCreated) {
      response.status(404).json(Data.failure('Error during like creation'))
      return
    }

    response.json(Data.success(newLikeCreated))
  }

  static async delete (request: Request, response: Response): Promise<void> {
    const { id } = request.query

    if (!id) {
      response.status(400).json(Data.failure('ID is missing'))
      return
    }

    const likeDeleted = await LikeModel.delete({ id: Number(id) })

    if (!likeDeleted) {
      response.status(404).json(Data.failure('Like not found'))
      return
    }

    response.json(Data.success(true))
  }
}
