import { LikeModel } from '../models/like.model.js';
import { validatePartialLike } from '../schemas/like.schema.js';
import { Data } from '../structures/Data.js';
export class LikeController {
    static async getAll(request, response) {
        const { type } = request.query;
        if (!type) {
            response.status(400).json(Data.failure('Type is missing'));
            return;
        }
        if (type !== 'comment' && type !== 'post') {
            response.status(400).json(Data.failure('Invalid type'));
            return;
        }
        const likes = type === 'comment'
            ? await LikeModel.getAllOfComments()
            : await LikeModel.getAllOfPosts();
        response.json(Data.success(likes));
    }
    static async getById(request, response) {
        const { id } = request.params;
        const likeId = Number(id);
        console.log('id: ', likeId);
        if (isNaN(likeId)) {
            response.status(400).json(Data.failure('Invalid ID'));
            return;
        }
        const like = await LikeModel.getById({ id: likeId });
        if (like) {
            response.json(Data.success(like));
        }
        else {
            response.status(404).json(Data.failure('Like not found'));
        }
    }
    static async getCount(request, response) {
        const { targetId, type } = request.query;
        console.log('targetId: ', targetId, type);
        if (!type) {
            response.status(400).json(Data.failure('Type is missing'));
            return;
        }
        if (type !== 'comment' && type !== 'post') {
            response.status(400).json(Data.failure('Invalid type'));
            return;
        }
        if (!targetId) {
            response.status(400).json(Data.failure('Target ID is missing'));
            return;
        }
        const likesAmount = await LikeModel.getAmount({
            targetId: Number(targetId),
            type
        });
        if (likesAmount >= 0) {
            response.json(Data.success(likesAmount));
        }
        else {
            response.json(Data.failure('Error when getting likes amount'));
        }
    }
    static async create(request, response) {
        const isNewLikeValid = validatePartialLike(request.body);
        if (!isNewLikeValid.success ||
            !isNewLikeValid.data.target_id ||
            !isNewLikeValid.data.type) {
            response.status(400).json(Data.failure('Invalid request body'));
            return;
        }
        const userId = Number(request.userId);
        const { target_id: targetId, type } = isNewLikeValid.data;
        const newLikeCreated = await LikeModel.create({
            targetId,
            type,
            userId
        });
        if (!newLikeCreated) {
            response.status(404).json(Data.failure('Error during like creation'));
            return;
        }
        response.json(Data.success(newLikeCreated));
    }
    static async delete(request, response) {
        const { id } = request.params;
        if (!id) {
            response.status(400).json(Data.failure('ID is missing'));
            return;
        }
        const likeUserId = await LikeModel.getLikeUserId({ likeId: Number(id) });
        if (likeUserId !== request.userId) {
            response.status(401).json(Data.failure('Like delete unauthorized'));
            return;
        }
        const likeDeleted = await LikeModel.delete({ id: Number(id) });
        if (!likeDeleted) {
            response.status(404).json(Data.failure('Like not found'));
            return;
        }
        response.json(Data.success(true));
    }
}
