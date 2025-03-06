import { Router } from 'express'
import { CommentController } from '../controllers/comment.controller.js'

export const CommentRouter = Router()

// GET
CommentRouter.get('/all', CommentController.getAll)
CommentRouter.get('/id', CommentController.getById)

// DELETE
CommentRouter.delete('/', CommentController.delete)

// POST
CommentRouter.post('/', CommentController.create)
