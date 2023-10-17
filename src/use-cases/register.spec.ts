import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { compare } from 'bcryptjs'
import { describe, expect, it } from 'vitest'
import { RegisterUseCase } from './register'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

describe('Register Use Case', () => {
  it('should be able to register', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUseCase.execute({
      name: 'Vinicius',
      email: 'vinicius@gmail.com',
      password: '123',
    })

    expect(user.id).toEqual(expect.any(String))
  })
  it('should hash user password upon register', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUseCase.execute({
      name: 'Vinicius',
      email: 'vinicius@gmail.com',
      password: '123',
    })

    const isPasswordCorrectlyHashed = await compare('123', user.password_hash)

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const email = 'vinicius@gmail.com'

    await registerUseCase.execute({
      name: 'Vinicius',
      email,
      password: '123',
    })

    await expect(() =>
      registerUseCase.execute({
        name: 'Vinicius',
        email,
        password: '123',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
