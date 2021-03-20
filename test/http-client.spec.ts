import { HttpClient, HttpResponse, HttpRequestOptions, HttpMethod } from '../packages/core/http-client'

const httpConfig = {
  withCredentials: true,
  baseURL: 'http://localhost:5000',
}

let httpClient = null

describe('HttpClient Suite', () => {
  test('HttpClient call open status endpoint -> should return OK', async () => {
    const expected = {
      status: 200,
      body: {
        message: 'OK',
      },
    }

    httpClient = new HttpClient(httpConfig)
    const result = await httpClient.request('/status')

    expect(result.status).toBe(expected.status)
    expect(result.body).toMatchObject(expected.body)
  })

  test('HttpClient call protected endpoint (overrides GET method) -> should return error object', async () => {
    const expected = {
      status: 409,
      body: {
        message: 'The username root-user is already taken',
      },
    }

    const requestOptions = {
      method: HttpMethod.POST,
      body: {
        username: 'root-user',
        password: 'Hgc9057AB',
        email: 'hgc-ab@outlook.com',
      },
    }

    httpClient = new HttpClient(httpConfig)
    const result = await httpClient.request('/api/v1/users', requestOptions)
    expect(result.status).toBe(expected.status)
    expect(result.body).toMatchObject(expected.body)
  })

  test('HttpClient call protected endpoint -> should return error object', async () => {
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

    httpClient = new HttpClient(httpConfig)
    const result = await httpClient.post('/api/v1/users', requestOptions)
    expect(result.status).toBe(expected.status)
    expect(result.body).toMatchObject(expected.body)

  })

})
