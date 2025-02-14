import zod from 'zod'

const followerSchema = zod.object({
  follower_id: zod.number().nullable(false),
  following_id: zod.number().nullable(false)
})

export function validateFollower (object) {
  return followerSchema.safeParse(object)
}
