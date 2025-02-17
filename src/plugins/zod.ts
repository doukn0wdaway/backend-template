import fastifyPlugin from 'fastify-plugin';
import {
  hasZodFastifySchemaValidationErrors,
  isResponseSerializationError,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { FastifyInstance } from 'fastify/types/instance';

export default fastifyPlugin(async (fastify: FastifyInstance) => {
  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(serializerCompiler);

  fastify.setErrorHandler((err, req, reply) => {
    if (hasZodFastifySchemaValidationErrors(err)) {
      // TODO: попробовать придумать форму записи получше
      reply.log.error({
        error: 'Response Validation Error',
        message: "Request doesn't match the schema",
        details: {
          issues: err.validation,
          method: req.method,
          url: req.url,
        },
      });
      return reply.code(400).send({
        error: 'Request Validation Error',
        message: "Request doesn't match the schema",
        validationErrors: err.validation.map(({ message, instancePath }) => ({
          message,
          field: instancePath,
        })),
        method: req.method,
        url: req.url,
      });
    }

    if (isResponseSerializationError(err)) {
      return reply.code(500).send({
        error: 'Internal Server Error',
        message: "Response doesn't match the schema",
        statusCode: 500,
        details: {
          issues: err.cause.issues,
          method: err.method,
          url: err.url,
        },
      });
    }

    return reply.send(err);
  });
});
