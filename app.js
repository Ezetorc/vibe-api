import express, { json as jsonMiddleware } from 'express'
import sqlite3 from 'sqlite3'
import { PORT } from './config.js'
import corsMiddleware from 'cors'
import { usersRouter } from './routers/users.router.js'
import { postsRouter } from './routers/posts.router.js'
import { likesRouter } from './routers/likes.router.js'
import cookieMiddleware from 'cookie-parser'

const app = express()
const port = process.env.PORT || PORT
export const database = new sqlite3.Database(
  'C:/Users/ezepl/Documents/Code/Databases/vibedb.db'
)

app.use(cookieMiddleware())
app.use(
  corsMiddleware({
    origin: 'http://localhost:8888',
    credentials: true
  })
)

app.disable('x-powered-by')
app.use(jsonMiddleware())

app.use('/users', usersRouter)
app.use('/posts', postsRouter)
app.use('/likes', likesRouter)

app.listen(port, () =>
  console.log(`Vibe API listening on port http://localhost:${port}/`)
)
