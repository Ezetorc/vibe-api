import { CommentRouter } from './src/routers/comment.router'
import { FollowerRouter } from './src/routers/follower.router'
import { PostRouter } from './src/routers/posts.router'
import { UserRouter } from './src/routers/user.router'
import corsMiddleware from 'cors'
import cookieMiddleware from 'cookie-parser'
import express, { Application, json as jsonMiddleware } from 'express'
import { PORT } from './src/settings'
import { LikeRouter } from './src/routers/like.router'

const app: Application = express()

app.disable('x-powered-by')
app.use(cookieMiddleware())
app.use(corsMiddleware({ origin: 'http://localhost:8888', credentials: true }))
app.use(jsonMiddleware())
app.use('/users', UserRouter)
app.use('/posts', PostRouter)
app.use('/likes', LikeRouter)
app.use('/followers', FollowerRouter)
app.use('/comment', CommentRouter)

app.listen(PORT, () =>
  console.log(`Vibe API listening on port http://localhost:${PORT}/`)
)
