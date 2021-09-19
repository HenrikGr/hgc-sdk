/**
 * @prettier
 * @copyright (c) 2019 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { MongoClientOptions } from 'mongodb'
import { createClientLogger } from '@hgc-sdk/logger'
const logger = createClientLogger('DbClientConfiguration')

/**
 * DbClient options to override default settings
 */
export interface DbClientOptions {
  /**
   * Connection URI
   */
  connectionURI: string
  /**
   * Options to be used when connecting to database
   */
  options: MongoClientOptions
}

/**
 * Reads configurations for the database client
 */
export class DbClientConfigurationReader {
  /**
   * @ignore
   * @private
   */
  private constructor() {}

  /**
   * Build a connectionURI to be used by the DbClient.
   * @ignore
   * @param username The username
   * @param password The password
   * @param host The cluster host
   * @param authSource The authentication source
   * @private
   */
  private static buildConnectionURI(
    username: string,
    password: string,
    host: string,
    authSource: string
  ): string {
    return `mongodb+srv://${username}:${password}@${host}?authSource=${authSource}&w=majority&retryWrites=true&ssl=true`
  }

  /**
   * Factory method to create the DbConnectionOptions object to
   * use when creating a DbClient instance.
   *
   * By default it reads settings from environment variables named;
   * - DB_USERNAME
   * - DB_PASSWORD
   * - DB_HOST_URI
   * - DB_AUTH_SOURCE (optional, default 'admin')
   *
   * @param clientOpts Optional settings to override default environment variable names
   */
  public static create(clientOpts?: DbClientOptions): DbClientOptions {
    const username = process.env.DB_USERNAME
    const password = process.env.DB_PASSWORD
    const host = process.env.DB_HOST_URI
    const authSource = process.env.DB_AUTH_SOURCE ? process.env.DB_AUTH_SOURCE : 'admin'

    const defaultMongoClientOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      poolSize: 5,
      loggerLevel: 'error',
    }

    if (!(username && password && host)) {
      logger.error('Could not load driver configuration from environment.')
      throw new Error('Could not load driver configuration from environment')
    }

    const dbClientOptions = {
      connectionURI: this.buildConnectionURI(username, password, host, authSource),
      options: defaultMongoClientOptions,
    }

    logger.verbose('Successfully created configurations from  .env variables.')
    return dbClientOptions
  }
}
