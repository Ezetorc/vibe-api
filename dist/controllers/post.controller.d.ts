import { Request, Response } from 'express';
export declare class PostController {
    static getCount(request: Request, response: Response): Promise<void>;
    static getAll(request: Request, response: Response): Promise<void>;
    static getById(request: Request, response: Response): Promise<void>;
    static search(request: Request, response: Response): Promise<void>;
    static create(request: Request, response: Response): Promise<void>;
    static delete(request: Request, response: Response): Promise<void>;
}
