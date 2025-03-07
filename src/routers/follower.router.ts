import { Router } from 'express'
import { FollowerController } from '../controllers/follower.controller.js'

export const FollowerRouter = Router()

// GET
FollowerRouter.get('/all', FollowerController.getAll)
FollowerRouter.get('/exists', FollowerController.exists)

// POST
FollowerRouter.post('/', FollowerController.create)

// DELETE
FollowerRouter.delete('/', FollowerController.delete)
