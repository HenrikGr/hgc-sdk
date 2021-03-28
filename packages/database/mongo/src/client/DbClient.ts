/**
 * @prettier
 * @copyright (c) 2019 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { createClientLogger, ServiceLogger } from '@hgc-sdk/logger'
import { MongoClient, Db } from 'mongodb'
import { DbConnectionOptions } from './DbClientConfiguration'

/**
 * Implements a wrapper client for MongoClient to support connection for
 * a specific database to mongo server.
 *
 * The class is implemented as a singleton and defines the `create` method
 * that lets clients access the unique dbClient instance.
 *
 * The public connect api should be used once in your applications for one
 * database. The disconnect method is to support for cleaning up resources
 * on application shut-downs.
 */
export class DbClient {
  // The singleton
  private static dbClient: DbClient
  private client: MongoClient
  private logger: ServiceLogger

  /**
   * The constructor is private to prevent direct
   * construction calls with the `new` operator.
   */
  private constructor(client: MongoClient, logger: ServiceLogger) {
    this.client = client
    this.logger = logger
  }

  /**
   * Factory method to create a DbClient instance
   * @param connectionOptions
   */
  public static create(connectionOptions: DbConnectionOptions): DbClient {
    // Check if not already instantiated
    if (!DbClient.dbClient) {
      const logger = createClientLogger('DbClient')
      const client = new MongoClient(connectionOptions.connectionURI, connectionOptions.options)

      DbClient.dbClient = new DbClient(client, logger)
    }

    return DbClient.dbClient
  }

  /**
   * Connect and return the database
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
   * Should be used to perform a graceful shutdown ONLY
   */
  public async disconnect(): Promise<void> {
    this.logger.verbose(`disconnect: close connection to database`)
    await this.client.close()
  }
}
