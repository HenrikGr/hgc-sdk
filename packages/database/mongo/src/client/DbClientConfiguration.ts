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
 * Default client configuration
 */
const defaultOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  poolSize: 5,
  loggerLevel: 'error',
}

/**
 * DbClient configuration options
 */
export interface DbConnectionOptions {
  connectionURI: string
  options: MongoClientOptions
}

export interface DbClientOptions {
  username: string
  password: string
  host: string
  authSource: string
  options: MongoClientOptions
}


/**
 * Implements configuration logic for a DbClient
 */
export class DbClientConfiguration {
  /**
   * Build connectionURI
   * @param username
   * @param password
   * @param host
   * @param authSource
   * @private
   */
  private static buildURI(
    username: string,
    password: string,
    host: string,
    authSource: string
  ) {
    return `mongodb+srv://${username}:${password}@${host}?authSource=${authSource}&replicaSet=Cluster0-shard-0&w=majority&readPreference=primary&retryWrites=true&ssl=true`
  }

  /**
   * Build connection options
   * @param options
   * @private
   */
  private static buildOptions(options?: MongoClientOptions): MongoClientOptions {
    return {
      ...defaultOptions,
      ...options,
    }
  }

  /**
   * Create DbClientOptions for a specific database
   * @param clientOpts
   */
  public static create(clientOpts?: DbClientOptions): DbConnectionOptions {
    const username = clientOpts?.username ? clientOpts.username : process.env.DB_USERNAME
    const password = clientOpts?.password ? clientOpts.password : process.env.DB_PASSWORD
    const host = clientOpts?.host ? clientOpts.host : process.env.DB_HOST_URI
    const authSource = process.env.DB_AUTH_SOURCE ? process.env.DB_AUTH_SOURCE : 'admin'

    if (!(username && password && host)) {
      logger.error('Could not load driver configuration from environment.')
      throw new Error('Could not load driver configuration from environment')
    }

    const connectionOpts = {
      connectionURI: this.buildURI(username, password, host, authSource),
      options: this.buildOptions(clientOpts?.options),
    }

    logger.verbose('Successfully created configurations from  .env variables.')

    return {
      ...connectionOpts
    }
  }
}
