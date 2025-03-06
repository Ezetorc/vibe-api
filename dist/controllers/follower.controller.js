import { FollowerModel } from '../models/follower.model.js';
import { validateFollower } from '../schemas/follower.schema.js';
import { Data } from '../structures/Data.js';
export class FollowerController {
    static async getAll(request, response) {
        const { userId } = request.query;
        let followers = [];
        if (userId) {
            const newFollowers = await FollowerModel.getUserFollowers({
                userId: Number(userId)
            });
            followers = newFollowers;
        }
        else {
            const newFollowers = await FollowerModel.getAll();
            followers = newFollowers;
        }
        response.status(201).json(Data.success(followers));
    }
    static async create(request, response) {
        const isNewFollowerValid = validateFollower(request.body);
        if (!isNewFollowerValid.success) {
            response
                .status(400)
                .json(Data.failure(isNewFollowerValid.error.toString()));
            return;
        }
        const { follower_id: followerId, following_id: followingId } = isNewFollowerValid.data;
        const createSuccess = await FollowerModel.create({
            followerId,
            followingId
        });
        if (createSuccess) {
            response.status(201).json(Data.success(true));
        }
        else {
            response.status(404).json(Data.failure('Error during follower creation'));
        }
    }
    static async delete(request, response) {
        const isFollowerToDeleteValid = validateFollower(request.body);
        if (!isFollowerToDeleteValid.success) {
            response
                .status(400)
                .json(Data.failure(isFollowerToDeleteValid.error.toString()));
            return;
        }
        const { follower_id: followerId, following_id: followingId } = isFollowerToDeleteValid.data;
        const deleteSuccess = await FollowerModel.delete({
            followerId,
            followingId
        });
        if (deleteSuccess) {
            response.status(201).json(Data.success(true));
        }
        else {
            response.status(404).json(Data.failure("Error during follower deleting"));
        }
    }
}
