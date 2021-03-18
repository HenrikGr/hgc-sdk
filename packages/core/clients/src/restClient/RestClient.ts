import { HttpClient, HttpRequestOptions, HttpResponse } from '../httpClient/HttpClient'

/**
 * Http client configuration options
 */
export type RestClientConfig = {
  baseURL: string
}

/**
 * RestClient
 */
export class RestClient {
  private readonly config: RestClientConfig
  protected httpClient: HttpClient

  /**
   * Creates a new Client instance
   * @param config
   */
  constructor(config: RestClientConfig) {
    this.config = {
      ...config,
    }

    this.httpClient = new HttpClient(this.config)
  }

  async request<T>(url: string, opts?: HttpRequestOptions) {
    // HttpRequestOptions
    const options = {}
    const response = await this.httpClient.request<T>(url, opts)

    if (response.status !== 200) {
      return this.error(response)
    }

    return this.success(response)
  }

  async get<T>(url: string, opts?: HttpRequestOptions) {
    // HttpRequestOptions
    const options = {}
    const response = await this.httpClient.get<T>(url, opts)

    if (response.status !== 200) {
      return this.error(response)
    }

    return this.success(response)
  }

  async delete<T>(url: string, opts?: HttpRequestOptions) {
    // HttpRequestOptions
    const options = {}
    const response = await this.httpClient.delete<T>(url, opts)

    if (response.status !== 200) {
      return this.error(response)
    }

    return this.success(response)
  }

  async post<T>(url: string, opts?: HttpRequestOptions) {
    // HttpRequestOptions
    const options = {}
    const response = await this.httpClient.post<T>(url, opts)

    if (response.status !== 200) {
      return this.error(response)
    }

    return this.success(response)
  }

  async put<T>(url: string, opts?: HttpRequestOptions) {
    // HttpRequestOptions
    const options = {}
    const response = await this.httpClient.put<T>(url, opts)

    if (response.status !== 200) {
      return this.error(response)
    }

    return this.success(response)
  }

  async patch<T>(url: string, opts?: HttpRequestOptions) {
    // HttpRequestOptions
    const options = {}
    const response = await this.httpClient.patch<T>(url, opts)

    if (response.status !== 200) {
      return this.error(response)
    }

    return this.success(response)
  }

  public success<T>(response: HttpResponse<T>): T {
    return response.body
  }

  private error(response: any): void {
    const { body } = response
    const { message } = body

    console.log('Error: ', message)
  }
}
