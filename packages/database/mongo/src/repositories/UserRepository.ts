import { createClientLogger, ServiceLogger } from '@hgc-sdk/logger'
import { verifyHash } from '@hgc-sdk/crypto'
import { IBaseDao } from "../dao/BaseDao";


/**
 * User repository implementation
 */
export class UserRepository {
  private readonly collectionName: string
  protected dao: IBaseDao
  protected logger: ServiceLogger

  constructor(collectionName: string, dao: IBaseDao) {
    this.collectionName = collectionName
    this.dao = dao
    this.logger = createClientLogger('UserRepository')
  }

  /**
   * Validate user using password credential
   * @param username
   * @param password
   */
  async validateUserByPassword(username: string, password: string) {
    this.logger.verbose(`validateUserByPassword: validate credentials for \'${username}\'`)

    try {
      const filter = { username: username }
      const user = await this.dao.findOne(this.collectionName, filter)
      if (!user) {
        this.logger.verbose(`validateUserByPassword: Invalid username \'${username}\'`)
        return false
      }

      const credential = user['credentials']
      if (!credential?.password) {
        this.logger.verbose(`validateUserByPassword: Credentials are missing for \'${username}\'`)
        return false
      }

      const isValid = await verifyHash(password, credential.password)
      if (!isValid) {
        this.logger.verbose(`validateUserByPassword: Invalid password for \'${username}\'`)
        return false
      }

      this.logger.verbose(`validateUserByPassword: Successful password for \'${username}\'`)
      return true
    } catch (e) {
      this.logger.error('validateUserByPassword: ', e.name, e.message)
      throw e
    }
  }
}
