import path from 'path';
import dotenv from 'dotenv';

const envFiles = ['.env.local', '.env'];

envFiles.forEach((file) => {
  dotenv.config({
    path: path.resolve(process.cwd(), file),
    override: false,
  });
});

const DEFAULT_PORT = Number(process.env.API_PORT ?? process.env.PORT ?? 4000);
const DEFAULT_PREFIX = process.env.API_PREFIX ?? '/api';

const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
  : ['*'];

export const env = {
  port: DEFAULT_PORT,
  apiPrefix: DEFAULT_PREFIX.startsWith('/') ? DEFAULT_PREFIX : `/${DEFAULT_PREFIX}`,
  corsOrigins,
  googleClientId: process.env.GOOGLE_CLIENT_ID ?? '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
  jwtSecret: process.env.JWT_SECRET ?? 'pulsepad-dev-secret',
};

if (!env.googleClientId || !env.googleClientSecret) {
  console.warn('Google OAuth environment variables are not fully configured. Login will fail until they are set.');
}

