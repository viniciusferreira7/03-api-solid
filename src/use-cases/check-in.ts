import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { CheckIn } from '@prisma/client'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { GymsRepository } from '@/repositories/gyms-repository'
import { ResourceNotFound } from './errors/resource-not-found-error'

interface CheckInUseCaseRequest {
  userId: string
  gymId: string
  userLatitude: number
  userLongitude: number
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn
}

export class CheckInUseCase {
  constructor(
    private checkInsRepository: CheckInsRepository,
    private gymsRepository: GymsRepository,
  ) {}

  async execute({
    userId,
    gymId,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId)

    if (!gym) {
      throw new ResourceNotFound()
    }

    const checkInOnSameDay = await this.checkInsRepository.findByUserOnDate(
      userId,
      new Date(),
    )

    if (checkInOnSameDay) {
      throw new Error()
    }

    const checkIn = await this.checkInsRepository.create({
      user_id: userId,
      gym_id: gymId,
    })

    if (!checkIn) {
      throw new InvalidCredentialsError()
    }

    return {
      checkIn,
    }
  }
}
