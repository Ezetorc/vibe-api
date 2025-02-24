const jsonwebtoken = await import('jsonwebtoken');
const { verify } = jsonwebtoken.default;
import { SECRET_KEY } from '../settings.js';
export async function tokenMiddleware(request, response, next) {
    const codedToken = request.cookies?.access_token;
    if (!codedToken) {
        response.status(401).json({ message: 'Access token is missing' });
        return;
    }
    try {
        const decodedToken = verify(codedToken, SECRET_KEY);
        if (!decodedToken.user) {
            throw new Error('Invalid token structure');
        }
        request.user = decodedToken.user;
        next();
    }
    catch (error) {
        response.status(403).json({ message: 'Invalid or expired token' });
    }
}
