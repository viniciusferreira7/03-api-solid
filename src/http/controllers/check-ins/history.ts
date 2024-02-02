import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'
import { makeFetchUserCheckInsUseCase } from '@/use-cases/factories/make-fetch-user-check-ins-history-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const checkInHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { page } = checkInHistoryQuerySchema.parse(request.query)

  try {
    const fetchUserCheckIn = makeFetchUserCheckInsUseCase()

    const { checkIns } = await fetchUserCheckIn.execute({
      userId: request.user.sub,
      page,
    })
    return reply.status(200).send({ checkIns })
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(404).send({ message: err.message })
    }

    throw err
  }
}
