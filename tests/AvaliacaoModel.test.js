import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { AvaliacaoModel } from '../src/models/AvaliacaoModel.js';
import { FilmeModel } from '../src/models/FilmeModel.js';
import { UsuarioModel } from '../src/models/UsuarioModel.js';
import { initDatabase, closeDatabase, getDatabase } from '../src/database.js';

describe('AvaliacaoModel', () => {
  let usuarioId1, usuarioId2, filmeId;

  beforeEach(async () => {
    await initDatabase();
    const db = getDatabase();
    await db('avaliacoes').del();
    await db('filmes').del();
    await db('usuarios').del();
    
    usuarioId1 = await UsuarioModel.criar('João', 'joao@email.com', 'senha123');
    usuarioId2 = await UsuarioModel.criar('Maria', 'maria@email.com', 'senha456');
    filmeId = await FilmeModel.criar(
      'Homem-Aranha',
      'Um herói',
      'Jon Watts',
      2021,
      'Ação',
      usuarioId1
    );
  });

  afterEach(async () => {
    await closeDatabase();
  });

  describe('criar', () => {
    it('deve criar uma nova avaliação', async () => {
      const avaliacaoId = await AvaliacaoModel.criar(filmeId, usuarioId1, 8, 'Muito bom!');
      expect(avaliacaoId).toBeDefined();
      expect(typeof avaliacaoId).toBe('number');
    });
  });

  describe('obterPorId', () => {
    it('deve obter uma avaliação por id', async () => {
      const avaliacaoId = await AvaliacaoModel.criar(filmeId, usuarioId1, 8, 'Muito bom!');
      const avaliacao = await AvaliacaoModel.obterPorId(avaliacaoId);

      expect(avaliacao).toBeDefined();
      expect(avaliacao.id).toBe(avaliacaoId);
      expect(avaliacao.nota).toBe(8);
      expect(avaliacao.comentario).toBe('Muito bom!');
    });
  });

  describe('obterPorFilmeEUsuario', () => {
    it('deve obter avaliação por filme e usuário', async () => {
      const avaliacaoId = await AvaliacaoModel.criar(filmeId, usuarioId1, 8, 'Muito bom!');
      const avaliacao = await AvaliacaoModel.obterPorFilmeEUsuario(filmeId, usuarioId1);

      expect(avaliacao).toBeDefined();
      expect(avaliacao.id).toBe(avaliacaoId);
    });
  });

  describe('listarPorFilme', () => {
    it('deve listar todas as avaliações de um filme', async () => {
      await AvaliacaoModel.criar(filmeId, usuarioId1, 8, 'Muito bom!');
      await AvaliacaoModel.criar(filmeId, usuarioId2, 9, 'Excelente!');

      const avaliacoes = await AvaliacaoModel.listarPorFilme(filmeId);
      expect(avaliacoes).toHaveLength(2);
    });
  });

  describe('atualizar', () => {
    it('deve atualizar uma avaliação', async () => {
      const avaliacaoId = await AvaliacaoModel.criar(filmeId, usuarioId1, 8, 'Muito bom!');
      
      await AvaliacaoModel.atualizar(avaliacaoId, 9, 'Excelente!');
      const avaliacao = await AvaliacaoModel.obterPorId(avaliacaoId);

      expect(avaliacao.nota).toBe(9);
      expect(avaliacao.comentario).toBe('Excelente!');
    });
  });

  describe('deletar', () => {
    it('deve deletar uma avaliação', async () => {
      const avaliacaoId = await AvaliacaoModel.criar(filmeId, usuarioId1, 8, 'Muito bom!');
      
      await AvaliacaoModel.deletar(avaliacaoId);
      const avaliacao = await AvaliacaoModel.obterPorId(avaliacaoId);

      expect(avaliacao).toBeUndefined();
    });
  });

  describe('obterMediaFilme', () => {
    it('deve calcular a média de avaliações de um filme', async () => {
      await AvaliacaoModel.criar(filmeId, usuarioId1, 8);
      await AvaliacaoModel.criar(filmeId, usuarioId2, 10);

      const media = await AvaliacaoModel.obterMediaFilme(filmeId);

      expect(media.media).toBe(9);
      expect(media.total).toBe(2);
    });
  });
});
