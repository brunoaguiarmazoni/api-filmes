import { initDatabase, closeDatabase } from './src/database.js';
import { UsuarioModel } from './src/models/UsuarioModel.js';
import { FilmeModel } from './src/models/FilmeModel.js';
import { AvaliacaoModel } from './src/models/AvaliacaoModel.js';

async function seedDatabase() {
  try {
    console.log('Iniciando seed do banco de dados...');
    
    await initDatabase();

    // Criar usuários de exemplo
    console.log('Criando usuários...');
    const usuario1Id = await UsuarioModel.criar(
      'João Silva',
      'joao@example.com',
      'senha123'
    );
    
    const usuario2Id = await UsuarioModel.criar(
      'Maria Santos',
      'maria@example.com',
      'senha456'
    );

    console.log('Criando filmes...');
    
    // Criar filmes
    const filme1Id = await FilmeModel.criar(
      'Homem-Aranha: Longe de Casa',
      'Peter Parker se vê envolvido em uma aventura internacional enquanto tenta conciliar sua vida pessoal com suas responsabilidades como Homem-Aranha.',
      'Jon Watts',
      2021,
      'Ação',
      usuario1Id
    );

    const filme2Id = await FilmeModel.criar(
      'Interestelar',
      'Uma equipe de astronautas viaja através de um buraco de minhoca perto de Saturno para garantir a sobrevivência da humanidade.',
      'Christopher Nolan',
      2014,
      'Ficção Científica',
      usuario1Id
    );

    const filme3Id = await FilmeModel.criar(
      'O Poderoso Chefão',
      'O envelhecido patriarca de uma dinastia do crime organizado transfere o controle de seu negócio para seu filho mais jovem.',
      'Francis Ford Coppola',
      1972,
      'Drama',
      usuario2Id
    );

    const filme4Id = await FilmeModel.criar(
      'Inception',
      'Um ladrão que rouba segredos corporativos através de tecnologia de sonho compartilhado é oferecido um contrato para fazer o impossível.',
      'Christopher Nolan',
      2010,
      'Ficção Científica/Thriller',
      usuario2Id
    );

    console.log('Criando avaliações...');
    
    // Criar avaliações
    await AvaliacaoModel.criar(
      filme1Id,
      usuario1Id,
      8,
      'Muito bom! Efeitos visuais incríveis.'
    );

    await AvaliacaoModel.criar(
      filme1Id,
      usuario2Id,
      9,
      'Excelente filme, superou minhas expectativas!'
    );

    await AvaliacaoModel.criar(
      filme2Id,
      usuario2Id,
      10,
      'Uma das melhores obras de ficção científica jamais criadas.'
    );

    await AvaliacaoModel.criar(
      filme2Id,
      usuario1Id,
      9,
      'Cinematografia impecável e trilha sonora épica.'
    );

    await AvaliacaoModel.criar(
      filme3Id,
      usuario1Id,
      10,
      'Clássico absoluto do cinema.'
    );

    await AvaliacaoModel.criar(
      filme4Id,
      usuario1Id,
      9.5,
      'Mente insana, roteiro perfeito.'
    );

    // Atualizar classificações dos filmes
    await FilmeModel.atualizarClassificacao(filme1Id);
    await FilmeModel.atualizarClassificacao(filme2Id);
    await FilmeModel.atualizarClassificacao(filme3Id);
    await FilmeModel.atualizarClassificacao(filme4Id);

    console.log('✅ Seed concluído com sucesso!');
    console.log('');
    console.log('Dados de exemplo criados:');
    console.log('  - 2 usuários');
    console.log('  - 4 filmes');
    console.log('  - 6 avaliações');
    console.log('');
    console.log('Para testar, use:');
    console.log('  Email: joao@example.com | Senha: senha123');
    console.log('  Email: maria@example.com | Senha: senha456');

  } catch (erro) {
    console.error('❌ Erro ao fazer seed do banco:', erro);
    process.exit(1);
  } finally {
    await closeDatabase();
  }
}

seedDatabase();
