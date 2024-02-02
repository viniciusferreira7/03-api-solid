import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'
import { makeGetUserMetricsUseCase } from '@/use-cases/factories/make-use-metrics-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
  try {
    const getUserMetricsUseCase = makeGetUserMetricsUseCase()

    const { checkInsCount } = await getUserMetricsUseCase.execute({
      userId: request.user.sub,
    })
    return reply.status(200).send({ checkInsCount })
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(404).send({ message: err.message })
    }

    throw err
  }
}
