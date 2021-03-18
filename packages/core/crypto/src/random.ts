import { createHash, randomBytes } from 'crypto'

/**
 * Generates a random SHA-1 hash.
 * @param size Indication of the number of bytes to be generated, default=256
 * @param encoding The textual encoding to use for the returned hash, default='hex'
 */
export async function generateSha1Hash(
  size: number = 256,
  encoding: 'base64' | 'hex' = 'hex'
): Promise<string> {
  return createHash('sha1').update(randomBytes(size)).digest(encoding)
}

/**
 * Generates a random SHA-256 hash.
 * @param size Indication of the number of bytes to be generated, default=256
 * @param encoding - The textual encoding to use for the returned hash, default='hex'
 */
export async function generateSha256Hash(
  size: number = 256,
  encoding: 'base64' | 'hex' = 'hex'
): Promise<string> {
  return createHash('sha256').update(randomBytes(size)).digest(encoding)
}
