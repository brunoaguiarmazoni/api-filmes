import { FilmeController } from '../controllers/FilmeController.js';
import { autenticacao } from '../middleware/auth.js';

export async function filmesRoutes(app) {
  // Rotas públicas
  app.get('/filmes', FilmeController.listar);
  app.get('/filmes/:id', FilmeController.obterPorId);
  app.get('/filmes/:id/avaliacoes', FilmeController.obterAvaliacoes);

  // Rotas autenticadas
  app.post('/filmes', { onRequest: autenticacao }, FilmeController.criar);
  app.put('/filmes/:id', { onRequest: autenticacao }, FilmeController.atualizar);
  app.delete('/filmes/:id', { onRequest: autenticacao }, FilmeController.deletar);
  app.post('/filmes/:id/avaliar', { onRequest: autenticacao }, FilmeController.avaliar);
}
