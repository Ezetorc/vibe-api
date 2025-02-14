import { FollowersModel } from '../models/followers.model.js'
import { validateFollower } from '../schemas/follower.schema.js'

export class FollowersController {
  static async getAll (_request, response) {
    const followers = await FollowersModel.getAll()
    return response.status(201).json(followers)
  }

  static async create (request, response) {
    const result = validateFollower(request.body)

    if (!result.success) {
      return response.status(400).json({ error: result.error })
    }

    const { follower_id: followerId, following_id: followingId } = result.data
    const newFollower = await FollowersModel.create({ followerId, followingId })

    response.status(201).json(newFollower)
  }

  static async delete (request, response) {
    const result = validateFollower(request.body)

    if (!result.success) {
      return response.status(400).json({ error: result.error })
    }

    const { follower_id: followerId, following_id: followingId } = result.data
    const successful = await FollowersModel.delete({ followerId, followingId })

    response.status(201).json(successful)
  }

  static async getUserFollowers (request, response) {
    const { userId } = request.params
    const userFollowers = await FollowersModel.getUserFollowers({ userId })

    response.status(201).json(userFollowers)
  }
}
