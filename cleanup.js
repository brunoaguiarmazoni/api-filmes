#!/usr/bin/env node

import { readdirSync, unlinkSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

try {
  const dataDir = path.join(__dirname, 'data');
  const files = readdirSync(dataDir);
  const testFiles = files.filter(f => f.startsWith('filmes-test-') && f.endsWith('.db'));
  
  for (const file of testFiles) {
    unlinkSync(path.join(dataDir, file));
  }
  
  if (testFiles.length > 0) {
    console.log(`✅ Limpeza: ${testFiles.length} arquivo(s) de teste removido(s)`);
  } else {
    console.log('ℹ️  Nenhum arquivo de teste para limpar');
  }
} catch (err) {
  console.error('❌ Erro ao limpar arquivos de teste:', err.message);
  process.exit(1);
}
