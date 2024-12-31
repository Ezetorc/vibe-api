import express, { json as jsonMiddleware } from 'express'
import sqlite3 from 'sqlite3'
import corsMiddleware from 'cors'
import { usersRouter } from './routers/users.router.js'
import { postsRouter } from './routers/posts.router.js'
import { likesRouter } from './routers/likes.router.js'

const app = express()
const port = process.env.PORT || 3000
export const database = new sqlite3.Database(
  'C:/Users/ezepl/Documents/Databases/vibedb.db'
)

app.disable('x-powered-by')
app.use(corsMiddleware())
app.use(jsonMiddleware())
app.use('/users', usersRouter)
app.use('/posts', postsRouter)
app.use('/likes', likesRouter)

app.listen(port, () =>
  console.log(`Example app listening on port http://localhost:${port}/`)
)
