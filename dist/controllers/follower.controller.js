import { FollowerModel } from '../models/follower.model.js';
import { validateFollower } from '../schemas/follower.schema.js';
export class FollowerController {
    static async getAll(_request, response) {
        const followers = await FollowerModel.getAll();
        response.status(201).json(followers);
    }
    static async create(request, response) {
        const isNewFollowerValid = validateFollower(request.body);
        if (!isNewFollowerValid.success) {
            response.status(400).json({ error: isNewFollowerValid.error });
            return;
        }
        const { follower_id: followerId, following_id: followingId } = isNewFollowerValid.data;
        const newFollowerCreated = await FollowerModel.create({
            followerId,
            followingId
        });
        response.status(201).json(newFollowerCreated);
    }
    static async delete(request, response) {
        const isFollowerToDeleteValid = validateFollower(request.body);
        if (!isFollowerToDeleteValid.success) {
            response.status(400).json({ error: isFollowerToDeleteValid.error });
            return;
        }
        const { follower_id: followerId, following_id: followingId } = isFollowerToDeleteValid.data;
        const followerDeleted = await FollowerModel.delete({
            followerId,
            followingId
        });
        response.status(201).json(followerDeleted);
    }
    static async getUserFollowersIds(request, response) {
        const { userId } = request.params;
        const userFollowersIds = await FollowerModel.getUserFollowersIds({
            userId: Number(userId)
        });
        response.status(201).json(userFollowersIds);
    }
}
