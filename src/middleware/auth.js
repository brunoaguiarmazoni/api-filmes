export async function autenticacao(request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.code(401).send({ erro: 'Token inválido ou expirado' });
  }
}

export async function validarDados(schema) {
  return async (request, reply) => {
    try {
      await schema.parseAsync(request.body);
    } catch (err) {
      reply.code(400).send({ 
        erro: 'Dados inválidos',
        detalhes: err.errors 
      });
    }
  };
}

export async function loggerMiddleware(request, reply) {
  console.log(`[${new Date().toISOString()}] ${request.method} ${request.url}`);
}
