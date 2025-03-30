export function debugMiddleware(request, response, next) {
    console.log('⚠️ Request Headers: ', request.headers);
    console.log('⚠️ Request Method: ', request.method);
    next();
}
