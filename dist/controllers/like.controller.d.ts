import { Request, Response } from 'express';
export declare class LikeController {
    static getAll(request: Request, response: Response): Promise<void>;
    static getCount(request: Request, response: Response): Promise<void>;
    static create(request: Request, response: Response): Promise<void>;
    static delete(request: Request, response: Response): Promise<void>;
}
