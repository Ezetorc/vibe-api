import { Follower } from '../schemas/follower.schema.js';
export declare class FollowerModel {
    static getAll(): Promise<Follower[]>;
    static getUserFollowersIds(args: {
        userId: number;
    }): Promise<number[]>;
    static getUserFollowing(args: {
        userId: number;
    }): Promise<number[]>;
    static create(args: {
        followerId: number;
        followingId: number;
    }): Promise<boolean>;
    static delete(args: {
        followerId: number;
        followingId: number;
    }): Promise<boolean>;
}
