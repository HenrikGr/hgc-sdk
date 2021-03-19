import crypto from 'crypto'

const KEY_LENGTH: number = 64

/**
 * Generate a hash from a text string
 * @param text The text string to be hashed
 * @param rounds The number of salt rounds, default=10
 * @param encoding The textual encoding to use for the returned hash, default = 'hex'
 */
export async function generateHash(
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

/**
 * Verify a text string against a generated hash
 * @param text The text to be verified
 * @param hash The hashed string to verify against
 * @param encoding The textual encoding to use, default = 'hex'
 */
export async function verifyHash(
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

