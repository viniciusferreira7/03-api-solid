import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Nearby Gyms (e2e)', () => {
  beforeAll(async () => {
    app.ready()
  })

  afterAll(async () => {
    app.close()
  })

  it('should be able to list nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Near Gym',
        description: 'Build different types of muscles',
        phone: '',
        latitude: 46.7840189,
        longitude: -103.2189639,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Far Gym',
        description: 'Build different types of muscles',
        phone: '',
        latitude: 47.297357,
        longitude: -101.0219031,
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .set('Authorization', `Bearer ${token}`)
      .query({
        latitude: 46.7840189,
        longitude: -103.2189639,
      })
      .send()

    expect(response.statusCode).toEqual(200)

    expect(response.body.gyms).toHaveLength(1)

    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Near Gym',
        description: 'Build different types of muscles',
      }),
    ])
  })
})
