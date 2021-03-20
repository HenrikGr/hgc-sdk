import { RestClient, RestClientConfig } from '../../packages/core/rest-client'

const config: RestClientConfig = {
  baseURL: 'http://localhost:5000',
}

let restClient = null

interface StatusResponse {
  body: object
}

describe('RestClient Suite', () => {
  test('RestClient call open status endpoint -> should return OK', async () => {
    const expected = {
      body: {
        message: 'OK',
      },
    }

    restClient = new RestClient(config)
    const result = await restClient.get<StatusResponse>('/status')
    expect(result).toMatchObject(expected.body)
  })

  test('RestClient call protected endpoint -> should return error object', async () => {
    const expected = {
      name: 'Conflict',
      httpCode: 409,
      message: 'The username root-user is already taken',
    }

    const requestOptions = {
      body: {
        username: 'root-user',
        password: 'Hgc9057AB',
        email: 'hgc-ab@outlook.com',
      },
    }

    try {
      restClient = new RestClient(config)
      const result = await restClient.post('/api/v1/users', requestOptions)
    } catch (error) {
      expect(error.name).toBe(expected.name)
      expect(error.httpCode).toBe(expected.httpCode)
      expect(error.message).toBe(expected.message)
    }
  })
})
