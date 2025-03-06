import { NODE_ENV, SECRET_KEY } from '../settings.js';
import jwt from 'jsonwebtoken';
export function getSessionCookie(user) {
    const isProduction = NODE_ENV === 'production';
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '24h' });
    const options = {
        httpOnly: false,
        sameSite: isProduction ? 'none' : 'strict',
        secure: isProduction,
        maxAge: 24 * 60 * 60 * 1000
    };
    return { token, options };
}
