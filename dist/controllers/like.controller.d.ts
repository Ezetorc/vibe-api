import { Request, Response } from 'express';
export declare class LikeController {
    static getAllOfPost(request: Request, response: Response): Promise<void>;
    static getAllOfComment(request: Request, response: Response): Promise<void>;
    static getAllOfPosts(_request: Request, response: Response): Promise<void>;
    static getAllOfComments(_request: Request, response: Response): Promise<void>;
    static create(request: Request, response: Response): Promise<void>;
    static delete(request: Request, response: Response): Promise<void>;
}
