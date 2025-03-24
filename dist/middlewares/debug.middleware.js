export function debugMiddleware(request, response, next) {
    const requestOrigin = request.headers.origin ?? request.headers.referer;
    console.log('Origin: ', requestOrigin);
    console.log('Request: ', Boolean(request));
    console.log('Response: ', Boolean(response));
    console.log('Request Headers: ', request.headers);
    next();
}
