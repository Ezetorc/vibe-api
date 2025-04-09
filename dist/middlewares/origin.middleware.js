import { ALLOWED_ORIGINS } from '../settings.js';
import { Data } from '../structures/Data.js';
export function originMiddleware(request, response, next) {
    const requestOrigin = request.headers.origin ?? request.headers.referer;
    if (!requestOrigin) {
        response
            .status(400)
            .json(Data.failure('⚠️  No origin detected, add "referer" or "origin" header'));
        return;
    }
    if (!ALLOWED_ORIGINS.includes(requestOrigin)) {
        response.status(403).json(Data.failure('Access not authorized'));
        return;
    }
    response.setHeader('Access-Control-Allow-Origin', requestOrigin);
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.setHeader('Access-Control-Allow-Credentials', 'true');
    if (request.method === 'OPTIONS') {
        response.status(204).end();
        return;
    }
    next();
}
