require('dotenv').config()

import {
  DbClient,
  DbClientConfigurationReader,
  DbClientOptions,
} from '../../packages/database/mongo/src'

describe('DbClient Unit Tests', () => {
  let dbClient: DbClient
  let clientOpts: DbClientOptions

  beforeAll(() => {
    clientOpts = DbClientConfigurationReader.create()
    dbClient = DbClient.create(clientOpts)
  })

  afterAll(async () => {
    return dbClient.disconnect()
  })

  describe('DbClient singleton instance', () => {
    it('create multiple client instances -> should return the same client instance', () => {
      const dbClient1 = DbClient.create(clientOpts)
      const dbClient2 = DbClient.create(clientOpts)
      expect(dbClient1).toStrictEqual(dbClient2)
    })
  })

  describe('DbClient operations', () => {
    it('connect multiple times to same databases -> should return the same database', async () => {
      const db1 = await dbClient.connect('UserDb')
      const db2 = await dbClient.connect('UserDb')
      expect(db1).toStrictEqual(db2)
    })

    it('connect to different databases -> should return different databases', async () => {
      const db1 = await dbClient.connect('UserDb')
      const db2 = await dbClient.connect('ApplicationDB')
      const db3 = await dbClient.connect('OAuthDb')

      expect(db1).not.toStrictEqual(db2)
      expect(db1.databaseName).toEqual('UserDb')
      expect(db2.databaseName).toEqual('ApplicationDB')
      expect(db3.databaseName).toEqual('OAuthDb')
    })
  })
})
