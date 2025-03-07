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

  static async exists (request: Request, response: Response): Promise<void> {
    const isFollowValid = validateFollower(request.body)

    if (!isFollowValid.success) {
      response.status(400).json(Data.failure(isFollowValid.error.toString()))
      return
    }

    const { follower_id: followerId, following_id: followingId } =
      isFollowValid.data
    const followExists: boolean = await FollowerModel.exists({
      followerId,
      followingId
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
