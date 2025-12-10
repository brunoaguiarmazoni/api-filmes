/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // Criar tabela usuarios
  await knex.schema.createTable('usuarios', (table) => {
    table.increments('id').primary();
    table.string('nome', 255).notNullable();
    table.string('email', 255).notNullable().unique();
    table.string('senha', 255).notNullable();
    table.timestamps(true, true);
  });

  // Criar tabela filmes
  await knex.schema.createTable('filmes', (table) => {
    table.increments('id').primary();
    table.string('titulo', 255).notNullable();
    table.text('descricao');
    table.string('diretor', 255).notNullable();
    table.integer('ano_lancamento');
    table.string('genero', 100);
    table.decimal('classificacao', 3, 1).defaultTo(0);
    table.integer('usuario_id').notNullable().unsigned();
    table.foreign('usuario_id').references('usuarios.id').onDelete('CASCADE');
    table.timestamps(true, true);
  });

  // Criar tabela avaliacoes
  await knex.schema.createTable('avaliacoes', (table) => {
    table.increments('id').primary();
    table.integer('filme_id').notNullable().unsigned();
    table.integer('usuario_id').notNullable().unsigned();
    table.decimal('nota', 2, 1).notNullable();
    table.text('comentario');
    table.timestamps(true, true);
    
    table.unique(['filme_id', 'usuario_id']);
    table.foreign('filme_id').references('filmes.id').onDelete('CASCADE');
    table.foreign('usuario_id').references('usuarios.id').onDelete('CASCADE');
  });

  // Habilitar foreign keys no SQLite
  await knex.raw('PRAGMA foreign_keys = ON');
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  // Desabilitar constraint checks temporariamente
  await knex.raw('PRAGMA foreign_keys = OFF');
  
  // Deletar tabelas na ordem inversa
  await knex.schema.dropTableIfExists('avaliacoes');
  await knex.schema.dropTableIfExists('filmes');
  await knex.schema.dropTableIfExists('usuarios');
  
  // Reabilitar constraint checks
  await knex.raw('PRAGMA foreign_keys = ON');
}
