import { BinaryLike, createHash, createHmac } from 'crypto'

/**
 * Compute a SHA-256 HMAC signature.
 * @param key - The HMAC key represented as a base64 string, used to generate the cryptographic HMAC hash.
 * @param stringToSign - The data to be signed.
 * @param encoding - The textual encoding to use for the returned HMAC digest, default='hex'
 */
export async function computeSha256Hmac(
  key: string,
  stringToSign: string,
  encoding: 'base64' | 'hex' = 'hex'
): Promise<string> {

  const decodedKey = Buffer.from(key, 'base64')
  return createHmac('sha256', decodedKey)
    .update(stringToSign)
    .digest(encoding)
}

/**
 * Computes a SHA-256 hash.
 * @param content - The data to be included in the hash.
 * @param encoding - The textual encoding to use for the returned hash, default='hex'
 */
export async function computeSha256Hash(
  content: BinaryLike,
  encoding: 'base64' | 'hex' = 'hex'
): Promise<string> {

  return createHash('sha256')
    .update(content)
    .digest(encoding)
}
