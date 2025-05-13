import { Request, Response } from 'express'
import { NotificationModel } from '../models/NotificationModel.js'
import {
  Notification,
  validateNotification
} from '../schemas/NotificationSchema.js'
import { dataFailure, dataSuccess } from '../structures/Data.js'
import { SanitizedNotification } from '../structures/SanitizedNotification.js'

export class NotificationController {
  static async getAll (request: Request, response: Response): Promise<void> {
    const { amount, page, userId } = request.query
    const notifications: Notification[] = await NotificationModel.getAll({
      amount,
      page,
      userId: Number(userId)
    })
    const sanitizedNotifications =
      await SanitizedNotification.getFromNotifications(notifications)

    response.json(dataSuccess(sanitizedNotifications))
  }

  static async hasNew (request: Request, response: Response): Promise<void> {
    const { userId } = request

    const hasNotifications = await NotificationModel.hasNew({ userId: userId! })

    response.json(dataSuccess(hasNotifications))
  }

  static async create (request: Request, response: Response): Promise<void> {
    const result = validateNotification(request.body)
    const { userId } = request

    if (
      !result.success ||
      !userId ||
      !result.data.type ||
      !result.data.target_id
    ) {
      response
        .status(400)
        .json(
          dataFailure(
            result.error?.toString() ?? 'Error during notification creation'
          )
        )
      return
    }

    const { target_id, type, data } = result.data
    const notificationCreated = await NotificationModel.create({
      senderId: userId,
      targetId: target_id,
      type,
      data
    })

    if (notificationCreated) {
      response.status(201).json(dataSuccess(true))
    } else {
      response
        .status(404)
        .json(dataFailure('Error during notification creation'))
    }
  }

  static async markAsSeen (request: Request, response: Response): Promise<void> {
    const { notificationsIds } = request.body

    const isValidArray =
      notificationsIds &&
      Array.isArray(notificationsIds) &&
      notificationsIds.every(id => typeof id === 'number')

    if (!isValidArray) {
      response
        .status(400)
        .json(dataFailure('"notificationsIds" must be an array of numbers'))
      return
    }

    const markAsSeenSuccess = await NotificationModel.markAsSeen({
      notificationsIds
    })

    if (markAsSeenSuccess) {
      response.json(dataSuccess(true))
    } else {
      response
        .status(500)
        .json(dataFailure('Error when marking notifications as seen'))
    }
  }

  static async delete (request: Request, response: Response): Promise<void> {
    const { targetId } = request.query

    if (!targetId) {
      response.status(400).json(dataFailure('Target ID is missing'))
      return
    }

    if (Number(targetId) !== request.userId) {
      response.status(401).json(dataFailure('Notification delete unauthorized'))
      return
    }

    const deleteSuccess = await NotificationModel.deleteOfUser({
      userId: Number(targetId)
    })

    if (!deleteSuccess) {
      response.status(404).json(dataFailure('Notification not found'))
    } else {
      response.json(dataSuccess(true))
    }
  }
}
