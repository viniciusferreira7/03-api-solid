import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app'
import { createAnAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Create (e2e)', async () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be to create a gym', async () => {
    const { token } = await createAnAuthenticateUser(app)

    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Typescript gym',
        description: 'Create muscle type',
        phone: '11999999999',
        latitude: 45.8304795,
        longitude: -78.7981423,
      })

    expect(response.statusCode).toEqual(201)
  })
})
