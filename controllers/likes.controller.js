import { LikesModel } from '../models/likes.model.js'
import { validateLike } from '../schemas/like.schema.js'

export class LikesController {
  static async getAll (_request, response) {
    const likes = await LikesModel.getAll()
    return response.json(likes)
  }

  static async like (request, response) {
    const result = validateLike(request.body)

    if (!result.success) {
      return response.status(400).json({ error: result.error })
    }

    const { post_id: postId, user_id: userId } = result.data
    const newLike = await LikesModel.like({ postId, userId })

    response.status(201).json(newLike)
  }

  static async unlike (request, response) {
    const { id } = request.params
    const result = LikesModel.unlike({ id })

    if (result === 0) {
      return response.status(404).json({ message: 'Like not found' })
    }

    return response.json({ message: 'Like deleted successfully' })
  }
}
