import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify()
    console.log(request.user.sub)
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message })
    }

    throw err
  }

  return reply.status(200).send()
}
