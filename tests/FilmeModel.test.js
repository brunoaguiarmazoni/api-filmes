import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { FilmeModel } from '../src/models/FilmeModel.js';
import { UsuarioModel } from '../src/models/UsuarioModel.js';
import { initDatabase, closeDatabase, getDatabase } from '../src/database.js';

describe('FilmeModel', () => {
  let usuarioId;

  beforeEach(async () => {
    await initDatabase();
    const db = getDatabase();
    await db('avaliacoes').del();
    await db('filmes').del();
    await db('usuarios').del();
    
    usuarioId = await UsuarioModel.criar('João', 'joao@email.com', 'senha123');
  });

  afterEach(async () => {
    await closeDatabase();
  });

  describe('criar', () => {
    it('deve criar um novo filme', async () => {
      const filmeId = await FilmeModel.criar(
        'Homem-Aranha',
        'Um herói que luta pelo bem',
        'Jon Watts',
        2021,
        'Ação',
        usuarioId
      );

      expect(filmeId).toBeDefined();
      expect(typeof filmeId).toBe('number');
    });
  });

  describe('obterPorId', () => {
    it('deve obter um filme por id', async () => {
      const filmeId = await FilmeModel.criar(
        'Homem-Aranha',
        'Um herói que luta pelo bem',
        'Jon Watts',
        2021,
        'Ação',
        usuarioId
      );

      const filme = await FilmeModel.obterPorId(filmeId);

      expect(filme).toBeDefined();
      expect(filme.id).toBe(filmeId);
      expect(filme.titulo).toBe('Homem-Aranha');
      expect(filme.diretor).toBe('Jon Watts');
    });
  });

  describe('listar', () => {
    it('deve listar todos os filmes', async () => {
      await FilmeModel.criar('Homem-Aranha', 'Descrição', 'Jon Watts', 2021, 'Ação', usuarioId);
      await FilmeModel.criar('Interestelar', 'Descrição', 'Christopher Nolan', 2014, 'Ficção Científica', usuarioId);

      const filmes = await FilmeModel.listar();
      expect(filmes).toHaveLength(2);
    });

    it('deve filtrar filmes por gênero', async () => {
      await FilmeModel.criar('Homem-Aranha', 'Descrição', 'Jon Watts', 2021, 'Ação', usuarioId);
      await FilmeModel.criar('Interestelar', 'Descrição', 'Christopher Nolan', 2014, 'Ficção Científica', usuarioId);

      const filmes = await FilmeModel.listar({ genero: 'Ação' });
      expect(filmes).toHaveLength(1);
      expect(filmes[0].genero).toBe('Ação');
    });
  });

  describe('atualizar', () => {
    it('deve atualizar informações do filme', async () => {
      const filmeId = await FilmeModel.criar(
        'Homem-Aranha',
        'Descrição antiga',
        'Jon Watts',
        2021,
        'Ação',
        usuarioId
      );

      await FilmeModel.atualizar(
        filmeId,
        'Homem-Aranha: Longe de Casa',
        'Descrição nova',
        'Jon Watts',
        2021,
        'Ação/Aventura'
      );

      const filme = await FilmeModel.obterPorId(filmeId);
      expect(filme.titulo).toBe('Homem-Aranha: Longe de Casa');
      expect(filme.descricao).toBe('Descrição nova');
      expect(filme.genero).toBe('Ação/Aventura');
    });
  });

  describe('deletar', () => {
    it('deve deletar um filme', async () => {
      const filmeId = await FilmeModel.criar(
        'Homem-Aranha',
        'Descrição',
        'Jon Watts',
        2021,
        'Ação',
        usuarioId
      );

      await FilmeModel.deletar(filmeId);
      const filme = await FilmeModel.obterPorId(filmeId);

      expect(filme).toBeUndefined();
    });
  });
});
