export function debugMiddleware(request, response, next) {
    console.log('Request: ', Boolean(request));
    console.log('Response: ', Boolean(response));
    console.log('Request Headers: ', request.headers);
    next();
}
