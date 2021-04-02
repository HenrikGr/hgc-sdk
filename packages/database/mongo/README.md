# @hgc-sdk/mongo-db

The package contains features to create a database client and use that to create a BaseDao object providing
your application with base functionality to access a mongo database.

## Key Concepts
You need to first create the DatabaseClient instance, and configure it properly. The DBClientConfiguration
class is used to create connection options needed to instantiate the DbClient. The DbConnectionConfiguration
reading by default settings from environment variables but can be overridden. The default environment
variables are;

- process.env.DB_USERNAME, 
- process.env.DB_PASSWORD, and
- process.env.DB_HOST_URI

After you have created your dbClient instance, you can create a baseDao instance from the BaseDao class.

## Examples - Create your dbClient instance.

```typescript
// dbClient.ts
import { DbClient, DbConnectionConfiguration } from "@hgc-sdk/mongo-db"

// Use this to override defaults
const myClientConfig = {
  username: '<username>',
  password: '<password>',
  host: '<host>',
  authSource: '<auth-source>',
  options: MongoClientOptions // Otions for a mongo, such as sizePool, useNewUrlParser, ...
}

// Create a connection options object
const connectionOptions = DbConnectionConfiguration.create("<here you can override defaults>")

// Create the db client instance.
const dbClient = DbClient.create(connectionOptions)

```

## Examples - Create your baseDao instance.

```typescript
// baseDao.ts
import { BaseDao, DaoConfig } from "@hgc-sdk/mongo-db"
import { dbClient } from "dbClient.ts"

const daoConfig = {
  useTimeStamps: true // Ensure tha createAt or updatedAt fields are added
}

const baseDao = baseDao.create('<database-name>', dbclient, daoConfig)

```


### DbClient API
The DbClient is implemented as a singleton and utilizes the native MongoClient connection pools etc.



### BaseDao API

