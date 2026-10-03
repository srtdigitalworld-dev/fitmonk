export class AuthService {
  /**
   * Hashes a password using PBKDF2 with SHA-256 and a random salt
   */
  static async hashPassword(password: string): Promise<{ hash: string; salt: string }> {
    const saltBytes = new Uint8Array(16);
    crypto.getRandomValues(saltBytes);
    const saltHex = Array.from(saltBytes).map(b => b.toString(16).padStart(2, '0')).join('');

    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      'PBKDF2',
      false,
      ['deriveBits']
    );

    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: saltBytes,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      256
    );

    const hashHex = Array.from(new Uint8Array(derivedBits))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    return { hash: hashHex, salt: saltHex };
  }

  /**
   * Verifies a password against the stored PBKDF2 hash and salt
   */
  static async verifyPassword(password: string, storedHash: string, storedSaltHex: string): Promise<boolean> {
    const saltBytes = new Uint8Array(storedSaltHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));

    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      'PBKDF2',
      false,
      ['deriveBits']
    );

    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: saltBytes,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      256
    );

    const hashHex = Array.from(new Uint8Array(derivedBits))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    return hashHex === storedHash;
  }

  /**
   * Generates a secure random session token and returns both token and its SHA-256 hash
   */
  static async createSessionToken(): Promise<{ token: string; tokenHash: string }> {
    const tokenBytes = new Uint8Array(32);
    crypto.getRandomValues(tokenBytes);
    const token = Array.from(tokenBytes).map(b => b.toString(16).padStart(2, '0')).join('');

    const hashBuf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
    const tokenHash = Array.from(new Uint8Array(hashBuf)).map(b => b.toString(16).padStart(2, '0')).join('');

    return { token, tokenHash };
  }

  /**
   * Hashes a presented session token for database lookup
   */
  static async hashToken(token: string): Promise<string> {
    const hashBuf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
    return Array.from(new Uint8Array(hashBuf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }
}
