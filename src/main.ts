import { CommentRouter } from './routers/comment.router.js'
import { PostRouter } from './routers/post.router.js'
import { UserRouter } from './routers/user.router.js'
import express, { Application, json as jsonMiddleware } from 'express'
import { PORT } from './settings.js'
import { LikeRouter } from './routers/like.router.js'
import { originMiddleware } from './middlewares/origin.middleware.js'
import { FollowRouter } from './routers/follow.router.js'

const app: Application = express()

app
  .disable('x-powered-by')
  .use(originMiddleware)
  .use(jsonMiddleware())
  .use('/users', UserRouter)
  .use('/posts', PostRouter)
  .use('/likes', LikeRouter)
  .use('/follows', FollowRouter)
  .use('/comments', CommentRouter)
  .listen(PORT, '0.0.0.0', () => console.log('✅ Vibe API is active'))
