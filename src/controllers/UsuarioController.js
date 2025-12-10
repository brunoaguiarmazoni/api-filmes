import { UsuarioModel } from '../models/UsuarioModel.js';
import { app } from '../server.js';

export class UsuarioController {
  static async registrar(request, reply) {
    try {
      const { nome, email, senha } = request.body;

      // Validar campos obrigatórios
      if (!nome || !email || !senha) {
        return reply.code(400).send({ 
          erro: 'Nome, email e senha são obrigatórios' 
        });
      }

      // Verificar se usuário já existe
      const usuarioExistente = await UsuarioModel.obterPorEmail(email);
      if (usuarioExistente) {
        return reply.code(409).send({ 
          erro: 'Usuário com este email já existe' 
        });
      }

      const usuarioId = await UsuarioModel.criar(nome, email, senha);
      const usuario = await UsuarioModel.obterPorId(usuarioId);

      return reply.code(201).send({
        mensagem: 'Usuário criado com sucesso',
        usuario
      });
    } catch (erro) {
      console.error('Erro ao registrar usuário:', erro);
      return reply.code(500).send({ 
        erro: 'Erro ao registrar usuário' 
      });
    }
  }

  static async login(request, reply) {
    try {
      const { email, senha } = request.body;

      if (!email || !senha) {
        return reply.code(400).send({ 
          erro: 'Email e senha são obrigatórios' 
        });
      }

      const usuario = await UsuarioModel.obterPorEmail(email);
      if (!usuario) {
        return reply.code(401).send({ 
          erro: 'Credenciais inválidas' 
        });
      }

      const senhaValida = await UsuarioModel.verificarSenha(senha, usuario.senha);
      if (!senhaValida) {
        return reply.code(401).send({ 
          erro: 'Credenciais inválidas' 
        });
      }

      // Gerar token JWT com expiração de 20 minutos
      const token = app.jwt.sign(
        {
          id: usuario.id,
          email: usuario.email
        },
        { expiresIn: '20m' }
      );

      return reply.send({
        mensagem: 'Login realizado com sucesso',
        token,
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email
        }
      });
    } catch (erro) {
      console.error('Erro ao fazer login:', erro.message || erro);
      console.error('Stack:', erro.stack);
      return reply.code(500).send({ 
        erro: 'Erro ao fazer login',
        debug: erro.message
      });
    }
  }

  static async obterPerfil(request, reply) {
    try {
      const usuario = await UsuarioModel.obterPorId(request.user.id);
      
      if (!usuario) {
        return reply.code(404).send({ 
          erro: 'Usuário não encontrado' 
        });
      }

      return reply.send(usuario);
    } catch (erro) {
      console.error('Erro ao obter perfil:', erro);
      return reply.code(500).send({ 
        erro: 'Erro ao obter perfil' 
      });
    }
  }

  static async listar(request, reply) {
    try {
      const usuarios = await UsuarioModel.listar();
      return reply.send({
        total: usuarios.length,
        usuarios
      });
    } catch (erro) {
      console.error('Erro ao listar usuários:', erro);
      return reply.code(500).send({ 
        erro: 'Erro ao listar usuários' 
      });
    }
  }

  static async atualizar(request, reply) {
    try {
      const { id } = request.params;
      const { nome, email } = request.body;

      if (!nome || !email) {
        return reply.code(400).send({ 
          erro: 'Nome e email são obrigatórios' 
        });
      }

      // Verificar se é o próprio usuário ou admin
      if (request.user.id !== parseInt(id)) {
        return reply.code(403).send({ 
          erro: 'Você não tem permissão para atualizar este usuário' 
        });
      }

      const usuario = await UsuarioModel.obterPorId(id);
      if (!usuario) {
        return reply.code(404).send({ 
          erro: 'Usuário não encontrado' 
        });
      }

      await UsuarioModel.atualizar(id, nome, email);
      const usuarioAtualizado = await UsuarioModel.obterPorId(id);

      return reply.send({
        mensagem: 'Usuário atualizado com sucesso',
        usuario: usuarioAtualizado
      });
    } catch (erro) {
      console.error('Erro ao atualizar usuário:', erro);
      return reply.code(500).send({ 
        erro: 'Erro ao atualizar usuário' 
      });
    }
  }

  static async deletar(request, reply) {
    try {
      const { id } = request.params;

      // Verificar se é o próprio usuário ou admin
      if (request.user.id !== parseInt(id)) {
        return reply.code(403).send({ 
          erro: 'Você não tem permissão para deletar este usuário' 
        });
      }

      const usuario = await UsuarioModel.obterPorId(id);
      if (!usuario) {
        return reply.code(404).send({ 
          erro: 'Usuário não encontrado' 
        });
      }

      await UsuarioModel.deletar(id);

      return reply.send({
        mensagem: 'Usuário deletado com sucesso'
      });
    } catch (erro) {
      console.error('Erro ao deletar usuário:', erro);
      return reply.code(500).send({ 
        erro: 'Erro ao deletar usuário' 
      });
    }
  }
}
