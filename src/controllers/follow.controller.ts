import { Request, Response } from 'express'
import { Follower } from '../schemas/follower.schema.js'
import { Data } from '../structures/Data.js'
import { FollowModel } from '../models/follow.model.js'

export class FollowController {
  static async getAll (request: Request, response: Response): Promise<void> {
    const { userId } = request.query
    let followers: Follower[] = []

    if (userId) {
      const newFollowers: Follower[] = await FollowModel.getUserFollows({
        userId: Number(userId)
      })
      followers = newFollowers
    } else {
      const newFollowers: Follower[] = await FollowModel.getAll()
      followers = newFollowers
    }

    response.status(201).json(Data.success(followers))
  }

  static async getAmount (request: Request, response: Response): Promise<void> {
    const { userId, type } = request.query

    if (!userId) {
      response.status(400).json(Data.failure('User ID is missing'))
      return
    }

    if (!type) {
      response.status(400).json(Data.failure('Type is missing'))
      return
    }

    if (type !== 'follower' && type !== 'following') {
      response.status(400).json(Data.failure('Invalid type'))
      return
    }

    const followersAmount: number = await FollowModel.getAmount({
      userId: Number(userId),
      type
    })

    if (followersAmount >= 0) {
      response.json(Data.success(followersAmount))
    } else {
      response.json(Data.failure(`Error when getting ${type} amount`))
    }
  }

  static async exists (request: Request, response: Response): Promise<void> {
    const { followerId, followingId } = request.query

    if (!followerId) {
      response.status(400).json(Data.failure('Follower ID is missing'))
      return
    }

    if (!followingId) {
      response.status(400).json(Data.failure('Following ID is missing'))
      return
    }

    const followExists: boolean = await FollowModel.exists({
      followerId: Number(followerId),
      followingId: Number(followingId)
    })

    response.json(Data.success(followExists))
  }

  static async create (request: Request, response: Response): Promise<void> {
    const { followingId } = request.params

    if (!followingId) {
      response.status(400).json(Data.failure('Following ID params is missing'))
      return
    }

    const followerId = Number(request.userId)
    const createSuccess: boolean = await FollowModel.create({
      followerId,
      followingId: Number(followingId)
    })

    if (createSuccess) {
      response.status(201).json(Data.success(true))
    } else {
      response.status(404).json(Data.failure('Error during follower creation'))
    }
  }

  static async delete (request: Request, response: Response): Promise<void> {
    const { followingId } = request.params

    if (!followingId) {
      response.status(400).json(Data.failure('Following ID params is missing'))
      return
    }

    const followerId = Number(request.userId)
    const deleteSuccess: boolean = await FollowModel.delete({
      followerId,
      followingId: Number(followingId)
    })

    if (deleteSuccess) {
      response.status(201).json(Data.success(true))
    } else {
      response.status(404).json(Data.failure('Error during follower deleting'))
    }
  }
}
