import { FastifyInstance } from 'fastify';
import { stringWithPositiveIntSchema, validate } from '../../utils/validation';
import z from 'zod';

export default async function exampleEntityRoutes(fastify: FastifyInstance) {
  fastify.get<{ Querystring: { mapName: string }; Params: { id: number } }>(
    '/:id',
    async (req, res) => {
      const id = validate(stringWithPositiveIntSchema, req.params.id);
      if (!id.success) {
        return res.code(404).send(id.errors);
      }

      return res.code(200).send({ query: req.query, id });
    }
  );

  fastify.post(
    '/register',
    {
      schema: {
        body: validationSchema, // body validation schema
        response: {
          // possible answers schemas
          200: z.object({
            name: z.string(),
          }),
        },
      },
    },
    async (req, res) => {
      return req.body;
    }
  );
}

export const validationSchema = z.object({
  name: z.string().min(2, 'Name must have at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must have at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/\d/, 'Password must contain at least one number'),
});
