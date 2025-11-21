import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
const result = dotenv.config({ path: path.resolve(__dirname, '../../.env') });

if (result.error) {
  console.error('Error loading .env file:', result.error);
  throw new Error('Failed to load environment variables');
}

// Validate required environment variables
const requiredEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'JWT_SECRET'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

console.log('✓ Environment variables loaded successfully');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL?.substring(0, 30) + '...');
