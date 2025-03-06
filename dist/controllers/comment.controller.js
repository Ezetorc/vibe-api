import { CommentModel } from '../models/comment.model.js';
import { validateComment } from '../schemas/comment.schema.js';
import { Data } from 'api-responser';
import { isString } from '../utilities/isString.js';
import { isEmpty } from '../utilities/isEmpty.js';
export class CommentController {
    static async getAll(request, response) {
        const { amount, page, postId } = request.query;
        let comments = [];
        if (postId) {
            const newComments = await CommentModel.getAllOfPost({
                postId: Number(postId)
            });
            comments = newComments;
        }
        else {
            const newComments = await CommentModel.getAll({ amount, page });
            comments = newComments;
        }
        response.json(Data.success(comments));
    }
    static async create(request, response) {
        const isNewCommentValid = validateComment(request.body);
        if (!isNewCommentValid.success) {
            response.status(400).json(Data.failure(isNewCommentValid.error));
            return;
        }
        const { post_id: postId, content, user_id: userId } = isNewCommentValid.data;
        const newComment = await CommentModel.create({
            content,
            postId,
            userId
        });
        if (!newComment) {
            response.status(404).json(Data.failure('Error during comment creation'));
        }
        else {
            response.json(Data.success(newComment));
        }
    }
    static async delete(request, response) {
        const { id } = request.query;
        if (!isString(id) || isEmpty(id)) {
            response.status(400).json(Data.failure('ID is missing'));
            return;
        }
        const deleteSuccess = await CommentModel.delete({
            commentId: Number(id)
        });
        if (deleteSuccess) {
            response.json(Data.success(true));
        }
        else {
            response.status(404).json(Data.failure('Comment not found'));
        }
    }
    static async getById(request, response) {
        const { id } = request.query;
        if (!isString(id) || isEmpty(id)) {
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
