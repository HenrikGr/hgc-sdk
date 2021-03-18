import crypto from 'crypto'
import { KEY_LENGTH } from './constants'

/**
 * Verify a text string against a hashed version
 * @param text The text to be verified
 * @param hash The hashed string to verify against
 * @param encoding The textual encoding to use, default = 'hex'
 */
export async function verify(
  text: string,
  hash: string,
  encoding: 'base64' | 'hex' = 'hex'
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const [salt, key] = hash.split(':')
    const keyBuffer = Buffer.from(key, encoding)

    crypto.scrypt(text, salt, KEY_LENGTH, (err, derivedKey) => {
      if (err) reject(err)
      resolve(crypto.timingSafeEqual(keyBuffer, derivedKey))
    })
  })
}
