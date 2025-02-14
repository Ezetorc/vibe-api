import { LikesModel } from '../models/likes.model.js'
import { validateLike } from '../schemas/like.schema.js'

export class LikesController {
  static async getAllOfPost (request, response) {
    const { id } = request.params
    const likes = await LikesModel.getAllOfPost({ postId: id })
    return response.json(likes)
  }

  static async getAllOfComment (request, response) {
    const { id } = request.params
    const likes = await LikesModel.getAllOfComment({ commentId: id })
    return response.json(likes)
  }

  static async getAllOfPosts (_request, response) {
    const likes = await LikesModel.getAllOfPosts()
    return response.json(likes)
  }

  static async getAllOfComments (_request, response) {
    const likes = await LikesModel.getAllOfComments()
    return response.json(likes)
  }

  static async create (request, response) {
    const result = validateLike(request.body)

    if (!result.success) {
      return response.status(400).json({ error: result.error })
    }

    const { target_id: targetId, type, user_id: userId } = result.data
    const newLike = await LikesModel.create({ targetId, type, userId })

    if (newLike === false) {
      return response.status(404).json({ message: 'Error while creating like' })
    }

    return response.json({ message: 'Like created successfully' })
  }

  static async delete (request, response) {
    const { id } = request.params
    const result = await LikesModel.delete({ id })

    if (result === false) {
      return response.status(404).json({ message: 'Like not found' })
    }

    return response.json({ message: 'Like deleted successfully' })
  }
}
