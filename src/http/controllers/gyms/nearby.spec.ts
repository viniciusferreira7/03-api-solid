import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app'
import { createAnAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Nearby Gyms (e2e)', async () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be to list nearby gyms', async () => {
    const { token } = await createAnAuthenticateUser(app)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Far gym',
        description: 'Create any muscle',
        phone: '11999999999',
        latitude: 53.9412631,
        longitude: -97.8538462,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Javascript gym',
        description: 'Create different types of muscles',
        phone: '11999999999',
        latitude: 45.8304795,
        longitude: -78.7981423,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Typescript gym',
        description: 'Create any muscle',
        phone: '11999999999',
        latitude: 45.8304795,
        longitude: -78.7981423,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Javascript gym',
        description: 'Create different types of muscles',
        phone: '11999999999',
        latitude: 45.8304795,
        longitude: -78.7981423,
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({ latitude: 45.8304795, longitude: -78.7981423 })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.status).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Typescript gym',
      }),
    ])
  })
})
