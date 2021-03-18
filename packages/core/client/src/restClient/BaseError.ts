/**
 * HTTP Status codes
 */
export enum HttpStatusCode {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  GONE = 410,
  INTERNAL_SERVER = 500,
}

/**
 * BaseError class
 */
class BaseError extends Error {
  public readonly name: string
  public readonly httpCode: HttpStatusCode
  public readonly isOperational: boolean

  /**
   * Create a new BaseError instance
   * @param {string} name
   * @param {string} message
   * @param {HttpStatusCode} httpCode
   * @param {boolean} isOperational
   */
  constructor(message: string, name: string, httpCode: HttpStatusCode, isOperational: boolean) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)

    this.name = name
    this.httpCode = httpCode
    this.isOperational = isOperational

    Error.captureStackTrace(this)
  }
}

/**
 *
 */
export class Unauthorized extends BaseError {
  constructor(message: string) {
    super('Unauthorized', message, 401, false)
  }
}

export class BadRequest extends BaseError {
  constructor(message: string) {
    super('BadRequest', message, 400, false)
  }
}
