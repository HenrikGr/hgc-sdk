import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { PathLike } from 'fs'
import * as qs from 'qs'

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
 * Http response type
 */
export type HttpResponse<T> = {
  headers: object
  body: T
  status: number
}

/**
 * Default options
 */
const defaultOptions: AxiosRequestConfig = {
  timeout: 3000,
  paramsSerializer: (params: PathLike) => qs.stringify(params, { indices: false }),
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
  constructor(config: AxiosRequestConfig) {
    this.axios = axios.create({
      ...defaultOptions,
      ...config,
    })

    /**
     * Ensure we can handle the error response our self.
     * Define whether to resolve or reject the promise for a given HTTP response status code.
     * If `validateStatus` returns `true` (or is set to `null` or `undefined`), the promise
     * will be resolved; otherwise, the promise will be rejected.
     */
    this.axios.defaults.validateStatus = () => true

    /**
     * Middleware interceptor for all request
     */
    this.axios.interceptors.request.use((config: AxiosRequestConfig) => {
      //console.log('HttpClient request middleware: ', config)
      return {
        ...config,
      }
    })

    // Add a response interceptor
    this.axios.interceptors.response.use(
      function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response
      },
      function (error) {
        console.log('error: ', error.message)
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return Promise.reject(error)
      }
    )
  }

  /**
   * General request method
   * @param {string} url endpoint url
   * @param {HttpRequestOptions} options http request options
   */
  public async request<T>(url: string, options?: HttpRequestOptions): Promise<HttpResponse<T>> {
    const request: AxiosRequestConfig = {
      method: options && options.method ? options.method : HttpMethod.GET,
      url: url,
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

  /**
   * HTTP GET method
   * @param {string} url endpoint url
   * @param {HttpRequestOptions} options http request options
   */
  public async get<T>(url: string, options?: HttpRequestOptions): Promise<HttpResponse<T>> {
    const request: AxiosRequestConfig = {
      method: HttpMethod.GET,
      url: url,
      headers: options && options.headers,
    }

    const response = await this.axios(request)

    return {
      headers: response.headers,
      body: response.data as T,
      status: response.status,
    }
  }

  /**
   * HTTP DELETE method
   * @param {string} url endpoint url
   * @param {HttpRequestOptions} options http request options
   */
  public async delete<T>(url: string, options?: HttpRequestOptions): Promise<HttpResponse<T>> {
    const request: AxiosRequestConfig = {
      method: HttpMethod.DELETE,
      url: url,
      headers: options && options.headers,
    }

    const response = await this.axios(request)

    return {
      headers: response.headers,
      body: response.data as T,
      status: response.status,
    }
  }

  /**
   * HTTP POST method
   * @param {string} url endpoint url
   * @param {HttpRequestOptions} options http request options
   */
  async post<T>(url: string, options?: HttpRequestOptions): Promise<HttpResponse<T>> {
    const request: AxiosRequestConfig = {
      method: HttpMethod.POST,
      url: url,
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

  /**
   * HTTP PUT method
   * @param {string} url endpoint url
   * @param {HttpRequestOptions} options http request options
   */
  async put<T>(url: string, options?: HttpRequestOptions): Promise<HttpResponse<T>> {
    const request: AxiosRequestConfig = {
      method: HttpMethod.PUT,
      url: url,
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

  /**
   * HTTP PATCH method
   * @param {string} url endpoint url
   * @param {HttpRequestOptions} options http request options
   */
  async patch<T>(url: string, options?: HttpRequestOptions): Promise<HttpResponse<T>> {
    const request: AxiosRequestConfig = {
      method: HttpMethod.PATCH,
      url: url,
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
