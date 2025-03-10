import { SECRET_KEY } from '../settings.js';
import jwt from 'jsonwebtoken';
export function getAccessToken(user) {
    const payload = {
        user: {
            id: user.id
        }
    };
    return {
        token: jwt.sign(payload, SECRET_KEY, { expiresIn: '24h' }),
        config: {
            httpOnly: false,
            sameSite: "none",
            secure: true,
            maxAge: 24 * 60 * 60 * 1000
        }
    };
}
