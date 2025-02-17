import { FastifyInstance } from 'fastify';
import exampleEntityRoutes from './exampleEntity/route';

export default async function routes(fastify: FastifyInstance) {
  fastify.register(exampleEntityRoutes, { prefix: '/exampleEntity' });
}
