import { CommentRouter } from './routers/CommentRouter.js';
import { PostRouter } from './routers/PostRouter.js';
import { UserRouter } from './routers/UserRouter.js';
import express, { json as jsonMiddleware } from 'express';
import { PORT } from './settings.js';
import { LikeRouter } from './routers/LikeRouter.js';
import { originMiddleware } from './middlewares/originMiddleware.js';
import { FollowRouter } from './routers/FollowRouter.js';
import { NotificationRouter } from './routers/NotificationRouter.js';
const app = express();
app
    .disable('x-powered-by')
    .use(originMiddleware)
    .use(jsonMiddleware())
    .use('/users', UserRouter)
    .use('/posts', PostRouter)
    .use('/likes', LikeRouter)
    .use('/follows', FollowRouter)
    .use('/comments', CommentRouter)
    .use('/notifications', NotificationRouter)
    .listen(PORT, '0.0.0.0', () => console.log('✅ Vibe API is active'));
