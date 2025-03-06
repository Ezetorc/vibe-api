const jsonwebtoken = await import('jsonwebtoken');
const { verify } = jsonwebtoken.default;
import { SECRET_KEY } from '../settings.js';
import { Data } from '../structures/Data.js';
export async function sessionMiddleware(request, response, next) {
    const codedSessionCookie = request.cookies?.session;
    if (!codedSessionCookie) {
        response.status(401).json(Data.failure('Session Cookie is missing'));
        return;
    }
    try {
        const decodedSessionCookie = verify(codedSessionCookie, SECRET_KEY);
        if (!decodedSessionCookie.user) {
            response.status(400).json(Data.failure('Invalid cookie structure'));
            return;
        }
        request.user = decodedSessionCookie.user;
        next();
    }
    catch (error) {
        response.status(403).json(Data.failure('Invalid or expired token'));
    }
}
