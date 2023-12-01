import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { FetchUserCheckInsUseCase } from './fetch-user-check-ins-history'

let checkInRepository: InMemoryCheckInsRepository
let sut: FetchUserCheckInsUseCase

describe('Fetch User Check Ins History Use Case', () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository()
    sut = new FetchUserCheckInsUseCase(checkInRepository)

    vi.useFakeTimers()

    afterEach(() => {
      vi.useRealTimers()
    })
  })

  it('should be able to fetch history', async () => {
    await checkInRepository.create({
      user_id: 'userId-01',
      gym_id: 'gymId-01',
    })

    await checkInRepository.create({
      user_id: 'userId-01',
      gym_id: 'gymId-02',
    })

    const { checkIns } = await sut.execute({
      userId: 'userId-01',
      page: 1,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gymId-01' }),
      expect.objectContaining({ gym_id: 'gymId-02' }),
    ])
  })

  it('should be able to fetch paginated user check-in history', async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInRepository.create({
        user_id: 'userId-01',
        gym_id: `gymId-${i}`,
      })
    }

    const { checkIns } = await sut.execute({
      userId: 'userId-01',
      page: 2,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gymId-21' }),
      expect.objectContaining({ gym_id: 'gymId-22' }),
    ])
  })
})
