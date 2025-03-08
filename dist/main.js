import { CommentRouter } from './routers/comment.router.js';
import { FollowerRouter } from './routers/follower.router.js';
import { PostRouter } from './routers/posts.router.js';
import { UserRouter } from './routers/user.router.js';
import corsMiddleware from 'cors';
import cookieMiddleware from 'cookie-parser';
import express, { json as jsonMiddleware } from 'express';
import { PORT } from './settings.js';
import { LikeRouter } from './routers/like.router.js';
import { keyMiddleware } from './middlewares/key.middleware.js';
const app = express();
app
    .disable('x-powered-by')
    .use(cookieMiddleware())
    .use(corsMiddleware({
    origin: 'http://localhost:8888',
    credentials: true
}))
    .use(keyMiddleware)
    .use(jsonMiddleware())
    .use('/users', UserRouter)
    .use('/posts', PostRouter)
    .use('/likes', LikeRouter)
    .use('/followers', FollowerRouter)
    .use('/comments', CommentRouter)
    .listen(PORT);
