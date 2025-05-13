import { Request, Response } from 'express'
import { dataFailure, dataSuccess } from '../structures/Data.js'
import { FollowModel } from '../models/FollowModel.js'

export class FollowController {
  static async getFollowersIds (
    request: Request,
    response: Response
  ): Promise<void> {
    const { userId } = request

    const followersIds: number[] = await FollowModel.getUserFollowersIds({
      userId: Number(userId)
    })

    response.status(201).json(dataSuccess(followersIds))
  }

  static async getAmount (request: Request, response: Response): Promise<void> {
    const { userId, type } = request.query

    if (!userId) {
      response.status(400).json(dataFailure('User ID is missing'))
      return
    }

    if (!type) {
      response.status(400).json(dataFailure('Type is missing'))
      return
    }

    if (type !== 'follower' && type !== 'following') {
      response.status(400).json(dataFailure('Invalid type'))
      return
    }

    const followersAmount: number = await FollowModel.getAmount({
      userId: Number(userId),
      type
    })

    if (followersAmount >= 0) {
      response.json(dataSuccess(followersAmount))
    } else {
      response.json(dataFailure(`Error when getting ${type} amount`))
    }
  }

  static async exists (request: Request, response: Response): Promise<void> {
    const { followerId, followingId } = request.query

    if (!followerId) {
      response.status(400).json(dataFailure('Follower ID is missing'))
      return
    }

    if (!followingId) {
      response.status(400).json(dataFailure('Following ID is missing'))
      return
    }

    const followExists: boolean = await FollowModel.exists({
      followerId: Number(followerId),
      followingId: Number(followingId)
    })

    response.json(dataSuccess(followExists))
  }

  static async create (request: Request, response: Response): Promise<void> {
    const { followingId } = request.params

    if (!followingId) {
      response.status(400).json(dataFailure('Following ID params is missing'))
      return
    }

    const followerId = Number(request.userId)
    const createSuccess: boolean = await FollowModel.create({
      followerId,
      followingId: Number(followingId)
    })

    if (createSuccess) {
      response.status(201).json(dataSuccess(true))
    } else {
      response.status(404).json(dataFailure('Error during follow creation'))
    }
  }

  static async delete (request: Request, response: Response): Promise<void> {
    const { followingId } = request.params

    if (!followingId) {
      response.status(400).json(dataFailure('Following ID params is missing'))
      return
    }

    const followerId = Number(request.userId)
    const deleteSuccess: boolean = await FollowModel.delete({
      followerId,
      followingId: Number(followingId)
    })

    if (deleteSuccess) {
      response.status(201).json(dataSuccess(true))
    } else {
      response.status(404).json(dataFailure('Error during follower deleting'))
    }
  }
}
