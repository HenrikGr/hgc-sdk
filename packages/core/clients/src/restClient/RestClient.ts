import {
  HttpClient,
  HttpRequestOptions,
  HttpResponse,
} from '../httpClient/HttpClient'
import {
  BadRequest,
  Unauthorized,
  HttpStatusCode,
  Forbidden,
  NotFound,
  Conflict,
  Gone,
  UnexpectedError
} from "./BaseError";


/**
 * Http client configuration options
 */
export type RestClientConfig = {
  baseURL: string
}

/**
 * Implementation of a rest client using an HttpClient based on axios
 */
export class RestClient {
  private readonly config: RestClientConfig
  protected httpClient: HttpClient

  constructor(config: RestClientConfig) {
    this.config = {
      ...config,
    }

    this.httpClient = new HttpClient(this.config)
  }

  /**
   * Generic request method
   * @param url
   * @param opts
   */
  async request<T>(url: string, opts?: HttpRequestOptions) {
    // HttpRequestOptions
    const options = {}
    const response = await this.httpClient.request<T>(url, opts)

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
  async get<T>(url: string, opts?: HttpRequestOptions) {
    // HttpRequestOptions
    const options = {}
    const response = await this.httpClient.get<T>(url, opts)

    if (response.status !== HttpStatusCode.OK) {
      return this.error(response)
    }

    return this.success(response)
  }

  /**
   * DELETE request method
   * @param url
   * @param opts
   */
  async delete<T>(url: string, opts?: HttpRequestOptions) {
    // HttpRequestOptions
    const options = {}
    const response = await this.httpClient.delete<T>(url, opts)

    if (response.status !== HttpStatusCode.OK) {
      return this.error(response)
    }

    return this.success(response)
  }

  /**
   * POST request method
   * @param url
   * @param opts
   */
  async post<T>(url: string, opts?: HttpRequestOptions) {
    // HttpRequestOptions
    const options = {}
    const response = await this.httpClient.post<T>(url, opts)

    if (response.status !== HttpStatusCode.OK) {
      return this.error(response)
    }

    return this.success(response)
  }

  /**
   * PUT request method
   * @param url
   * @param opts
   */
  async put<T>(url: string, opts?: HttpRequestOptions) {
    // HttpRequestOptions
    const options = {}
    const response = await this.httpClient.put<T>(url, opts)

    if (response.status !== HttpStatusCode.OK) {
      return this.error(response)
    }

    return this.success(response)
  }

  /**
   * PATCH request method
   * @param url
   * @param opts
   */
  async patch<T>(url: string, opts?: HttpRequestOptions) {
    // HttpRequestOptions
    const options = {}
    const response = await this.httpClient.patch<T>(url, opts)

    if (response.status !== HttpStatusCode.OK) {
      return this.error(response)
    }

    return this.success(response)
  }

  /**
   * Success request handler
   * @param response
   */
  public success<T>(response: HttpResponse<T>): T {
    return response.body
  }

  /**
   * Error request handler
   * @param response
   * @private
   */
  public error(response: any): void {
    const { body } = response
    const { message } = body

    switch(response.status) {
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
