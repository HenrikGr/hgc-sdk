import { RestClient, RestClientConfig, BadRequest } from '../packages/core/rest-client'

const config = {
  withCredentials: true,
  baseURL: 'http://localhost:5000',
}

let restClient = null

interface StatusResponse {
  body: object
}

describe('RestClient Suite', () => {
  test('RestClient call open status endpoint -> should return OK', async () => {
    const expected = {
      status: 200,
      body: {
        message: 'OK',
      },
    }

    restClient = new RestClient(config)
    const result = await restClient.get<StatusResponse>('/status')

    expect(result).toMatchObject(expected.body)
    console.log('result: ', result)
  })

  test('RestClient call protected endpoint -> should return error object', async () => {
    const expected = {
      status: 409,
      body: {
        message: 'The username root-user is already taken',
      },
    }

    const requestOptions = {
      body: {
        username: 'root-user',
        password: 'Hgc9057AB',
        email: 'hgc-ab@outlook.com',
      },
    }

    restClient = new RestClient(config)
    restClient.post('/api/v1/users', requestOptions).catch((error) => {
      expect(error.status).toBe(409)
      expect(error.body).toMatchObject(expected.body)
    })
  })
})
