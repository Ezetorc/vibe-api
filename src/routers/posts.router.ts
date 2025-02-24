import { Router } from 'express'
import { PostController } from '../controllers/post.controller.js'
import { tokenMiddleware } from '../middlewares/token.middleware.js'

export const PostRouter = Router()

PostRouter.get('/', PostController.getAll)
PostRouter.get('/search/:query', PostController.search)
PostRouter.get('/id/:id', PostController.getById)

PostRouter.post('/', tokenMiddleware, PostController.create)

PostRouter.delete('/id/:id', PostController.delete)

PostRouter.patch('/id/:id', tokenMiddleware, PostController.update)
