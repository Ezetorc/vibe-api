import { ALLOWED_ORIGINS } from '../settings.js';
import { Data } from '../structures/Data.js';
export function originMiddleware(request, response, next) {
    const requestOrigin = request.headers.origin;
    console.log('Im HERE: ', requestOrigin);
    console.log('omg: ', !requestOrigin || !ALLOWED_ORIGINS.includes(requestOrigin));
    if (!requestOrigin || !ALLOWED_ORIGINS.includes(requestOrigin)) {
        response.status(403).json(Data.failure('Access not authorized'));
        return;
    }
    next();
}
