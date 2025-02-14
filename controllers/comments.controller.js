import { CommentsModel } from '../models/comments.model.js'

export class CommentsController {
  static async getAll (_request, response) {
    const allComments = await CommentsModel.getAll()

    response.json(allComments)
  }

  static async delete (request, response) {
    const { id } = request.params
    const result = await CommentsModel.delete({ commentId: id })

    if (!result) {
      return response.status(404).json({ message: 'Comment not found' })
    }

    return response.json({ message: 'Comment deleted successfully' })
  }

  static async getById (request, response) {
    const { id } = request.params
    const comment = await CommentsModel.getById({ commentId: id })

    response.json(comment)
  }

  static async getAllOfPost (request, response) {
    const { id } = request.params
    const comments = await CommentsModel.getAllOfPost({ postId: id })

    response.json(comments)
  }
}
