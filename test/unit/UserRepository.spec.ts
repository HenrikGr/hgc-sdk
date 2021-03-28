require('dotenv').config()

import { DbClient, DbClientConfiguration, DbConnectionOptions } from '../../packages/database/mongo/src'
import { UserRepository } from '../../packages/database/mongo/src'
import { BaseDao, IBaseDao } from "../../packages/database/mongo/src";

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
