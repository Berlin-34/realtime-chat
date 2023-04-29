import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { z } from 'zod'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id: idToDeny } = z.object({ id: z.string() }).parse(body)
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response('Unauthorized')
    }

    await db.srem(`user:${session.user.id}:incoming_friend_requests`, idToDeny)

    return new Response('OK')
  } catch (error) {
    console.log(error)

    if (error instanceof z.ZodError) {
      return new Response('Invalid request payload', { status: 423 })
    }

    return new Response('Something went wrong', { status: 400 })
  }
}
