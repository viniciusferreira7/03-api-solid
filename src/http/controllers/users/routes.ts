import { FastifyInstance } from 'fastify'
import { register } from './register'
import { authenticate } from './authenticate'
import { profile } from './profile'
import { VerifyJWT } from '../../middleware/verify-jwt'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)

  /* Authenticated */
  app.get(
    '/me',
    {
      onRequest: [VerifyJWT],
    },
    profile,
  )
}
