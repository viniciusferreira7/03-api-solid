import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { GetUserMetricsUseCase } from './get-use-metrics'

let checkInRepository: InMemoryCheckInsRepository
let sut: GetUserMetricsUseCase

describe('Get User Metrics Use case', () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository()
    sut = new GetUserMetricsUseCase(checkInRepository)

    vi.useFakeTimers()

    afterEach(() => {
      vi.useRealTimers()
    })
  })

  it('should be able to get check-ins count from metrics', async () => {
    await checkInRepository.create({
      user_id: 'userId-01',
      gym_id: 'gymId-01',
    })

    await checkInRepository.create({
      user_id: 'userId-01',
      gym_id: 'gymId-02',
    })

    const { checkInsCount } = await sut.execute({
      userId: 'userId-01',
    })

    expect(checkInsCount).toEqual(2)
  })
})
