import { PostModel } from '../models/post.model.js';
import { validatePartialPost, validatePost } from '../schemas/post.schema.js';
import { Data } from "../structures/Data.js";
export class PostController {
    static async getAll(request, response) {
        const { amount, page } = request.query;
        const posts = await PostModel.getAll({ amount, page });
        response.json(Data.success(posts));
    }
    static async getById(request, response) {
        const { id } = request.query;
        if (!id) {
            response.status(400).json(Data.failure('ID is missing'));
            return;
        }
        const post = await PostModel.getById({ id: Number(id) });
        if (post) {
            response.json(Data.success(post));
        }
        else {
            response.json(Data.failure('Post not found'));
        }
    }
    static async search(request, response) {
        const { query, userId } = request.query;
        if (!query) {
            response.status(400).json(Data.failure('Query is missing'));
            return;
        }
        const posts = await PostModel.search({ query: String(query), userId });
        response.json(Data.success(posts));
    }
    static async create(request, response) {
        const result = validatePost(request.body);
        if (!result.success) {
            response.status(400).json(Data.failure(result.error.toString()));
            return;
        }
        const { user_id: userId, content } = result.data;
        const createSuccess = await PostModel.create({ userId, content });
        if (createSuccess) {
            response.status(201).json(Data.success(true));
        }
        else {
            response.status(404).json(Data.failure("Error during post creation"));
        }
    }
    static async delete(request, response) {
        const { id } = request.query;
        if (!id) {
            response.status(400).json(Data.failure('ID is missing'));
            return;
        }
        const deleteSuccess = await PostModel.delete({ id: Number(id) });
        if (!deleteSuccess) {
            response.status(404).json(Data.failure('Post not found'));
        }
        else {
            response.json(Data.success(true));
        }
    }
    static async update(request, response) {
        const postValidation = validatePartialPost(request.body);
        if (!postValidation.success) {
            response
                .status(400)
                .json(Data.failure(JSON.parse(postValidation.error.message)));
            return;
        }
        const { id } = request.query;
        const updateSuccess = await PostModel.update({
            id: Number(id),
            object: postValidation.data
        });
        if (!updateSuccess) {
            response
                .status(404)
                .json(Data.failure('Post not found or no changes made'));
            return;
        }
        response.json(Data.success(true));
    }
}
