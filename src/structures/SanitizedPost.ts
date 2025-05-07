import { CommentModel } from '../models/CommentModel.js'
import { LikeModel } from '../models/LikeModel.js'
import { UserModel } from '../models/UserModel.js'
import { Post } from '../schemas/PostSchema.js'
import { SanitizedUser } from './SanitizedUser.js'

export class SanitizedPost {
  public id: Post['id']
  public user: Omit<SanitizedUser, 'created_at' | 'description'>
  public content: Post['content']
  public created_at: Post['created_at']
  public likes: number
  public comments: number

  constructor (props: {
    id: Post['id']
    user: Omit<SanitizedUser, 'created_at' | 'description'>
    content: Post['content']
    created_at: Post['created_at']
    likes: number
    comments: number
  }) {
    this.id = props.id
    this.user = props.user
    this.content = props.content
    this.created_at = props.created_at
    this.likes = props.likes
    this.comments = props.comments
  }

  static async getFromPost (post: Post): Promise<SanitizedPost> {
    const [user, comments, likes] = await Promise.all([
      UserModel.getById({ id: post.user_id }),
      CommentModel.getAmountOfPost({ postId: post.id! }),
      LikeModel.getAmount({
        type: 'post',
        targetId: post.id!
      })
    ])

    const sanitizedUser = SanitizedUser.getFromUser(user!)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { description, created_at, ...simplifiedUser } = sanitizedUser

    return {
      id: post.id,
      content: post.content,
      created_at: post.created_at,
      user: simplifiedUser,
      comments,
      likes
    }
  }

  static async getFromPosts (posts: Post[]): Promise<SanitizedPost[]> {
    return Promise.all(posts.map(post => this.getFromPost(post)))
  }
}
