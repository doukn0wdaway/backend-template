import fastify from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import plugins from './plugins';
import routes from './entity/routes';

export const build = async () => {
  const app = fastify({
    logger: {
      transport: {
        targets: [
          {
            target: 'pino-pretty',
            options: {
              ignore: 'pid, hostname',
              translateTime: 'HH:MM:ss Z',
            },
          },
          {
            target: 'pino/file',
            options: { destination: './logs.txt', mkdir: true },
            level: 'info',
          },
        ],
      },
    },
  }).withTypeProvider<ZodTypeProvider>();

  const startPlugins = performance.now();
  await app.register(plugins);
  app.log.info(`Plugins ${(performance.now() - startPlugins).toFixed(2)} ms`);

  const startModules = performance.now();
  await app.register(routes, { prefix: '/api' });
  app.log.info(`Modules ${(performance.now() - startModules).toFixed(2)} ms`);

  return app;
};
