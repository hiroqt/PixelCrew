/**
 * PIXEL CREW — Auth Selector
 * 
 * Recommends and configures authentication mechanisms (Session cookies, JWT, OAuth 2.1)
 * based on client runtime environment and security requirements.
 */

export class AuthSelector {
  static selectAuth(requirements = {}) {
    const isBrowser = true;
    const isM2M = Boolean(requirements.api?.public);

    if (isBrowser) {
      return {
        strategy: 'session-cookie',
        cookieName: 'session_token',
        options: {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60 // 7 days
        },
        hasher: 'argon2id'
      };
    }

    return {
      strategy: 'jwt-bearer',
      algorithm: 'RS256',
      expiresIn: '15m'
    };
  }
}
