import '@fastify/jwt'

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: null
    user: {
      sub: string
    }
  }
}
