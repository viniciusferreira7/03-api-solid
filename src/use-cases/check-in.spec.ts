import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'

let checkInRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInRepository, gymsRepository)

    vi.useFakeTimers()

    gymsRepository.items.push({
      id: 'gym-01',
      title: 'Typescript gym',
      description: '',
      phone: '',
      latitude: new Decimal(0),
      longitude: new Decimal(0),
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: 53.9412631,
      userLongitude: -97.8538462,
    })

    expect(checkIn.user_id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in them same day', async () => {
    vi.setSystemTime(new Date(2023, 10, 21, 8, 0, 0))

    await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: 53.9412631,
      userLongitude: -97.8538462,
    })

    await expect(() =>
      sut.execute({
        userId: 'user-01',
        gymId: 'gym-01',
        userLatitude: 53.9412631,
        userLongitude: -97.8538462,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2023, 10, 21, 8, 0, 0))

    await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: 53.9412631,
      userLongitude: -97.8538462,
    })

    vi.setSystemTime(new Date(2023, 10, 22, 8, 0, 0))

    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: 53.9412631,
      userLongitude: -97.8538462,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
