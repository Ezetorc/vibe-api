import { Router } from 'express'
import { PostController } from '../controllers/post.controller.js'
import { sessionMiddleware } from '../middlewares/session.middleware.js'

export const PostRouter = Router()

// GET
PostRouter.get('/', PostController.getAll)
PostRouter.get('/count', PostController.getCount)
PostRouter.get('/search/:query', PostController.search)
PostRouter.get('/:id', PostController.getById)

// POST
PostRouter.post('/', sessionMiddleware, PostController.create)

// DELETE
PostRouter.delete('/:id', sessionMiddleware, PostController.delete)
