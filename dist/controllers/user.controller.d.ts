import { Request, Response } from 'express';
export declare class UserController {
    static exists(request: Request, response: Response): Promise<void>;
    static liked(request: Request, response: Response): Promise<void>;
    static getAll(request: Request, response: Response): Promise<void>;
    static search(request: Request, response: Response): Promise<void>;
    static getById(request: Request, response: Response): Promise<void>;
    static register(request: Request, response: Response): Promise<void>;
    static login(request: Request, response: Response): Promise<void>;
    static deleteImage(request: Request, response: Response): Promise<void>;
    static delete(request: Request, response: Response): Promise<void>;
    static update(request: Request, response: Response): Promise<void>;
}
