import { Router } from 'express'
import { LikeController } from '../controllers/like.controller.js'

export const LikeRouter = Router()

LikeRouter.get('/posts', LikeController.getAllOfPosts)
LikeRouter.get('/comments', LikeController.getAllOfComments)
LikeRouter.get('/posts/id/:id', LikeController.getAllOfPost)
LikeRouter.get('/comments/id/:id', LikeController.getAllOfComment)

LikeRouter.post('/', LikeController.create)

LikeRouter.delete('/id/:id', LikeController.delete)
