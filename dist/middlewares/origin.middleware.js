import { ALLOWED_ORIGINS } from '../settings.js';
import { Data } from '../structures/Data.js';
export function originMiddleware(request, response, next) {
    const requestOrigin = request.headers.origin ?? request.headers.referer;
    if (!requestOrigin) {
        console.warn('⚠️  No origin detected, add "referer" or "origin" header');
        response.status(400).json(Data.failure('Missing origin'));
        return;
    }
    if (!ALLOWED_ORIGINS.includes(requestOrigin)) {
        response.status(403).json(Data.failure('Access not authorized'));
        console.log('ALLOWED_ORIGINS: ', ALLOWED_ORIGINS);
        console.log('requestOrigin: ', requestOrigin);
        console.log('Access not authorized');
        console.log('request.method: ', request.method);
        return;
    }
    response.setHeader('Access-Control-Allow-Origin', requestOrigin);
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.setHeader('Access-Control-Allow-Credentials', 'true');
    if (request.method === 'OPTIONS') {
        console.log('options null');
        response.status(204).end();
        return;
    }
    console.log('next?:  next()');
    next();
}
