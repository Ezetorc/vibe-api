import { API_KEYS } from '../settings.js';
export function keyMiddleware(request, response, next) {
    const apiKey = request.headers['x-api-key'];
    if (!apiKey || typeof apiKey !== 'string' || !API_KEYS.includes(apiKey)) {
        response.status(403).json({ error: 'Access denied. Invalid API key' });
        return;
    }
    next();
}
