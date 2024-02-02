import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'
import { makeFetchNearbyGymsUseCase } from '@/use-cases/factories/make-fetch-nearby-gyms-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
  const nearbyGymsQuerySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
  })

  const { latitude, longitude } = nearbyGymsQuerySchema.parse(request.query)

  try {
    const nearbyGymsUseCase = makeFetchNearbyGymsUseCase()

    const { gyms } = await nearbyGymsUseCase.execute({
      userLatitude: latitude,
      userLongitude: longitude,
    })
    return reply.status(200).send({ gyms })
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(404).send({ message: err.message })
    }

    throw err
  }
}
