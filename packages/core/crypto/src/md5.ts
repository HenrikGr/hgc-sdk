import { BinaryLike, createHash } from 'crypto'

/**
 * Compute a MD5 hash.
 * @param content The data to be included in the hash.
 * @param encoding The textual encoding to use for the returned hash, default='hex'
 */
export async function computeMD5Hash(
  content: BinaryLike,
  encoding: 'base64' | 'hex' = 'hex'
): Promise<string> {
  return createHash('md5').update(content).digest(encoding)
}
