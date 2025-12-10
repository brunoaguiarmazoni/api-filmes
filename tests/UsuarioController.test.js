import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { UsuarioController } from '../src/controllers/UsuarioController.js';
import { UsuarioModel } from '../src/models/UsuarioModel.js';
import { initDatabase, closeDatabase, getDatabase } from '../src/database.js';

describe('UsuarioController', () => {
  beforeEach(async () => {
    await initDatabase();
    const db = getDatabase();
    await db('filmes').del();
    await db('usuarios').del();
  });

  afterEach(async () => {
    await closeDatabase();
  });

  describe('registrar', () => {
    it('deve retornar erro quando dados faltam', async () => {
      const request = { body: { nome: 'João' } };
      const reply = {
        code: (c) => ({ 
          send: (data) => {
            expect(data.erro).toBe('Nome, email e senha são obrigatórios');
            return data;
          }
        })
      };

      await UsuarioController.registrar(request, reply);
    });

    it('deve retornar erro quando email já existe', async () => {
      await UsuarioModel.criar('João', 'joao@email.com', 'senha123');

      const request = { body: { nome: 'João Silva', email: 'joao@email.com', senha: 'senha456' } };
      const reply = {
        code: (c) => ({
          send: (data) => {
            expect(data.erro).toBe('Usuário com este email já existe');
            return data;
          }
        })
      };

      await UsuarioController.registrar(request, reply);
    });
  });

  describe('login', () => {
    it('deve retornar erro para email não existente', async () => {
      const request = { body: { email: 'naoexiste@email.com', senha: 'senha123' } };
      const reply = {
        code: (c) => ({
          send: (data) => {
            expect(data.erro).toBe('Credenciais inválidas');
            return data;
          }
        })
      };

      await UsuarioController.login(request, reply);
    });
  });

  describe('obterPerfil', () => {
    it('deve retornar erro quando usuário não encontrado', async () => {
      const request = { user: { id: 9999 } };
      const reply = {
        code: (c) => ({
          send: (data) => {
            expect(data.erro).toBe('Usuário não encontrado');
            return data;
          }
        })
      };

      await UsuarioController.obterPerfil(request, reply);
    });
  });
});
