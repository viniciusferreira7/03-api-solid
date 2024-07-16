import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

import { prisma } from '@/lib/prisma'

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  isAdmin: boolean = false,
) {
  await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: await hash('123456', 6),
      role: isAdmin ? 'ADMIN' : 'MEMBER',
    },
  })

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'john.doe@example.com',
    password: '123456',
  })

  const { token } = authResponse.body

  return { token }
}
