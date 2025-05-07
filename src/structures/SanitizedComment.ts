import { LikeModel } from '../models/LikeModel.js'
import { UserModel } from '../models/UserModel.js'
import { Comment } from '../schemas/CommentSchema.js'
import { SanitizedUser } from './SanitizedUser.js'

export class SanitizedComment {
  public user: Omit<SanitizedUser, 'created_at' | 'description'>
  public post_id: number
  public content: string
  public id: number
  public created_at: string
  public likes: number

  constructor (props: {
    user: Omit<SanitizedUser, 'created_at' | 'description'>
    post_id: number
    content: string
    id: number
    created_at: string
    likes: number
  }) {
    this.id = props.id
    this.likes = props.likes
    this.created_at = props.created_at
    this.content = props.content
    this.post_id = props.post_id
    this.user = props.user
  }

  static async getFromComment (comment: Comment): Promise<SanitizedComment> {
    const [user, likes] = await Promise.all([
      UserModel.getById({ id: comment.user_id }),
      LikeModel.getAmount({ targetId: comment.id!, type: 'comment' })
    ])

    const sanitizedUser = SanitizedUser.getFromUser(user!)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { description, created_at, ...simplifiedUser } = sanitizedUser

    return {
      user: simplifiedUser,
      likes,
      post_id: comment.post_id,
      content: comment.content,
      created_at: comment.created_at!,
      id: comment.id!
    }
  }

  static async getFromComments (
    comments: Comment[]
  ): Promise<SanitizedComment[]> {
    return Promise.all(comments.map(comment => this.getFromComment(comment)))
  }
}
