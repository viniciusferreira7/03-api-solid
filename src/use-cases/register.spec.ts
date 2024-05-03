import { InMemoryUsersRepository } from '@/repositories/in-memory-users-repository'
import { compare } from 'bcryptjs'
import { describe, expect, it } from 'vitest'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { RegisterUseCase } from './register'

describe('Register use case', () => {
  it('should be able to register', async () => {
    const sut = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(sut)

    const { user } = await registerUseCase.execute({
      name: 'John',
      email: 'john.doe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should be able to hash password upon registration', async () => {
    const sut = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(sut)

    const password = '123456'

    const { user } = await registerUseCase.execute({
      name: 'John',
      email: 'john.doe@example.com',
      password,
    })

    const isPasswordCorrectlyHashed = await compare(
      password,
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const sut = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(sut)

    const email = 'john.doe@example.com'

    await registerUseCase.execute({
      name: 'John',
      email,
      password: '123456',
    })

    await expect(() =>
      registerUseCase.execute({
        name: 'John',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
