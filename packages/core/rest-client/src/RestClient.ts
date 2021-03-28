import {
  HttpClient,
  HttpClientConfig,
  HttpMethod,
  HttpRequestOptions,
  HttpResponse,
} from '@hgc-sdk/http-client'
import {
  BadRequest,
  Unauthorized,
  HttpStatusCode,
  Forbidden,
  NotFound,
  Conflict,
  Gone,
  UnexpectedError,
} from './BaseError'

/**
 * Implementation of a rest client using an HttpClient based on axios
 */
export class RestClient {
  protected httpClient: HttpClient

  /**
   * Creates a new RestClient instance
   * @param config
   */
  constructor(config: HttpClientConfig) {
    this.httpClient = new HttpClient(config)
  }

  /**
   * Generic request method
   * @param url
   * @param opts
   */
  async request(url: string, opts?: HttpRequestOptions) {
    const response: HttpResponse = await this.httpClient.request(url, opts)

    if (response.status !== HttpStatusCode.OK) {
      return this.error(response)
    }

    return this.success(response)
  }

  /**
   * GET request method
   * @param url
   * @param opts
   */
  async get(url: string, opts?: HttpRequestOptions) {
    const options = {
      ...opts,
      method: HttpMethod.GET,
    }

    return await this.request(url, options)
  }

  /**
   * DELETE request method
   * @param url
   * @param opts
   */
  async delete(url: string, opts?: HttpRequestOptions) {
    const options = {
      ...opts,
      method: HttpMethod.DELETE,
    }
    return this.request(url, options)
  }

  /**
   * POST request method
   * @param url
   * @param opts
   */
  async post(url: string, opts?: HttpRequestOptions) {
    const options = {
      ...opts,
      method: HttpMethod.POST,
    }
    return this.request(url, options)
  }

  /**
   * PUT request method
   * @param url
   * @param opts
   */
  async put(url: string, opts?: HttpRequestOptions) {
    const options = {
      ...opts,
      method: HttpMethod.PUT,
    }
    return this.request(url, options)
  }

  /**
   * PATCH request method
   * @param url
   * @param opts
   */
  async patch(url: string, opts?: HttpRequestOptions) {
    const options = {
      ...opts,
      method: HttpMethod.PATCH,
    }
    return this.request(url, options)
  }

  /**
   * Success request handler
   * @param response
   */
  public success(response: HttpResponse): HttpResponse {
    return response
  }

  /**
   * Error request handler
   * @param response
   * @private
   */
  public error(response: any): void {
    const { body } = response
    const { message } = body

    switch (response.status) {
      case HttpStatusCode.BAD_REQUEST:
        throw new BadRequest(message)
      case HttpStatusCode.UNAUTHORIZED:
        throw new Unauthorized(message)
      case HttpStatusCode.FORBIDDEN:
        throw new Forbidden(message)
      case HttpStatusCode.NOT_FOUND:
        throw new NotFound(message)
      case HttpStatusCode.CONFLICT:
        throw new Conflict(message)
      case HttpStatusCode.GONE:
        throw new Gone(message)
      default:
        throw new UnexpectedError(message)
    }
  }
}
