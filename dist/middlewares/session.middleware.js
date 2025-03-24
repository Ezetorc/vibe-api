import jsonwebtoken from 'jsonwebtoken';
import { SECRET_KEY } from '../settings.js';
import { Data } from '../structures/Data.js';
import { UserModel } from '../models/user.model.js';
export async function sessionMiddleware(request, response, next) {
    const codedSessionCookie = request.cookies?.session;
    if (!codedSessionCookie) {
        response.status(401).json(Data.failure('Session Cookie is missing'));
        return;
    }
    try {
        const decodedSessionCookie = jsonwebtoken.verify(codedSessionCookie, SECRET_KEY);
        if (!decodedSessionCookie.user) {
            response.status(400).json(Data.failure('Invalid cookie structure'));
            return;
        }
        const user = await UserModel.getById({ id: decodedSessionCookie.user.id });
        if (!user) {
            response.clearCookie('session', { httpOnly: true, secure: true });
            response.status(404).json(Data.failure('User not found'));
            return;
        }
        request.user = user;
        next();
    }
    catch (error) {
        if (!(error instanceof Error))
            return;
        if (error.name === 'TokenExpiredError') {
            response.status(401).json(Data.failure('Session expired'));
            return;
        }
        if (error.name === 'JsonWebTokenError') {
            response.status(403).json(Data.failure('Invalid token'));
            return;
        }
        response.status(500).json(Data.failure('Internal server error'));
    }
}
