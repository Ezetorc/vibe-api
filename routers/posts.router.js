import { Router } from 'express'
import { PostsController } from '../controllers/posts.controller.js'
import { tokenMiddleware } from '../middlewares/tokenMiddleware.js'

export const postsRouter = Router()

postsRouter.get('/', PostsController.getAll)
postsRouter.get('/search/:query', PostsController.search)
postsRouter.get('/id/:id', PostsController.getById)

postsRouter.post('/', tokenMiddleware, PostsController.create)

postsRouter.delete('/id/:id', tokenMiddleware, PostsController.delete)

postsRouter.patch('/id/:id', tokenMiddleware, PostsController.update)
