import { CommentModel } from '../models/comment.model.js';
import { validatePartialComment } from '../schemas/comment.schema.js';
import { Data } from '../structures/Data.js';
export class CommentController {
    static async getAll(request, response) {
        const { amount, page } = request.query;
        const comments = await CommentModel.getAll({ amount, page });
        response.json(Data.success(comments));
    }
    static async getOfPost(request, response) {
        const { amount, page } = request.query;
        const { postId } = request.params;
        if (!postId) {
            response.status(400).json(Data.failure('Post ID param is missing'));
            return;
        }
        const comments = await CommentModel.getAllOfPost({
            postId: Number(postId),
            amount,
            page
        });
        response.json(Data.success(comments));
    }
    static async create(request, response) {
        const isNewCommentValid = validatePartialComment(request.body);
        if (!isNewCommentValid.success ||
            !isNewCommentValid.data.content ||
            !isNewCommentValid.data.post_id) {
            response.status(400).json(Data.failure('Invalid request body'));
            return;
        }
        const { post_id: postId, content } = isNewCommentValid.data;
        const newComment = await CommentModel.create({
            content,
            postId,
            userId: Number(request.userId)
        });
        if (!newComment) {
            response.status(404).json(Data.failure('Error during comment creation'));
        }
        else {
            response.json(Data.success(newComment));
        }
    }
    static async delete(request, response) {
        const { id } = request.params;
        if (!id) {
            response.status(400).json(Data.failure('ID is missing'));
            return;
        }
        const commentUserId = await CommentModel.getCommentUserId({
            commentId: Number(id)
        });
        if (commentUserId !== request.userId) {
            response.status(401).json(Data.failure('Comment delete unauthorized'));
            return;
        }
        const deletedComment = await CommentModel.delete({
            commentId: Number(id)
        });
        if (deletedComment) {
            response.json(Data.success(deletedComment));
        }
        else {
            response.status(404).json(Data.failure('Comment not found'));
        }
    }
    static async getById(request, response) {
        const { id } = request.params;
        if (!id) {
            response.status(400).json(Data.failure('ID is missing'));
            return;
        }
        const comment = await CommentModel.getById({
            commentId: Number(id)
        });
        if (comment) {
            response.json(Data.success(comment));
        }
        else {
            response.status(404).json(Data.failure('Comment not found'));
        }
    }
}
