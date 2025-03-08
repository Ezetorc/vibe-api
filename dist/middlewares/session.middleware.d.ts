import { NextFunction, Request, Response } from 'express';
import { User } from '../schemas/user.schema.js';
declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}
export declare function sessionMiddleware(request: Request, response: Response, next: NextFunction): void;
