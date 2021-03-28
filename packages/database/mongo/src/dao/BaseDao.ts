import { DbClient } from '../client/DbClient'
import { Db, Cursor, Collection, CollectionCreateOptions, FilterQuery } from 'mongodb'

export interface IBaseDao {
  getCollection(collectionName: string): Promise<Collection<any>>
  count(collectionName: string, query?: FilterQuery<any>, options?: object): Promise<number>
  find(collectionName: string, query: FilterQuery<any>, options?: object): Promise<Cursor<any>>
  findOne(collectionName: string, query: FilterQuery<any>, options?: object): Promise<any>
  insertOne(collectionName: string, document: object, options?: object): Promise<number>
  insertMany(collectionName: string, documents: any[], options?: object): Promise<number>
  updateOne(collectionName: string, filter: FilterQuery<any>, document: object, options?: object): Promise<number>
  updateMany(collectionName: string, filter: FilterQuery<any>, documents: object, options?: object): Promise<number>
  deleteOne(collectionName: string, filter: FilterQuery<any>, options?: object): Promise<boolean>
  deleteMany(collectionName: string, filter: FilterQuery<any>, options?: object): Promise<boolean>
  createCollection(collectionName: string, options?: CollectionCreateOptions): Promise<false | Collection<any>>
  deleteCollection(collectionName: string): Promise<boolean>
}

/**
 * Class that implements a wrapper to provide basic DAO logic
 */
export class BaseDao {
  private readonly dbName: string
  private dbClient: DbClient

  /**
   * Creates a new DataAccessObject
   * @param dbName
   * @param dbClient
   */
  constructor(dbName: string, dbClient: DbClient) {
    this.dbName = dbName
    this.dbClient = dbClient
  }

  private async getDatabase(): Promise<Db> {
    return this.dbClient.connect(this.dbName)
  }

  public async getCollection(collectionName: string): Promise<Collection<any>> {
    const db = await this.dbClient.connect(this.dbName)
    return db.collection(collectionName)
  }

  public async count(collectionName: string, query?: FilterQuery<any>, options?: object): Promise<number> {
    try {
      const collection = await this.getCollection(collectionName)
      return collection.estimatedDocumentCount(query, options)
    } catch (e) {
      throw e
    }
  }

  async find(collectionName: string, query: FilterQuery<any>, options?: object): Promise<Cursor<any>> {
    try {
      const collection = await this.getCollection(collectionName)
      return await collection.find(query, options)
    } catch (e) {
      throw e
    }
  }

  async findOne(collectionName: string, query: FilterQuery<any>, options?: object): Promise<any> {
    try {
      const collection = await this.getCollection(collectionName)
      return await collection.findOne(query, options)
    } catch (e) {
      throw e
    }
  }

  async insertOne(collectionName: string, document: object, options?: object): Promise<number> {
    try {
      const collection = await this.getCollection(collectionName)
      const result = await collection.insertOne(document, options)
      return result.insertedCount
    } catch (e) {
      throw e
    }
  }

  async insertMany(collectionName: string, documents: any[], options?: object): Promise<number> {
    try {
      const collection = await this.getCollection(collectionName)
      const result = await collection.insertMany(documents, options)
      return result.insertedCount
    } catch (e) {
      throw e
    }
  }

  async updateOne(collectionName: string, filter: FilterQuery<any>, document: object, options?: object): Promise<number> {
    try {
      const collection = await this.getCollection(collectionName)
      const result = await collection.updateOne(filter, { $set: document }, options)
      return result.modifiedCount
    } catch (e) {
      throw e
    }
  }

  async updateMany(collectionName: string, filter: FilterQuery<any>, documents: object, options?: object): Promise<number> {
    try {
      const collection = await this.getCollection(collectionName)
      const result = await collection.updateMany(filter, { $set: documents }, options)
      return result.modifiedCount
    } catch (e) {
      throw e
    }
  }

  async deleteOne(collectionName: string, filter: FilterQuery<any>, options?: object): Promise<boolean> {
    try {
      const collection = await this.getCollection(collectionName)
      const result = await collection.deleteOne(filter, options)
      return Boolean(result.deletedCount === 1)
    } catch (e) {
      throw e
    }
  }

  async deleteMany(collectionName: string, filter: FilterQuery<any>, options?: object): Promise<boolean> {
    try {
      const collection = await this.getCollection(collectionName)
      const result = await collection.deleteMany(filter, options)
      return Boolean(result.deletedCount !== 0)
    } catch (e) {
      throw e
    }
  }

  public async createCollection(
    collectionName: string,
    options?: CollectionCreateOptions
  ): Promise<false | Collection<any>> {
    try {
      const db = await this.getDatabase()
      const collection = db.collection(collectionName)
      if (!collection) {
        return await db.createCollection(collectionName, options)
      }

      return false
    } catch (e) {
      throw e
    }
  }

  public async deleteCollection(collectionName: string): Promise<boolean> {
    try {
      const db = await this.getDatabase()
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
