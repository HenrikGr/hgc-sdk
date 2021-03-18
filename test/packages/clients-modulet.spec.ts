import { HttpClient } from '../../packages/core/client/src/httpClient/HttpClient'
import { RestClient } from "../../packages/core/client/src/restClient/RestClient";

const httpConfig = {
  withCredentials: true,
  baseURL: "https://jsonplaceholder.typicode.com/",
}

const clientConfig = {
  baseURL: "https://jsonplaceholder.typicode.com/",
}

describe('Clients Package Suite', () => {

  test('HttpClient -> should return a json data', async () => {
    const httpClient = new HttpClient(httpConfig)
    const result = await httpClient.request('/todos')
    console.log('result: ', result.body)
  })

  test('RestClient -> should return json data', async () => {
    const client = new RestClient(clientConfig)
    const result = await client.request('/todos')
    console.log('result: ', result)
  })
})
