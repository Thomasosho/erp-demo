import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const getDatabaseUrl = () => {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not defined in environment variables');
  }
  return databaseUrl;
};

export const typeOrmConfig = new DataSource({
  type: 'postgres',
  url: getDatabaseUrl(), // Use Neon connection URL
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  ssl: {
    rejectUnauthorized: false, // Required for Neon's SSL connection
  },
  synchronize: false, // Keep this false in production
  logging: process.env.NODE_ENV === 'development',
  extra: {
    max: 20, // Connection pool settings
    ssl: {
      rejectUnauthorized: false,
    },
  },
});