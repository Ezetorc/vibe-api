import { Router } from 'express'
import { UserController } from '../controllers/UserController.js'
import { sessionMiddleware } from '../middlewares/sessionMiddleware.js'

export const UserRouter = Router()

// GET
UserRouter.get('/', UserController.getAll)
UserRouter.get('/search/:query', UserController.search)
UserRouter.get('/exists', UserController.exists)
UserRouter.get('/:id', UserController.getById)
UserRouter.get('/:id/liked', UserController.liked)

// POST
UserRouter.post('/register', UserController.register)
UserRouter.post('/login', UserController.login)

// PATCH
UserRouter.patch('/', sessionMiddleware, UserController.update)

// DELETE
UserRouter.delete('/', sessionMiddleware, UserController.delete)
UserRouter.delete('/image/:publicId', sessionMiddleware, UserController.deleteImage)
