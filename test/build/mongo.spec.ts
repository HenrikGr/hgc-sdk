
require('dotenv').config()

import {
  DbClient,
  DbClientConfiguration,
  DbConnectionOptions,
  BaseDao,
  IBaseDao,
  UserRepository
} from '../../packages/database/mongo'

describe('MongoDb Build Suite', () => {

  describe('DbClient Unit Tests', () => {
    let connectionOpts: DbConnectionOptions
    beforeAll(() => {
      connectionOpts = DbClientConfiguration.create()
    })

    describe('DbClient instance', () => {
      it('create multiple clients -> should return the same client', () => {
        const dbClient1 = DbClient.create(connectionOpts)
        const dbClient2 = DbClient.create(connectionOpts)
        expect(dbClient1).toStrictEqual(dbClient2)
      })
    })

    describe('DbClient operations', () => {
      let dbClient: DbClient
      beforeAll(() => {
        dbClient = DbClient.create(connectionOpts)
      })

      it('connect multiple times to same databases -> should return the same database', async () => {
        const db1 = await dbClient.connect('UserDb')
        const db2 = await dbClient.connect('UserDb')

        expect(db1).toStrictEqual(db2)
        expect(db1.databaseName).toEqual('UserDb')
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

  describe('UserRepository', () => {
    let connectionOpts: DbConnectionOptions
    let dbClient: DbClient
    let dao: IBaseDao
    beforeAll(() => {
      connectionOpts = DbClientConfiguration.create()
      dbClient = DbClient.create(connectionOpts)
      dao = new BaseDao('UserDb', dbClient)
    })

    afterAll(async () => {
      await dbClient.disconnect()
    })

    test('Validate correct credentials', async () => {
      expect.assertions(1)

      const model = new UserRepository('accounts', dao)
      const isValid = await model.validateUserByPassword('root-user', 'Hgc9057AB')
      expect(isValid).toBeTruthy()
    })

    test('Validate invalid credentials', async () => {
      expect.assertions(1)

      const model = new UserRepository('accounts', dao)
      const isValid = await model.validateUserByPassword('root', 'Hgc9057AB')
      expect(isValid).toBeFalsy()
    })
  })

})
