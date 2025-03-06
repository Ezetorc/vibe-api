import { Request, Response } from 'express';
export declare class FollowerController {
    static getAll(request: Request, response: Response): Promise<void>;
    static create(request: Request, response: Response): Promise<void>;
    static delete(request: Request, response: Response): Promise<void>;
}
