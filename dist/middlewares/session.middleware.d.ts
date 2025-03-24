import { NextFunction, Request, Response } from 'express';
declare module 'express-serve-static-core' {
    interface Request {
        userId?: number;
    }
}
export declare function sessionMiddleware(request: Request, response: Response, next: NextFunction): void;
