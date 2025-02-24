import { PostModel } from '../models/post.model.js';
import { validatePartialPost, validatePost } from '../schemas/post.schema.js';
export class PostController {
    static async getAll(request, response) {
        const { amount, page } = request.query;
        const posts = await PostModel.getAll({ amount, page });
        response.json(posts);
    }
    static async getById(request, response) {
        const { id } = request.params;
        const post = await PostModel.getById({ id: Number(id) });
        response.json(post);
    }
    static async search(request, response) {
        const { query } = request.params;
        const { userId } = request.query;
        if (!query || query.trim() === '') {
            response.status(400).json({ error: 'Query parameter is required' });
            return;
        }
        const posts = await PostModel.search({ query, userId });
        response.json(posts);
    }
    static async create(request, response) {
        const result = validatePost(request.body);
        if (!result.success) {
            response.status(400).json({ error: result.error });
            return;
        }
        const { user_id: userId, content } = result.data;
        const postCreation = await PostModel.create({ userId, content });
        response.status(201).json(postCreation);
    }
    static async delete(request, response) {
        const { id } = request.params;
        const postDeleted = await PostModel.delete({ id: Number(id) });
        if (!postDeleted) {
            response.status(404).json({ message: 'Post not found' });
            return;
        }
        response.json({ message: 'Post deleted successfully' });
        return;
    }
    static async update(request, response) {
        const postValidation = validatePartialPost(request.body);
        if (!postValidation.success) {
            response
                .status(400)
                .json({ error: JSON.parse(postValidation.error.message) });
            return;
        }
        const { id } = request.params;
        const postUpdate = await PostModel.update({
            id: Number(id),
            object: postValidation.data
        });
        if (!postUpdate) {
            response
                .status(404)
                .json({ message: 'Post not found or no changes made' });
            return;
        }
        response.json({ message: 'Post updated successfully' });
    }
}
