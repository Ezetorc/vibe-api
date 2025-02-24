import { Request, Response } from 'express';
export declare class UserController {
    static getAll(request: Request, response: Response): Promise<void>;
    static emailExists(request: Request, response: Response): Promise<void>;
    static nameExists(request: Request, response: Response): Promise<void>;
    static getByUsername(request: Request, response: Response): Promise<void>;
    static getById(request: Request, response: Response): Promise<void>;
    static search(request: Request, response: Response): Promise<void>;
    static register(request: Request, response: Response): Promise<void>;
    static login(request: Request, response: Response): Promise<void>;
    static logout(_request: Request, response: Response): Promise<void>;
    static delete(request: Request, response: Response): Promise<void>;
    static update(request: Request, response: Response): Promise<void>;
}
