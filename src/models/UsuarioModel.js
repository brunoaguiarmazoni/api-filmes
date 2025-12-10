import bcrypt from 'bcryptjs';
import { getDatabase } from '../database.js';

export class UsuarioModel {
  static async criar(nome, email, senha) {
    const db = getDatabase();
    const senhaHash = await bcrypt.hash(senha, 10);
    
    const result = await db('usuarios').insert({
      nome,
      email,
      senha: senhaHash
    });
    
    return result[0];
  }

  static async obterPorEmail(email) {
    const db = getDatabase();
    return await db('usuarios').where({ email }).first();
  }

  static async obterPorId(id) {
    const db = getDatabase();
    return await db('usuarios')
      .select('id', 'nome', 'email', 'created_at')
      .where({ id })
      .first();
  }

  static async listar() {
    const db = getDatabase();
    return await db('usuarios').select('id', 'nome', 'email', 'created_at');
  }

  static async atualizar(id, nome, email) {
    const db = getDatabase();
    await db('usuarios')
      .where({ id })
      .update({
        nome,
        email
      });
  }

  static async deletar(id) {
    const db = getDatabase();
    await db('usuarios').where({ id }).delete();
  }

  static async verificarSenha(senhaPlana, senhaHash) {
    return await bcrypt.compare(senhaPlana, senhaHash);
  }
}
