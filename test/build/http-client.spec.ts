import {
  HttpClient,
  HttpMethod,
  HttpClientConfig,
  HttpRequestOptions,
  HttpResponse,
} from '../../packages/core/http-client'

describe('HttpClient Build Suite', () => {
  const httpClientConfig: HttpClientConfig = {
    baseURL: 'https://example.com:5000',
  }

  let httpClient = null

  describe('HttpClient operations', () => {
    it.skip('Calls an open status endpoint -> should return OK', async () => {
      const expected = {
        status: 200,
        body: {
          message: 'OK',
        },
      }

      httpClient = new HttpClient(httpClientConfig)
      const result = await httpClient.request('/ping')
      console.log('result', result)

      expect(result.status).toBe(expected.status)
      expect(result.body).toMatchObject(expected.body)
    })

    it.skip('Calls a protected endpoint -> should return error object', async () => {
      const expected = {
        status: 409,
        body: {
          message: 'The username root-user is already taken',
        },
      }

      const requestOptions: HttpRequestOptions = {
        method: HttpMethod.POST,
        body: {
          username: 'root-user',
          password: 'Hgc9057AB',
          email: 'hgc-ab@outlook.com',
        },
      }

      httpClient = new HttpClient(httpClientConfig)
      const result: HttpResponse = await httpClient.request('/api/v1/users', requestOptions)
      expect(result.status).toBe(expected.status)
      expect(result.body).toMatchObject(expected.body)
    })
  })
})
