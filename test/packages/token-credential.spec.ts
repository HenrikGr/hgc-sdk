import { TokenCredential, GetTokenOptions, AccessToken } from '../../packages/core/client/src/auth'

/* This is an example token credential that uses a token value directly. Ordinarily, clients should use a
 * TokenCredential provided by the user when the client is created. Users should use DefaultAzureCredential
 * from @azure/identity unless they have specific authentication needs.
 */
class TestTokenCredential implements TokenCredential {
  public token: string
  public expiresOn: number

  constructor(token: string, expiresOn?: Date) {
    this.token = token
    this.expiresOn = expiresOn ? expiresOn.getTime() : Date.now() + 60 * 60 * 1000
  }

  async getToken(_scopes: string | string[], _options?: GetTokenOptions): Promise<AccessToken | null> {
    return {
      token: this.token,
      expiresOnTimestamp: this.expiresOn,
    }
  }
}
