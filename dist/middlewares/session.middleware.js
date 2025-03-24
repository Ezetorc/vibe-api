import jsonwebtoken from 'jsonwebtoken';
import { SECRET_KEY } from '../settings.js';
export function sessionMiddleware(request, response, next) {
    const authorization = request.headers['authorization']?.split(' ')[1];
    if (!authorization) {
        response.status(401).json({ message: 'No token provided' });
        return;
    }
    try {
        const decoded = jsonwebtoken.verify(authorization, SECRET_KEY);
        request.userId = decoded.userId;
        next();
    }
    catch {
        response.status(403).json({ message: 'Invalid or expired token' });
    }
}
