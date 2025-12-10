import knex from 'knex';
import knexfile from '../knexfile.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let db = null;

function getKnexConfig() {
  const isTest = process.env.NODE_ENV === 'test' || process.argv.some(arg => arg.includes('vitest'));
  
  const config = { ...knexfile };
  
  if (isTest) {
    const testDbPath = path.join(__dirname, '..', 'data', `filmes-test-${Date.now()}.db`);
    config.connection.filename = testDbPath;
  }
  
  return config;
}

export async function initDatabase() {
  if (db) return db;

  db = knex(getKnexConfig());

  // Executar migrations
  try {
    await db.migrate.latest();
    console.log('✅ Migrations executadas com sucesso');
  } catch (erro) {
    console.error('❌ Erro ao executar migrations:', erro);
    throw erro;
  }

  return db;
}

export function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
}

export async function closeDatabase() {
  if (db) {
    await db.destroy();
    db = null;
  }
}
