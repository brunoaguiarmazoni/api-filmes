import { UsuarioController } from '../controllers/UsuarioController.js';
import { autenticacao } from '../middleware/auth.js';

export async function usuariosRoutes(app) {
  // Rotas públicas
  app.post('/auth/registrar', UsuarioController.registrar);
  app.post('/auth/login', UsuarioController.login);

  // Rotas autenticadas
  app.get('/usuarios/perfil', { onRequest: autenticacao }, UsuarioController.obterPerfil);
  app.get('/usuarios', UsuarioController.listar);
  app.put('/usuarios/:id', { onRequest: autenticacao }, UsuarioController.atualizar);
  app.delete('/usuarios/:id', { onRequest: autenticacao }, UsuarioController.deletar);
}
