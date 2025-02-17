import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import { FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import {
  createJsonSchemaTransformObject,
  jsonSchemaTransform,
} from 'fastify-type-provider-zod';

/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-swagger
 */
export default fastifyPlugin(async (fastify: FastifyInstance) => {
  await fastify.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'SampleApi',
        description: 'Sample backend service',
        version: '1.0.0',
      },
      servers: [],
    },
    transform: jsonSchemaTransform,
    transformObject: createJsonSchemaTransformObject({
      schemas: {},
    }),
  });

  await fastify.register(fastifySwaggerUI, {
    routePrefix: '/api/docs',
  });
});
