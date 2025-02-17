import fastifyPlugin from 'fastify-plugin';
import { FastifyInstance } from 'fastify/types/instance';

type DbExampleType = {
  val1: string;
};

declare module 'fastify' {
  interface FastifyInstance {
    db: DbExampleType;
  }
}

const db: DbExampleType = { val1: 'example' };

export default fastifyPlugin(async (fastify: FastifyInstance) => {
  fastify.decorate('db', db);

  fastify.addHook('onClose', async () => {
    // await prisma.$disconnect();
  });
});
