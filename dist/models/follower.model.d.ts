import { Follower } from '../schemas/follower.schema.js';
export declare class FollowerModel {
    static getAll(): Promise<Follower[]>;
    static getUserFollowers(args: {
        userId: number;
    }): Promise<Follower[]>;
    static create(args: {
        followerId: number;
        followingId: number;
    }): Promise<boolean>;
    static delete(args: {
        followerId: number;
        followingId: number;
    }): Promise<boolean>;
    static exists(args: {
        followerId: number;
        followingId: number;
    }): Promise<boolean>;
}
