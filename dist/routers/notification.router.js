import { Router } from 'express';
import { sessionMiddleware } from '../middlewares/session.middleware.js';
import { NotificationController } from '../controllers/notification.controller.js';
export const NotificationRouter = Router();
// GET
NotificationRouter.get('/', NotificationController.getAll);
// POST
NotificationRouter.post('/', sessionMiddleware, NotificationController.create);
NotificationRouter.post('/seen', sessionMiddleware, NotificationController.markAsSeen);
// DELETE
NotificationRouter.delete('/', sessionMiddleware, NotificationController.delete);
