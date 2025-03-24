import { Request, Response } from 'express'
import { FollowerModel } from '../models/follower.model.js'
import { Follower, validateFollower } from '../schemas/follower.schema.js'
import { Data } from '../structures/Data.js'

export class FollowerController {
  static async getAll (request: Request, response: Response): Promise<void> {
    const { userId } = request.query
    let followers: Follower[] = []

    if (userId) {
      const newFollowers: Follower[] = await FollowerModel.getUserFollowers({
        userId: Number(userId)
      })
      followers = newFollowers
    } else {
      const newFollowers: Follower[] = await FollowerModel.getAll()
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

    const followersAmount: number = await FollowerModel.getAmount({
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

    const followExists: boolean = await FollowerModel.exists({
      followerId: Number(followerId),
      followingId: Number(followingId)
    })

    response.json(Data.success(followExists))
  }

  static async create (request: Request, response: Response): Promise<void> {
    const isNewFollowerValid = validateFollower(request.body)

    if (!isNewFollowerValid.success) {
      response
        .status(400)
        .json(Data.failure(isNewFollowerValid.error.toString()))
      return
    }

    const { follower_id: followerId, following_id: followingId } =
      isNewFollowerValid.data
    const createSuccess: boolean = await FollowerModel.create({
      followerId,
      followingId
    })

    if (createSuccess) {
      response.status(201).json(Data.success(true))
    } else {
      response.status(404).json(Data.failure('Error during follower creation'))
    }
  }

  static async delete (request: Request, response: Response): Promise<void> {
    const isFollowerToDeleteValid = validateFollower(request.body)

    if (!isFollowerToDeleteValid.success) {
      response
        .status(400)
        .json(Data.failure(isFollowerToDeleteValid.error.toString()))
      return
    }

    const { follower_id: followerId, following_id: followingId } =
      isFollowerToDeleteValid.data
    const deleteSuccess: boolean = await FollowerModel.delete({
      followerId,
      followingId
    })

    if (deleteSuccess) {
      response.status(201).json(Data.success(true))
    } else {
      response.status(404).json(Data.failure('Error during follower deleting'))
    }
  }
}
