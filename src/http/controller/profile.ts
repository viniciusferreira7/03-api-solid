import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case'
import { makeGetUserProfileUseCase } from '@/use-cases/factories/make-use-profile-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const profileBodySchema = z.object({
    userId: z.string(),
  })

  const { userId } = profileBodySchema.parse(request.body)

  const getUserProfileUseCase = makeGetUserProfileUseCase()

  try {
    await getUserProfileUseCase.execute({ userId })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message })
    }

    throw err
  }

  return reply.status(200).send()
}
