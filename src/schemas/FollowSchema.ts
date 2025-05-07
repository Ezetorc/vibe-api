import zod from 'zod'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FollowSchema = zod.object({
  follower_id: zod.number(),
  following_id: zod.number()
})

export type Follow = zod.infer<typeof FollowSchema>