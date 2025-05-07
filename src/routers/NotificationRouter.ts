import { Router } from 'express'
import { sessionMiddleware } from '../middlewares/sessionMiddleware.js'
import { NotificationController } from '../controllers/NotificationController.js'

export const NotificationRouter = Router()

// GET
NotificationRouter.get('/', NotificationController.getAll)

// POST
NotificationRouter.post('/', sessionMiddleware, NotificationController.create)
NotificationRouter.post('/seen', sessionMiddleware, NotificationController.markAsSeen)

// DELETE
NotificationRouter.delete('/', sessionMiddleware, NotificationController.delete)
