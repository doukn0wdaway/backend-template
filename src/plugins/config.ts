import { FastifyInstance } from 'fastify';
import fastifyEnv from '@fastify/env';
import fastifyPlugin from 'fastify-plugin';
import dotenv from 'dotenv';
import fs from 'fs';

const NODE_ENVS = ['prod', 'stage', 'dev'] as const;
type NODE_ENV = (typeof NODE_ENVS)[number];

declare module 'fastify' {
  interface FastifyInstance {
    config: {
      HOST: string;
      PORT: number;
      NODE_ENV: NODE_ENV;
      isDev: boolean;
    };
  }
}

export default fastifyPlugin(async (fastify: FastifyInstance) => {
  // Get `NODE_ENV` or fallback to "dev"
  const currentEnv: NODE_ENV = (process.env.NODE_ENV as NODE_ENV) || 'dev';

  const envFile = currentEnv === 'dev' ? '.env' : `.env.${currentEnv}`;
  if (fs.existsSync(envFile)) {
    dotenv.config({ path: envFile });
  } else {
    fastify.log.warn(
      `Warning: ${envFile} not found, using default environment variables`
    );
  }

  fastify.log.info(`Loaded environment from ${envFile}`);

  const schema = {
    type: 'object',
    required: ['NODE_ENV'],
    properties: {
      HOST: { type: 'string', default: '127.0.0.1' },
      PORT: { type: 'number', default: 3000 },
      NODE_ENV: { type: 'string', enum: NODE_ENVS, default: 'dev' },
    },
  };

  const configOptions = {
    confKey: 'config',
    schema,
    data: process.env,
    dotenv: false,
    removeAdditional: true,
  };

  await fastify.register(fastifyEnv, configOptions);

  // ✅ Add `isDev` flag inside `fastify.config`
  fastify.config.isDev = fastify.config.NODE_ENV === 'dev';
});
