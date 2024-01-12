import { FastifyInstance } from 'fastify'
import { register } from './controller/register'
import { authenticate } from './controller/authenticate'
import { profile } from './controller/profile'
import { VerifyJWT } from './middleware/verify-jwt'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/session', authenticate)

  /* Authenticated */
  app.get(
    '/me',
    {
      onRequest: [VerifyJWT],
    },
    profile,
  )
}
