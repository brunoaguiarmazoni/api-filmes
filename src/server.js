import 'dotenv/config.js';
import Fastify from 'fastify';
import FastifyJwt from '@fastify/jwt';
import FastifyCors from '@fastify/cors';
import { initDatabase, closeDatabase } from './database.js';
import { usuariosRoutes } from './routes/usuarios.js';
import { filmesRoutes } from './routes/filmes.js';

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

const app = Fastify({
  logger: true
});

// Registrar plugins
await app.register(FastifyJwt, {
  secret: JWT_SECRET
});

await app.register(FastifyCors, {
  origin: CORS_ORIGIN
});

// Inicializar banco de dados
await initDatabase();

// Registrar rotas
await app.register(usuariosRoutes);
await app.register(filmesRoutes);

// Rota de health check
app.get('/health', async (request, reply) => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Rota raiz
app.get('/', async (request, reply) => {
  return {
    mensagem: 'Bem-vindo à API de Filmes',
    versao: '1.0.0',
    documentacao: 'Veja o README.md para mais informações'
  };
});

// Tratar erros
app.setErrorHandler((error, request, reply) => {
  console.error('Erro:', error);
  reply.code(500).send({
    erro: 'Erro interno do servidor',
    mensagem: error.message
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM recebido, encerrando...');
  await closeDatabase();
  await app.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT recebido, encerrando...');
  await closeDatabase();
  await app.close();
  process.exit(0);
});

// Iniciar servidor
const start = async () => {
  try {
    await app.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();

export { app };
