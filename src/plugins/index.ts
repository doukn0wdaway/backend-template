import { FastifyInstance } from 'fastify';

import fastifyPlugin from 'fastify-plugin';
import config from './config';
import cors from './cors';
import zod from './zod';
import swagger from './swagger';
import db from './db';

export default fastifyPlugin(async (fastify: FastifyInstance) => {
  await Promise.all([fastify.register(config)]);

  await Promise.all([
    fastify.register(db),
    fastify.register(cors),
    fastify.register(zod),
  ]);

  if (fastify.config.isDev) await Promise.all([fastify.register(swagger)]);
});
