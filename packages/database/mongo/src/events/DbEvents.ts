import { IBaseDao } from '../dao/BaseDao'
import { ChangeEvent, ChangeStream } from 'mongodb'

type SubscriberFn = {
  (data: object): void
}

/**
 * Database event broker class
 */
class DbEvent {
  private observers: SubscriberFn[] = []
  private changeStream: ChangeStream | undefined
  private dao: IBaseDao

  constructor(dao: IBaseDao) {
    this.dao = dao
  }

  /**
   * Serializer function that serialize change event data for insert, update and delete
   * @param change
   * @returns {{document: *, collection, time: *, operation: *, db: *}|boolean}
   */
  parseChangeEvent(change: any) {
    const { operationType, ns, documentKey, fullDocument, clusterTime } = change
    let opResult = {}

    switch (operationType) {
      case 'insert':
        opResult = {
          operation: operationType,
          db: ns.db,
          collection: ns.coll,
          document: fullDocument,
          time: clusterTime,
        }
        break
      case 'update':
        opResult = {
          operation: operationType,
          db: ns.db,
          collection: ns.coll,
          document: fullDocument,
          time: clusterTime,
        }
        break
      case 'delete':
        opResult = {
          operation: operationType,
          db: ns.db,
          collection: ns.coll,
          document: documentKey,
          time: clusterTime,
        }
        break
      default:
        opResult = false
        break
    }

    return opResult
  }

  /**
   * Subscribe to change events
   * @param fn
   * @returns {Promise<void>}
   */
  async subscribe(fn: SubscriberFn) {
    this.observers.push(fn)

    if (!this.changeStream) {
      const collection = await this.dao.getCollection('accounts')
      this.changeStream = collection.watch({ fullDocument: 'updateLookup' })

      // Listener for change events
      this.changeStream.on('change', (change) => {
        let data = this.parseChangeEvent(change)
        if (data) {
          this.notifyAll(data)
        }
      })
    }
  }

  /**
   * Unsubscribe for events
   * @param fn
   */
  unsubscribe(fn: SubscriberFn) {
    this.observers = this.observers.filter((item) => item !== fn)
  }

  /**
   * Notify all subscribers on change event
   * @param data
   */
  notifyAll(data: object) {
    this.observers.forEach((observer) => observer(data))
  }
}

module.exports = DbEvent
