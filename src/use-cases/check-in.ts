import { User } from '@prisma/client'
import { compare } from 'bcryptjs'

import { CheckInRepository } from '@/repositories/check-ins-repository'
import { UsersRepository } from '@/repositories/users-repository'

import { InvalidCredentialsError } from './errors/invalid-credentials-error'

interface CheckInUseCaseRequest {
  userId: string
  gymId: string
}

interface CheckInUseCaseResponse {
  user: User
}

export class CheckInUseCase {
  // eslint-disable-next-line prettier/prettier
  constructor(private checkInsRepository: CheckInRepository) { }

  async execute({
    userId,
    gymId,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const user = await this.checkInsRepository.create({
      
    })

    if (!user) {
      throw new InvalidCredentialsError()
    }

    const doesPasswordMatches = await compare(password, user.password_hash)

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError()
    }

    return { user }
  }
}
