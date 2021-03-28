import { Method, ResponseType, AxiosBasicCredentials, AxiosProxyConfig, CancelToken } from 'axios'
import { PathLike } from 'fs'
import * as qs from 'qs'

/**
 * Http client configurations
 */
export type HttpClientConfig = {
  url?: string
  method?: Method
  baseURL?: string
  headers?: any
  params?: any
  paramsSerializer?: (params: any) => string
  data?: any
  timeout?: number
  timeoutErrorMessage?: string
  withCredentials?: boolean
  auth?: AxiosBasicCredentials
  responseType?: ResponseType
  xsrfCookieName?: string
  xsrfHeaderName?: string
  onUploadProgress?: (progressEvent: any) => void
  onDownloadProgress?: (progressEvent: any) => void
  maxContentLength?: number
  validateStatus?: ((status: number) => boolean) | null
  maxBodyLength?: number
  maxRedirects?: number
  socketPath?: string | null
  httpAgent?: any
  httpsAgent?: any
  proxy?: AxiosProxyConfig | false
  cancelToken?: CancelToken
  decompress?: boolean
}

/**
 * Default client config
 */
const defaultConfig: HttpClientConfig = {
  timeout: 3000,
  paramsSerializer: (params: PathLike) => qs.stringify(params, { indices: false }),
}

/**
 * Creates configuration for the http client
 * @param config
 */
export function createClientConfig(config: HttpClientConfig) {
  return {
    ...defaultConfig,
    ...config,
  }
}
