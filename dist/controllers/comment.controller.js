import { CommentModel } from '../models/comment.model.js';
import { validateComment } from '../schemas/comment.schema.js';
export class CommentController {
    static async getAll(request, response) {
        const { amount, page } = request.query;
        const comments = await CommentModel.getAll({ amount, page });
        response.json(comments);
    }
    static async create(request, response) {
        const isNewCommentValid = validateComment(request.body);
        if (!isNewCommentValid.success) {
            response.status(400).json(isNewCommentValid.error);
            return;
        }
        const { post_id: postId, content, user_id: userId } = isNewCommentValid.data;
        const newComment = await CommentModel.create({
            content,
            postId,
            userId
        });
        if (newComment == null) {
            response.status(404).json(null);
            return;
        }
        response.json(newComment);
    }
    static async delete(request, response) {
        const { id } = request.params;
        const commentDeleted = await CommentModel.delete({
            commentId: Number(id)
        });
        if (commentDeleted) {
            response.json({ message: 'Comment deleted successfully' });
        }
        else {
            response.status(404).json({ message: 'Comment not found' });
        }
    }
    static async getById(request, response) {
        const { id } = request.params;
        const comment = await CommentModel.getById({
            commentId: Number(id)
        });
        response.json(comment);
    }
    static async getAllOfPost(request, response) {
        const { id } = request.params;
        const comments = await CommentModel.getAllOfPost({
            postId: Number(id)
        });
        response.json(comments);
    }
}
