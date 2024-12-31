import { Router } from 'express'
import { PostsController } from '../controllers/posts.controller.js'

export const postsRouter = Router()

postsRouter.get('/', PostsController.getAll)
postsRouter.get('/:id', PostsController.getById)

postsRouter.post('/', PostsController.create)

postsRouter.delete('/:id', PostsController.delete)

postsRouter.patch('/:id', PostsController.update)
