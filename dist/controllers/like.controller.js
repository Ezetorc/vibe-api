import { LikeModel } from '../models/like.model.js';
import { validateLike } from '../schemas/like.schema.js';
export class LikeController {
    static async getAllOfPost(request, response) {
        const { id } = request.params;
        const likes = await LikeModel.getAllOfPost({ postId: Number(id) });
        response.json(likes);
    }
    static async getAllOfComment(request, response) {
        const { id } = request.params;
        const likes = await LikeModel.getAllOfComment({
            commentId: Number(id)
        });
        response.json(likes);
    }
    static async getAllOfPosts(_request, response) {
        const likes = await LikeModel.getAllOfPosts();
        response.json(likes);
    }
    static async getAllOfComments(_request, response) {
        const likes = await LikeModel.getAllOfComments();
        response.json(likes);
    }
    static async create(request, response) {
        const isNewLikeValid = validateLike(request.body);
        if (!isNewLikeValid.success) {
            response.status(400).json({ error: isNewLikeValid.error });
            return;
        }
        const { target_id: targetId, type, user_id: userId } = isNewLikeValid.data;
        const newLikeCreated = await LikeModel.create({
            targetId,
            type,
            userId
        });
        if (!newLikeCreated) {
            response.status(404).json({ message: 'Error while creating like' });
            return;
        }
        response.json({ message: 'Like created successfully' });
    }
    static async delete(request, response) {
        const { id } = request.params;
        const likeDeleted = await LikeModel.delete({ id: Number(id) });
        if (!likeDeleted) {
            response.status(404).json({ message: 'Like not found' });
            return;
        }
        response.json({ message: 'Like deleted successfully' });
    }
}
