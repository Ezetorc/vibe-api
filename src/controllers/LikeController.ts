import { Request, Response } from 'express'
import { LikeModel } from '../models/LikeModel.js'
import { Like, validatePartialLike } from '../schemas/LikeSchema.js'
import { dataFailure, dataSuccess } from '../structures/Data.js'

export class LikeController {
  static async getAll (request: Request, response: Response): Promise<void> {
    const { type, targetId } = request.query

    if (!type) {
      response.status(400).json(dataFailure('Type is missing'))
      return
    }

    if (type !== 'comment' && type !== 'post') {
      response.status(400).json(dataFailure('Invalid type'))
      return
    }

    if (targetId) {
      const likes: Like[] =
        type === 'comment'
          ? await LikeModel.getAllOfComment({ commentId: Number(targetId) })
          : await LikeModel.getAllOfPost({ postId: Number(targetId) })

      response.json(dataSuccess(likes))
    } else {
      const likes: Like[] =
        type === 'comment'
          ? await LikeModel.getAllOfComments()
          : await LikeModel.getAllOfPosts()

      response.json(dataSuccess(likes))
    }
  }

  static async getCount (request: Request, response: Response): Promise<void> {
    const { targetId, type } = request.query

    if (!type) {
      response.status(400).json(dataFailure('Type is missing'))
      return
    }

    if (type !== 'comment' && type !== 'post') {
      response.status(400).json(dataFailure('Invalid type'))
      return
    }

    if (!targetId) {
      response.status(400).json(dataFailure('Target ID is missing'))
      return
    }

    const likesAmount: number = await LikeModel.getAmount({
      targetId: Number(targetId),
      type
    })

    if (likesAmount >= 0) {
      response.json(dataSuccess(likesAmount))
    } else {
      response.json(dataFailure('Error when getting likes amount'))
    }
  }

  static async create (request: Request, response: Response): Promise<void> {
    const isNewLikeValid = validatePartialLike(request.body)

    if (
      !isNewLikeValid.success ||
      !isNewLikeValid.data.target_id ||
      !isNewLikeValid.data.type
    ) {
      response.status(400).json(dataFailure('Invalid request body'))
      return
    }

    const userId = Number(request.userId)
    const { target_id: targetId, type } = isNewLikeValid.data
    const newLikeCreated: Like | null = await LikeModel.create({
      targetId,
      type,
      userId
    })

    if (!newLikeCreated) {
      response.status(404).json(dataFailure('Error during like creation'))
      return
    }

    response.json(dataSuccess(newLikeCreated))
  }

  static async delete (request: Request, response: Response): Promise<void> {
    const { id } = request.params

    if (!id) {
      response.status(400).json(dataFailure('ID is missing'))
      return
    }

    const likeUserId = await LikeModel.getLikeUserId({ likeId: Number(id) })

    if (likeUserId !== request.userId) {
      response.status(401).json(dataFailure('Like delete unauthorized'))
      return
    }

    const likeDeleted = await LikeModel.delete({ id: Number(id) })

    if (!likeDeleted) {
      response.status(404).json(dataFailure('Like not found'))
      return
    }

    response.json(dataSuccess(true))
  }
}
