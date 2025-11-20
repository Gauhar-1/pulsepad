import './config/env';
import app from './app';
import { env } from './config/env';
import { seedDatabase } from './seed';

seedDatabase().catch((error) => {
  console.error('Database seeding failed:', error);
});

const server = app.listen(env.port, () => {
  console.log(`API server listening on port ${env.port}`);
});

process.on('SIGTERM', () => server.close());
process.on('SIGINT', () => server.close());

