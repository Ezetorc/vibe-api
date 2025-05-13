import { UserModel } from '../models/UserModel.js'
import { Notification } from '../schemas/NotificationSchema.js'
import { SanitizedUser } from './SanitizedUser.js'

export class SanitizedNotification {
  public id: number
  public sender: Omit<SanitizedUser, 'created_at' | 'description'>
  public target_id: number
  public type: Notification['type']
  public data?: {
    post_id?: number
    comment_id?: number
  }
  public created_at: string
  public seen: boolean

  constructor (props: {
    id: number
    sender: Omit<SanitizedUser, 'created_at' | 'description'>
    target_id: number
    type: Notification['type']
    data?: {
      post_id?: number
      comment_id?: number
    }
    created_at: string
    seen: boolean
  }) {
    this.id = props.id
    this.sender = props.sender
    this.target_id = props.target_id
    this.type = props.type
    this.data = props.data
    this.created_at = props.created_at
    this.seen = props.seen
  }

  static async getFromNotification (
    notification: Notification
  ): Promise<SanitizedNotification> {
    const user = await UserModel.getById({ id: notification.sender_id })
    const sanitizedUser = SanitizedUser.getFromUser(user!)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { created_at, description, ...simplifiedUser } = sanitizedUser

    return {
      id: notification.id!,
      sender: simplifiedUser,
      target_id: notification.target_id,
      type: notification.type,
      data: notification.data!,
      created_at: notification.created_at!,
      seen: notification.seen!
    }
  }

  static async getFromNotifications (
    notifications: Notification[]
  ): Promise<SanitizedNotification[]> {
    return Promise.all(
      notifications.map(notification => this.getFromNotification(notification))
    )
  }
}
