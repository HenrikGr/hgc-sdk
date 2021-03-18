/**
 * Represents a credential capable of providing an authentication token.
 */
export interface TokenCredential {
  /**
   * Gets the token provided by this credential.
   *
   * @param scopes - The list of scopes for which the token will have access.
   * @param options - The options used to configure any requests this
   *                TokenCredential implementation might make.
   */
  getToken(scopes: string | string[], options?: GetTokenOptions): Promise<AccessToken | null>
}

/**
 * Defines options for TokenCredential.getToken.
 */
export interface GetTokenOptions {
  /**
   * Options used when creating and sending HTTP requests for this operation.
   */
  requestOptions?: {
    /**
     * The number of milliseconds a request can take before automatically being terminated.
     */
    timeout?: number
  }
}

/**
 * Represents an access token with an expiration time.
 */
export interface AccessToken {
  /**
   * The access token returned by the authentication service.
   */
  token: string

  /**
   * The access token's expiration timestamp in milliseconds, UNIX epoch time.
   */
  expiresOnTimestamp: number
}

/**
 * Tests an object to determine whether it implements TokenCredential.
 *
 * @param credential - The assumed TokenCredential to be tested.
 */
export function isTokenCredential(credential: unknown): credential is TokenCredential {
  // Check for an object with a 'getToken' function and possibly with.
  const castCredential = credential as {
    getToken: unknown
  }
  return castCredential && typeof castCredential.getToken === 'function' && castCredential.getToken.length > 0
}
