import { getDatabase } from '../database.js';

export class AvaliacaoModel {
  static async criar(filme_id, usuario_id, nota, comentario = '') {
    const db = getDatabase();
    
    const result = await db('avaliacoes').insert({
      filme_id,
      usuario_id,
      nota,
      comentario
    });
    
    return result[0];
  }

  static async obterPorId(id) {
    const db = getDatabase();
    return await db('avaliacoes')
      .select('avaliacoes.*', db.raw("usuarios.nome as usuario_nome"))
      .leftJoin('usuarios', 'avaliacoes.usuario_id', 'usuarios.id')
      .where('avaliacoes.id', id)
      .first();
  }

  static async obterPorFilmeEUsuario(filme_id, usuario_id) {
    const db = getDatabase();
    return await db('avaliacoes')
      .where({ filme_id, usuario_id })
      .first();
  }

  static async listarPorFilme(filme_id) {
    const db = getDatabase();
    return await db('avaliacoes')
      .select('avaliacoes.*', db.raw("usuarios.nome as usuario_nome"))
      .leftJoin('usuarios', 'avaliacoes.usuario_id', 'usuarios.id')
      .where('avaliacoes.filme_id', filme_id)
      .orderBy('avaliacoes.created_at', 'desc');
  }

  static async atualizar(id, nota, comentario) {
    const db = getDatabase();
    await db('avaliacoes')
      .where({ id })
      .update({
        nota,
        comentario
      });
  }

  static async deletar(id) {
    const db = getDatabase();
    await db('avaliacoes').where({ id }).delete();
  }

  static async obterMediaFilme(filme_id) {
    const db = getDatabase();
    const resultado = await db('avaliacoes')
      .where({ filme_id })
      .avg('nota as media')
      .count('* as total')
      .first();
    return resultado || { media: 0, total: 0 };
  }
}
