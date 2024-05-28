import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch nearby gyms use case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      description: 'Build different types of muscles',
      phone: '',
      latitude: 46.7840189,
      longitude: -103.2189639,
    })

    await gymsRepository.create({
      title: 'Far Gym',
      description: 'Build different types of muscles',
      phone: '',
      latitude: 47.297357,
      longitude: -101.0219031,
    })

    const { gyms } = await sut.execute({
      userLatitude: 46.7840189,
      userLongitude: -103.2189639,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
