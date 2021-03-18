import crypto from 'crypto'
import { KEY_LENGTH } from './constants'

/**
 * Hash a text string
 * @param text The text string to be hashed
 * @param rounds The number of salt rounds, default=10
 * @param encoding The textual encoding to use for the returned hash, default = 'hex'
 */
export async function hash(
  text: string,
  rounds: number = 10,
  encoding: 'base64' | 'hex' = 'hex'
): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(rounds).toString(encoding)
    crypto.scrypt(text, salt, KEY_LENGTH, (err, derivedKey) => {
      if (err) reject(err)
      resolve(salt + ':' + derivedKey.toString(encoding))
    })
  })
}
