import { HttpClient } from '../../packages/core/clients/src/httpClient/HttpClient'
import { RestClient } from "../../packages/core/clients/src/restClient/RestClient";

const httpConfig = {
  withCredentials: true,
  baseURL: "https://jsonplaceholder.typicode.com/",
}

const clientConfig = {
  baseURL: "https://jsonplaceholder.typicode.com/",
}

describe('Clients Package Suite', () => {

  describe('HttpClient', () => {
    test('HttpClient -> should return a json data', async () => {
      const httpClient = new HttpClient(httpConfig)
      const result = await httpClient.request('/todos')
      console.log('result: ', result.body)
    })

    /**
     * TODO: Error handling
     */
  })

  describe('RestClient', () => {

    test('RestClient -> should return json data', async () => {
      const client = new RestClient(clientConfig)
      const result = await client.request('/todos')
      console.log('result: ', result)
    })


  })

})
