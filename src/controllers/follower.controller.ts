import { Request, Response } from 'express'
import { FollowerModel } from '../models/follower.model.js'
import { Follower, validateFollower } from '../schemas/follower.schema.js'

export class FollowerController {
  static async getAll (_request: Request, response: Response): Promise<void> {
    const followers: Follower[] = await FollowerModel.getAll()

    response.status(201).json(followers)
  }

  static async create (request: Request, response: Response): Promise<void> {
    const isNewFollowerValid = validateFollower(request.body)

    if (!isNewFollowerValid.success) {
      response.status(400).json({ error: isNewFollowerValid.error })
      return
    }

    const { follower_id: followerId, following_id: followingId } =
      isNewFollowerValid.data
    const newFollowerCreated: boolean = await FollowerModel.create({
      followerId,
      followingId
    })

    response.status(201).json(newFollowerCreated)
  }

  static async delete (request: Request, response: Response): Promise<void> {
    const isFollowerToDeleteValid = validateFollower(request.body)

    if (!isFollowerToDeleteValid.success) {
      response.status(400).json({ error: isFollowerToDeleteValid.error })
      return
    }

    const { follower_id: followerId, following_id: followingId } =
      isFollowerToDeleteValid.data
    const followerDeleted: boolean = await FollowerModel.delete({
      followerId,
      followingId
    })

    response.status(201).json(followerDeleted)
  }

  static async getUserFollowersIds (
    request: Request,
    response: Response
  ): Promise<void> {
    const { userId } = request.params
    const userFollowersIds: number[] = await FollowerModel.getUserFollowersIds({
      userId: Number(userId)
    })

    response.status(201).json(userFollowersIds)
  }
}
