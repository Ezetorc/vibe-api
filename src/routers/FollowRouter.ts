import { Router } from 'express'
import { FollowController } from '../controllers/FollowController.js'
import { sessionMiddleware } from '../middlewares/sessionMiddleware.js'

export const FollowRouter = Router()

// GET
FollowRouter.get('/id', sessionMiddleware, FollowController.getFollowersIds)
FollowRouter.get('/count', FollowController.getAmount)
FollowRouter.get('/exists', FollowController.exists)

// POST
FollowRouter.post('/:followingId', sessionMiddleware, FollowController.create)

// DELETE
FollowRouter.delete('/:followingId', sessionMiddleware, FollowController.delete)
