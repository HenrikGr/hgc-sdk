import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  AxiosBasicCredentials,
  AxiosProxyConfig,
  CancelToken,
} from 'axios'

import { HttpClientConfig, createClientConfig } from './HttpClientConfig'

/**
 * HTTP methods
 */
export enum HttpMethod {
  GET = 'get',
  DELETE = 'delete',
  POST = 'post',
  PUT = 'put',
  PATCH = 'patch',
}

/**
 * Http request options
 */
export type HttpRequestOptions = {
  method?: HttpMethod
  params?: object
  headers?: object
  body?: object
}

/**
 * Http response
 */
export interface HttpResponse<T = any> {
  headers: object
  body: T
  status: number
}

/**
 * Implementation of an http client providing
 * standard http methods using axios.
 */
export class HttpClient {
  protected axios: AxiosInstance

  /**
   * Create a new HttpClient instance
   * @param config
   */
  constructor(config: HttpClientConfig) {
    const clientConfig = createClientConfig(config)
    if (!clientConfig.baseURL) {
      throw new Error('HttpClientConfig: Must contain a baseURL attribute')
    }

    this.axios = axios.create(createClientConfig(clientConfig))

    /**
     * Ensure we are not throwing errors
     *
     * Define whether to resolve or reject the promise for a given HTTP response status code.
     * If `validateStatus` returns `true` (or is set to `null` or `undefined`), the promise
     * will be resolved; otherwise, the promise will be rejected.
     */
    this.axios.defaults.validateStatus = () => true

    /**
     * Middleware interceptor for all request
     */
    this.axios.interceptors.request.use(this.requestHandler)

    /**
     * Response middleware interceptor
     */
    this.axios.interceptors.response.use(this.successHandler, this.errorHandler)
  }

  /**
   * Success response handler to be used for managing responses
   * Note: it is not used If we allow axios to throw errors
   * @param response
   * @protected
   */
  public successHandler(response: AxiosResponse) {
    return response
  }

  /**
   * Error response handler if we let axios throw errors
   * @param error
   * @protected
   */
  public errorHandler(error: AxiosError) {
    return error
  }

  /**
   * Request middleware which can be used to intercept request
   * before they are sent.
   * @param config
   */
  public requestHandler(config: AxiosRequestConfig) {
    return {
      ...config,
    }
  }

  /**
   * General request method
   * @param {string} url endpoint url
   * @param {HttpRequestOptions} options http request options
   */
  public async request<T>(url: string, options?: HttpRequestOptions): Promise<HttpResponse<T>> {
    const request = {
      url: url,
      method: options && options.method ? options.method : HttpMethod.GET,
      data: (options && options.body) || '',
      headers: options && options.headers,
    }

    const response = await this.axios(request)

    return {
      headers: response.headers,
      body: response.data as T,
      status: response.status,
    }
  }
}
