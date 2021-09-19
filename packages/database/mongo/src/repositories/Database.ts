import { DbClient } from '../client'
import { Db, Collection, CollectionCreateOptions } from 'mongodb'

/**
 * BaseDao configuration
 */
export interface IDatabase {
  getDatabase(dbName: string): Promise<Db>
  getCollection(dbName: string, collectionName: string): Promise<Collection<any>>
  createCollection(
    dbName: string,
    collectionName: string,
    options?: CollectionCreateOptions
  ): Promise<false | Collection<any>>
  deleteCollection(dbName: string, collectionName: string): Promise<boolean>
}

/**
 * Class that implements a Database object
 */
export class Database {
  private dbClient: DbClient

  /**
   * Creates a new BaseDao instance
   * @param dbClient The database client
   */
  constructor(dbClient: DbClient) {
    this.dbClient = dbClient
  }

  /**
   * Get a database instance
   */
  private getDatabase(dbName: string): Promise<Db> {
    return this.dbClient.connect(dbName)
  }

  public async getCollection(dbName: string, collectionName: string): Promise<Collection<any>> {
    const db = await this.getDatabase(dbName)
    return db.collection(collectionName)
  }

  public async createCollection(
    dbName: string,
    collectionName: string,
    options?: CollectionCreateOptions
  ): Promise<false | Collection<any>> {
    try {
      const db = await this.getDatabase(dbName)
      const collection = db.collection(collectionName)
      if (!collection) {
        return await db.createCollection(collectionName, options)
      }

      return false
    } catch (e) {
      throw e
    }
  }

  public async deleteCollection(dbName: string, collectionName: string): Promise<boolean> {
    try {
      const db = await this.getDatabase(dbName)
      const collection = db.collection(collectionName)
      if (collection) {
        return await db.dropCollection(collectionName)
      }
      return false
    } catch (e) {
      throw e
    }
  }
}
