export const AUTH_COOKIE_NAMES = [
    'neon-auth.session_token',          // Dev / Standard
    '__Secure-neon-auth.session_token',  // Production (HTTPS)
    'neon_auth_session'                 // Legacy / Fallback
] as const;
