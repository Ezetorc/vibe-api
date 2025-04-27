import { Router } from 'express'
import { CommentController } from '../controllers/comment.controller.js'
import { sessionMiddleware } from '../middlewares/session.middleware.js'

export const CommentRouter = Router()

// GET
CommentRouter.get('/', CommentController.getAll)
CommentRouter.get('/post/:postId', CommentController.getOfPost)
CommentRouter.get('/post/amount/:postId', CommentController.getAmountOfPost)
CommentRouter.get('/:id', CommentController.getById)

// DELETE
CommentRouter.delete('/:id', sessionMiddleware, CommentController.delete)

// POST
CommentRouter.post('/', sessionMiddleware, CommentController.create)
