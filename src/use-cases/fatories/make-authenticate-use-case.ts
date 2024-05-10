import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

import { AuthenticateUseCase } from '../authenticate'

export function makeAuthenticate() {
  const userRepository = new PrismaUsersRepository()
  const useCase = new AuthenticateUseCase(userRepository)

  return useCase
}
