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
 * Default Mongo connection settings
 */
const defaultMongoClientOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  poolSize: 5,
  loggerLevel: 'error',
}

/**
 * DbClient connection options
 */
export type DbConnectionOptions = {
  /**
   * Connection string to use to connect to Mongo server
   */
  connectionURI: string
  /**
   * MongoClient options to use when connecting to Mongo server
   */
  options: MongoClientOptions
}

/**
 * DbClient options to override default settings
 */
export interface DbClientOptions {
  /**
   * The username to be used in the connectionURI
   */
  username: string
  /**
   * The password to be used in the connectionURI
   */
  password: string
  /**
   * The host top be used in the connectionURI
   */
  host: string
  /**
   * The auth source to be used in the connectionURI
   * @default 'admin
   */
  authSource: string
  /**
   * Options to be used when connecting to database
   *
   * @default {
   *   useNewUrlParser: true,
   *   useUnifiedTopology: true,
   *   poolSize: 5,
   *   loggerLevel: 'error',
   * }
   */
  options: MongoClientOptions
}

/**
 * Helper class to create configuration options for the DbClient.
 */
export class DbConnectionConfiguration {
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
   * @param host The host
   * @param authSource The authentication source
   * @private
   */
  private static buildConnectionURI(
    username: string,
    password: string,
    host: string,
    authSource: string
  ): string {
    return `mongodb+srv://${username}:${password}@${host}?authSource=${authSource}&replicaSet=Cluster0-shard-0&w=majority&readPreference=primary&retryWrites=true&ssl=true`
  }

  /**
   * Build MongoClient options
   * @ignore
   * @param options Optional settings for a connection
   * @private
   */
  private static buildConnectionOptions(options?: MongoClientOptions): MongoClientOptions {
    return {
      ...defaultMongoClientOptions,
      ...options,
    }
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
   * You can override by passing in your own optional settings {@link DbClientOptions}.
   * ```typescript
   * const options = {
   *   username: process.env.MY_USERNAME,
   *   password: process.env.MY_PW,
   *   host: process.env.DATABASE_HOST_NAME,
   *   authSource: 'testAdmin',
   *   options: {
   *     useNewUrlParser: true,
   *     poolSize: 10
   *   }
   * }
   * const connectionOpts = DbClientConfiguration.create(options)
   * ```
   * @param clientOpts Optional settings to override default environment variable names
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
      connectionURI: this.buildConnectionURI(username, password, host, authSource),
      options: this.buildConnectionOptions(clientOpts?.options),
    }

    logger.verbose('Successfully created configurations from  .env variables.')

    return {
      ...connectionOpts,
    }
  }
}
