import express, { json as jsonMiddleware } from 'express'
import sqlite3 from 'sqlite3'
import { PORT } from './config.js'
import corsMiddleware from 'cors'
import { usersRouter } from './routers/users.router.js'
import { postsRouter } from './routers/posts.router.js'
import { likesRouter } from './routers/likes.router.js'
import cookieMiddleware from 'cookie-parser'
import { followersRouter } from './routers/followers.router.js'

const app = express()
const port = process.env.PORT || PORT
export const database = new sqlite3.Database(
  'C:/Users/ezepl/Documents/Code/Databases/vibedb.db',
  error => {
    if (error) {
      console.error('Connection error: ', error)
    } else {
      console.log('Connection successful')
      database.run('PRAGMA foreign_keys = ON')
    }
  }
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
app.use('/followers', followersRouter)

app.listen(port, () =>
  console.log(`Vibe API listening on port http://localhost:${port}/`)
)
