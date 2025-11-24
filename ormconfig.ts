import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config(); 

const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432;

const config: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST, // Should be 'postgres_db' in Docker
  port,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  
  // Important paths for CLI
  entities: [process.env.NODE_ENV === 'production' ? 'dist/**/*.entity.js' : 'src/**/*.entity.ts'],
  migrations: [process.env.NODE_ENV === 'production' ? 'dist/migrations/*.js' : 'src/migrations/*.ts'],
  
  
  
  
  // Enable logging for debugging SQL queries
  logging: true, 
  synchronize: false, // ALWAYS false for production/migrations
};

export default config;