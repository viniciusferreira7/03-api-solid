import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Search Gyms (e2e)', () => {
 beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a gym', async () => {
    const { token } = await createAndAuthenticateUser(app)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Typescript Gym',
        description: 'Build different types of muscles',
        phone: '',
        latitude: 46.7840189,
        longitude: -103.2189639,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Javascript Gym',
        description: 'Build different any type of muscle',
        phone: '',
        latitude: 46.7840189,
        longitude: -103.2189639,
      })

    const response = await request(app.server)
      .get('/gyms/search')
      .set('Authorization', `Bearer ${token}`)
      .query({
        q: 'Typescript',
        page: 1,
      })
      .send()

    expect(response.statusCode).toEqual(200)

    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Typescript Gym',
        description: 'Build different types of muscles',
        phone: '',
      }),
    ])
  })
})
