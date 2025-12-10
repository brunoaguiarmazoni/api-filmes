import { FilmeModel } from '../models/FilmeModel.js';
import { AvaliacaoModel } from '../models/AvaliacaoModel.js';

export class FilmeController {
  static async criar(request, reply) {
    try {
      const { titulo, descricao, diretor, ano_lancamento, genero } = request.body;

      if (!titulo || !diretor) {
        return reply.code(400).send({ 
          erro: 'Título e diretor são obrigatórios' 
        });
      }

      const filmeId = await FilmeModel.criar(
        titulo, 
        descricao, 
        diretor, 
        ano_lancamento, 
        genero,
        request.user.id
      );

      const filme = await FilmeModel.obterPorId(filmeId);

      return reply.code(201).send({
        mensagem: 'Filme criado com sucesso',
        filme
      });
    } catch (erro) {
      console.error('Erro ao criar filme:', erro);
      return reply.code(500).send({ 
        erro: 'Erro ao criar filme' 
      });
    }
  }

  static async listar(request, reply) {
    try {
      const { genero, diretor, usuario_id } = request.query;

      const filtros = {};
      if (genero) filtros.genero = genero;
      if (diretor) filtros.diretor = diretor;
      if (usuario_id) filtros.usuario_id = parseInt(usuario_id);

      const filmes = await FilmeModel.listar(filtros);

      return reply.send({
        total: filmes.length,
        filmes
      });
    } catch (erro) {
      console.error('Erro ao listar filmes:', erro);
      return reply.code(500).send({ 
        erro: 'Erro ao listar filmes' 
      });
    }
  }

  static async obterPorId(request, reply) {
    try {
      const { id } = request.params;
      const filme = await FilmeModel.obterComAvaliacoes(id);

      if (!filme) {
        return reply.code(404).send({ 
          erro: 'Filme não encontrado' 
        });
      }

      return reply.send(filme);
    } catch (erro) {
      console.error('Erro ao obter filme:', erro);
      return reply.code(500).send({ 
        erro: 'Erro ao obter filme' 
      });
    }
  }

  static async atualizar(request, reply) {
    try {
      const { id } = request.params;
      const { titulo, descricao, diretor, ano_lancamento, genero } = request.body;

      const filme = await FilmeModel.obterPorId(id);
      if (!filme) {
        return reply.code(404).send({ 
          erro: 'Filme não encontrado' 
        });
      }

      if (filme.usuario_id !== request.user.id) {
        return reply.code(403).send({ 
          erro: 'Você não tem permissão para atualizar este filme' 
        });
      }

      await FilmeModel.atualizar(id, titulo, descricao, diretor, ano_lancamento, genero);
      const filmeAtualizado = await FilmeModel.obterPorId(id);

      return reply.send({
        mensagem: 'Filme atualizado com sucesso',
        filme: filmeAtualizado
      });
    } catch (erro) {
      console.error('Erro ao atualizar filme:', erro);
      return reply.code(500).send({ 
        erro: 'Erro ao atualizar filme' 
      });
    }
  }

  static async deletar(request, reply) {
    try {
      const { id } = request.params;

      const filme = await FilmeModel.obterPorId(id);
      if (!filme) {
        return reply.code(404).send({ 
          erro: 'Filme não encontrado' 
        });
      }

      if (filme.usuario_id !== request.user.id) {
        return reply.code(403).send({ 
          erro: 'Você não tem permissão para deletar este filme' 
        });
      }

      await FilmeModel.deletar(id);

      return reply.send({
        mensagem: 'Filme deletado com sucesso'
      });
    } catch (erro) {
      console.error('Erro ao deletar filme:', erro);
      return reply.code(500).send({ 
        erro: 'Erro ao deletar filme' 
      });
    }
  }

  static async avaliar(request, reply) {
    try {
      const { id } = request.params;
      const { nota, comentario } = request.body;

      if (nota === undefined || nota === null || nota < 0 || nota > 10) {
        return reply.code(400).send({ 
          erro: 'Nota deve ser um número entre 0 e 10' 
        });
      }

      const filme = await FilmeModel.obterPorId(id);
      if (!filme) {
        return reply.code(404).send({ 
          erro: 'Filme não encontrado' 
        });
      }

      const avaliacaoExistente = await AvaliacaoModel.obterPorFilmeEUsuario(id, request.user.id);

      let avaliacao;
      if (avaliacaoExistente) {
        await AvaliacaoModel.atualizar(avaliacaoExistente.id, nota, comentario || '');
        avaliacao = await AvaliacaoModel.obterPorId(avaliacaoExistente.id);
      } else {
        const avaliacaoId = await AvaliacaoModel.criar(id, request.user.id, nota, comentario || '');
        avaliacao = await AvaliacaoModel.obterPorId(avaliacaoId);
      }

      // Atualizar classificação do filme
      await FilmeModel.atualizarClassificacao(id);
      const media = await AvaliacaoModel.obterMediaFilme(id);

      return reply.code(201).send({
        mensagem: 'Avaliação registrada com sucesso',
        avaliacao,
        media: media.media,
        total_avaliacoes: media.total
      });
    } catch (erro) {
      console.error('Erro ao avaliar filme:', erro);
      return reply.code(500).send({ 
        erro: 'Erro ao avaliar filme' 
      });
    }
  }

  static async obterAvaliacoes(request, reply) {
    try {
      const { id } = request.params;

      const filme = await FilmeModel.obterPorId(id);
      if (!filme) {
        return reply.code(404).send({ 
          erro: 'Filme não encontrado' 
        });
      }

      const avaliacoes = await AvaliacaoModel.listarPorFilme(id);
      const media = await AvaliacaoModel.obterMediaFilme(id);

      return reply.send({
        filme: {
          id: filme.id,
          titulo: filme.titulo
        },
        media: media.media,
        total_avaliacoes: media.total,
        avaliacoes
      });
    } catch (erro) {
      console.error('Erro ao obter avaliações:', erro);
      return reply.code(500).send({ 
        erro: 'Erro ao obter avaliações' 
      });
    }
  }
}
