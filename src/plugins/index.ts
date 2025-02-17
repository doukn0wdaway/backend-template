import { FastifyInstance } from 'fastify';

import fastifyPlugin from 'fastify-plugin';
import env from './env';
import cors from './cors';
import zod from './zod';
import swagger from './swagger';
import db from './db';

export default fastifyPlugin(async (fastify: FastifyInstance) => {
  await Promise.all([fastify.register(env)]);

  await Promise.all([
    fastify.register(db),
    fastify.register(cors),
    fastify.register(zod),
  ]);

  const isDevMode = fastify.config.NODE_ENV === 'dev';

  if (isDevMode) await Promise.all([fastify.register(swagger)]);
});
