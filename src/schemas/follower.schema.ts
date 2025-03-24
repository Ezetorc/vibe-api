import zod from 'zod'

const FollowerSchema = zod.object({
  follower_id: zod.number(),
  following_id: zod.number()
})

export type Follower = zod.infer<typeof FollowerSchema>

export function validateFollower (object: unknown) {
  return FollowerSchema.safeParse(object)
}
