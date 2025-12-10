import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { UsuarioModel } from '../src/models/UsuarioModel.js';
import { initDatabase, closeDatabase, getDatabase } from '../src/database.js';

describe('UsuarioModel', () => {
  beforeEach(async () => {
    await initDatabase();
    const db = getDatabase();
    await db('filmes').del();
    await db('usuarios').del();
  });

  afterEach(async () => {
    await closeDatabase();
  });

  describe('criar', () => {
    it('deve criar um novo usuário', async () => {
      const usuarioId = await UsuarioModel.criar('João', 'joao@email.com', 'senha123');
      expect(usuarioId).toBeDefined();
      expect(typeof usuarioId).toBe('number');
    });

    it('não deve criar usuário com email duplicado', async () => {
      await UsuarioModel.criar('João', 'joao@email.com', 'senha123');
      
      try {
        await UsuarioModel.criar('João Silva', 'joao@email.com', 'senha456');
        expect.fail('Deveria ter lançado erro');
      } catch (erro) {
        expect(erro).toBeDefined();
      }
    });
  });

  describe('obterPorEmail', () => {
    it('deve obter usuário por email', async () => {
      await UsuarioModel.criar('João', 'joao@email.com', 'senha123');
      const usuario = await UsuarioModel.obterPorEmail('joao@email.com');
      
      expect(usuario).toBeDefined();
      expect(usuario.nome).toBe('João');
      expect(usuario.email).toBe('joao@email.com');
    });
  });

  describe('obterPorId', () => {
    it('deve obter usuário por id', async () => {
      const usuarioId = await UsuarioModel.criar('João', 'joao@email.com', 'senha123');
      const usuario = await UsuarioModel.obterPorId(usuarioId);
      
      expect(usuario).toBeDefined();
      expect(usuario.id).toBe(usuarioId);
      expect(usuario.nome).toBe('João');
    });
  });

  describe('listar', () => {
    it('deve listar todos os usuários', async () => {
      await UsuarioModel.criar('João', 'joao@email.com', 'senha123');
      await UsuarioModel.criar('Maria', 'maria@email.com', 'senha456');
      
      const usuarios = await UsuarioModel.listar();
      expect(usuarios).toHaveLength(2);
    });
  });

  describe('verificarSenha', () => {
    it('deve retornar true para senha correta', async () => {
      await UsuarioModel.criar('João', 'joao@email.com', 'senha123');
      const usuario = await UsuarioModel.obterPorEmail('joao@email.com');
      
      const senhaValida = await UsuarioModel.verificarSenha('senha123', usuario.senha);
      expect(senhaValida).toBe(true);
    });
  });

  describe('atualizar', () => {
    it('deve atualizar nome e email do usuário', async () => {
      const usuarioId = await UsuarioModel.criar('João', 'joao@email.com', 'senha123');
      
      await UsuarioModel.atualizar(usuarioId, 'João Silva', 'joaosilva@email.com');
      const usuarioAtualizado = await UsuarioModel.obterPorId(usuarioId);
      
      expect(usuarioAtualizado.nome).toBe('João Silva');
      expect(usuarioAtualizado.email).toBe('joaosilva@email.com');
    });
  });

  describe('deletar', () => {
    it('deve deletar um usuário', async () => {
      const usuarioId = await UsuarioModel.criar('João', 'joao@email.com', 'senha123');
      
      await UsuarioModel.deletar(usuarioId);
      const usuario = await UsuarioModel.obterPorId(usuarioId);
      
      expect(usuario).toBeUndefined();
    });
  });
});
