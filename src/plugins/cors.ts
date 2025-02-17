import { fastifyCors } from '@fastify/cors';
import { FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

export default fastifyPlugin(async (fastify: FastifyInstance) => {
  await fastify.register(fastifyCors, {
    origin: 'http://localhost:5173', // Разрешить запросы только с определенного домена
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Разрешенные HTTP-методы
    allowedHeaders: ['Content-Type', 'Authorization'], // Разрешенные заголовки
    credentials: true, // Разрешить передачу cookie
  });
});
