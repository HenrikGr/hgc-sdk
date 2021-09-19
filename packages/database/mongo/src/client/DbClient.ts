/**
 * @prettier
 * @copyright (c) 2019 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { createClientLogger, ServiceLogger } from '@hgc-sdk/logger'
import { MongoClient, Db } from 'mongodb'
import { DbClientOptions } from './DbClientConfigurationReader'

/**
 * Represent a database client to connect to a specific
 * database in a Mongo Server service such as Mongo Atlas.
 */
export class DbClient {
  /**
   * The singleton DbClient instance
   * @private
   */
  private static dbClient: DbClient
  /**
   * The MongoDb client instance managing connection pools, etc
   * @private
   */
  private client: MongoClient
  /**
   * Logger service
   * @private
   */
  private logger: ServiceLogger

  /**
   * The constructor is private to prevent direct
   * construction calls with the `new` operator.
   * @ignore
   * @param client
   * @param logger
   * @private
   */
  private constructor(client: MongoClient, logger: ServiceLogger) {
    this.client = client
    this.logger = logger
  }

  /**
   * Factory method to create a DbClient singleton instance
   * @param clientOptions The client options.
   */
  public static create(clientOptions: DbClientOptions): DbClient {
    // Check if not already instantiated
    if (!DbClient.dbClient) {
      const logger = createClientLogger('DbClient')
      const client = new MongoClient(clientOptions.connectionURI, clientOptions.options)

      DbClient.dbClient = new DbClient(client, logger)
    }

    return DbClient.dbClient
  }

  /**
   * Establish a connection to Mongo server and returns a database
   *
   * Once the connection is established, it will not connect again, instead
   * it utilize the MongoClient connection pools, etc.
   * @param dbName The database name
   */
  public async connect(dbName: string): Promise<Db> {
    // If client has an established connection - return a database instance
    if (this.client.isConnected()) {
      this.logger.verbose(`connect: got database \'${dbName}\'`)
      return this.client.db(dbName)
    } else {
      // Client does not have an established connection - connect
      // to server and return the database instance
      this.logger.verbose(`connect: connect to database \'${dbName}\'`)
      const client = await this.client.connect()
      return client.db(dbName)
    }
  }

  /**
   * Disconnect the client connection to the server
   * Should be used to perform a graceful shutdown only.
   */
  public async disconnect(): Promise<void> {
    this.logger.verbose(`disconnect: close connection to database`)
    await this.client.close()
  }

  // TODO: Add a watch method to listen to changedStreams fot the connected cluster
}
