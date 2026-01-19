import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '.env');

console.log('[env] Loading .env from:', envPath);
const result = dotenv.config({ path: envPath });
console.log('[env] dotenv result:', result.error ? `❌ ${result.error.message}` : `✅ loaded ${Object.keys(result.parsed || {}).length} vars`);
console.log('[env] DATABASE_URL:', process.env.DATABASE_URL ? `✅ présent (${process.env.DATABASE_URL.substring(0, 50)}...)` : '❌ undefined');
