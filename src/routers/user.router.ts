import { Router } from 'express'
import { UserController } from '../controllers/user.controller.js'
import { sessionMiddleware } from '../middlewares/session.middleware.js'

export const UserRouter = Router()

// GET
UserRouter.get('/all', UserController.getAll)
UserRouter.get('/search', UserController.search)
UserRouter.get('/id', UserController.getById)
UserRouter.get('/name', UserController.getByName)
UserRouter.get('/email', UserController.getByEmail)
UserRouter.get('/liked', UserController.liked)

// POST
UserRouter.post('/register', UserController.register)
UserRouter.post('/login', UserController.login)
UserRouter.post('/logout', sessionMiddleware, UserController.logout)
UserRouter.post('/image', UserController.deleteImage)

// DELETE
UserRouter.delete('/', sessionMiddleware, UserController.delete)

// PATCH
UserRouter.patch('/', sessionMiddleware, UserController.update)
