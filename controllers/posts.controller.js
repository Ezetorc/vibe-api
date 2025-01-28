import { PostsModel } from '../models/posts.model.js'
import { validatePartialPost, validatePost } from '../schemas/post.schema.js'

export class PostsController {
  static async getAll (_request, response) {
    const posts = await PostsModel.getAll()
    response.json(posts)
  }

  static async getById (request, response) {
    const { id } = request.params
    const posts = await PostsModel.getById({ id })
    response.json(posts)
  }

  static async search (request, response) {
    const { query } = request.params

    if (!query || query.trim() === '') {
      return response.status(400).json({ error: 'Query parameter is required' })
    }

    try {
      const posts = await PostsModel.search({ query })
      response.json(posts)
    } catch (error) {
      console.error('Search error:', error)
      response.status(500).json({ error: 'Internal Server Error' })
    }
  }

  static async create (request, response) {
    const result = validatePost(request.body)

    if (!result.success) {
      return response.status(400).json({ error: result.error })
    }

    const { user_id: userId, content } = result.data
    const newPost = await PostsModel.create({ userId, content })

    response.status(201).json(newPost)
  }

  static async delete (request, response) {
    const { id } = request.params
    const result = await PostsModel.delete({ id })

    if (result === 0) {
      return response.status(404).json({ message: 'Post not found' })
    }

    return response.json({ message: 'Post deleted successfully' })
  }

  static async update (request, response) {
    const result = validatePartialPost(request.body)

    if (!result.success) {
      return response
        .status(400)
        .json({ error: JSON.parse(result.error.message) })
    }

    const updatedPost = await PostsModel.update({
      id: request.params.id,
      object: result.data
    })

    if (!updatedPost || updatedPost.changes === 0) {
      return response
        .status(404)
        .json({ message: 'Post not found or no changes made' })
    }

    return response.json({ message: 'Post updated successfully', updatedPost })
  }
}
