import { PrismaUserRepository } from '@/repositories/prisma/prisma-users-repository'
import { describe, expect, it } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'

describe('Register Use Case', () => {
  it('should hash user password upon register', async () => {
    const prismaUserRepository = new PrismaUserRepository()
    const registerUseCase = new RegisterUseCase(prismaUserRepository)

    const { user } = await registerUseCase.execute({
      name: 'Vinicius',
      email: 'vinicius@gmail.com',
      password: '123',
    })

    const isPasswordCorrectlyHashed = await compare('123', user.password_hash)

    expect(isPasswordCorrectlyHashed).toBe(true)
  })
})
