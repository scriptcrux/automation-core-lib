export class CryptoEngine {
  /**
   * Simple base64 decoding helper for basic string protection layers
   */
  static decodeSecret(encodedString: string): string {
    return Buffer.from(encodedString, 'base64').toString('utf-8');
  }
}
