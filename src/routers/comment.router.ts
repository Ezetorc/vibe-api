import { Router } from 'express'
import { CommentController } from '../controllers/comment.controller.js'

export const CommentRouter = Router()

CommentRouter.get('/', CommentController.getAll)
CommentRouter.get('/id/:id', CommentController.getById)
CommentRouter.get('/post/:id', CommentController.getAllOfPost)

CommentRouter.delete('/id/:id', CommentController.delete)
CommentRouter.post('/', CommentController.create)
