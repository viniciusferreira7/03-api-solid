import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

import { CheckInUseCase } from './check-in'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumbersOfCheckInsError } from './errors/max-numbers-of-check-ins-error'

let checkInsRepository: InMemoryCheckInRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-in use case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    vi.useFakeTimers()

    await gymsRepository.create({
      id: 'gym-01',
      title: 'Typescript Gym',
      description: 'Build different types of muscles',
      phone: '',
      latitude: 53.927271,
      longitude: -97.8214474,
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check-in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 53.927271,
      userLongitude: -97.8214474,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check-in twice in the same day', async () => {
    vi.setSystemTime(new Date(2000, 0, 5, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 53.927271,
      userLongitude: -97.8214474,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: 53.927271,
        userLongitude: -97.8214474,
      }),
    ).rejects.toBeInstanceOf(MaxNumbersOfCheckInsError)
  })

  it('should be able to check-in twice, but in different days', async () => {
    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 53.927271,
      userLongitude: -97.8214474,
    })

    vi.setSystemTime(new Date(2000, 0, 5, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 53.927271,
      userLongitude: -97.8214474,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check-in on distant gym', async () => {
    await gymsRepository.create({
      id: 'gym-02',
      title: 'Typescript Gym',
      description: 'Build different types of muscles',
      phone: '',
      latitude: 46.7840189,
      longitude: -103.2189639,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: 53.927271,
        userLongitude: -97.8214474,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
