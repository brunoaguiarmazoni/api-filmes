import { getDatabase } from '../database.js';

export class FilmeModel {
  static async criar(titulo, descricao, diretor, ano_lancamento, genero, usuario_id) {
    const db = getDatabase();
    
    const result = await db('filmes').insert({
      titulo,
      descricao,
      diretor,
      ano_lancamento,
      genero,
      usuario_id
    });
    
    return result[0];
  }

  static async obterPorId(id) {
    const db = getDatabase();
    return await db('filmes')
      .select('filmes.*', db.raw("usuarios.nome as usuario_nome"))
      .leftJoin('usuarios', 'filmes.usuario_id', 'usuarios.id')
      .where('filmes.id', id)
      .first();
  }

  static async listar(filtros = {}) {
    const db = getDatabase();
    let query = db('filmes')
      .select('filmes.*', db.raw("usuarios.nome as usuario_nome"))
      .leftJoin('usuarios', 'filmes.usuario_id', 'usuarios.id');

    if (filtros.genero) {
      query = query.where('filmes.genero', filtros.genero);
    }

    if (filtros.diretor) {
      query = query.where('filmes.diretor', 'like', `%${filtros.diretor}%`);
    }

    if (filtros.usuario_id) {
      query = query.where('filmes.usuario_id', filtros.usuario_id);
    }

    return await query.orderBy('filmes.created_at', 'desc');
  }

  static async atualizar(id, titulo, descricao, diretor, ano_lancamento, genero) {
    const db = getDatabase();
    await db('filmes')
      .where({ id })
      .update({
        titulo,
        descricao,
        diretor,
        ano_lancamento,
        genero
      });
  }

  static async deletar(id) {
    const db = getDatabase();
    await db('filmes').where({ id }).delete();
  }

  static async atualizarClassificacao(filme_id) {
    const db = getDatabase();
    
    const resultado = await db('avaliacoes')
      .where({ filme_id })
      .avg('nota as media')
      .first();

    const media = resultado?.media || 0;
    
    await db('filmes')
      .where({ id: filme_id })
      .update({ classificacao: media });

    return media;
  }

  static async obterComAvaliacoes(id) {
    const db = getDatabase();
    const filme = await this.obterPorId(id);

    if (!filme) return null;

    const avaliacoes = await db('avaliacoes')
      .select('avaliacoes.*', db.raw("usuarios.nome as usuario_nome"))
      .leftJoin('usuarios', 'avaliacoes.usuario_id', 'usuarios.id')
      .where('avaliacoes.filme_id', id)
      .orderBy('avaliacoes.created_at', 'desc');

    return { ...filme, avaliacoes };
  }
}
