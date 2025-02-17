import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import fastifyEnv from '@fastify/env';
import fastifyPlugin from 'fastify-plugin';
import dotenv from 'dotenv';

dotenv.config();

const NODE_ENVS = ['prod', 'stage', 'dev'] as const;
type NODE_ENV = (typeof NODE_ENVS)[number];

declare module 'fastify' {
  interface FastifyInstance {
    config: {
      HOST: string;
      PORT: number;
      NODE_ENV: NODE_ENV;
    };
  }
}

export default fastifyPlugin(
  (
    fastify: FastifyInstance,
    _options: FastifyPluginOptions,
    done: (err?: Error | undefined) => void
  ) => {
    const schema = {
      type: 'object',
      required: [],
      properties: {
        HOST: {
          type: 'string',
          default: '127.0.0.1',
        },
        PORT: {
          type: 'number',
          default: 3000,
        },
        NODE_ENV: {
          type: 'string',
          default: 'prod',
        },
        ALLOWED_ORIGINS: {
          type: 'string',
          separator: ',',
          default: 'http://localhost:4321',
        },
      },
    };

    const configOptions = {
      // decorate the Fastify server instance with `config` key
      // such as `fastify.config('PORT')
      confKey: 'config',
      // schema to validate
      schema: schema,
      // source for the configuration data
      data: process.env,
      // will read .env in root folder
      dotenv: true,
      // will remove the additional properties
      // from the data object which creates an
      // explicit schema
      removeAdditional: true,
    };

    if (
      NODE_ENVS.find(validName => validName === process.env.NODE_ENV) ===
      undefined
    ) {
      throw new Error(
        "NODE_ENV is not valid, it must be one of 'prod', 'stage' or 'dev', not " +
          process.env.NODE_ENV +
          '"'
      );
    }

    fastifyEnv(fastify, configOptions, done);
  },
  { name: 'config' }
);
