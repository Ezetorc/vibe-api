export function debugMiddleware(request, response, next) {
    console.log('Origin: ', request.headers.origin);
    console.log('Referer: ', request.headers.referer);
    console.log('Request: ', Boolean(request));
    console.log('Response: ', Boolean(response));
    console.log('Request Headers: ', request.headers);
    next();
}
