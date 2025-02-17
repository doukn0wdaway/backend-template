import dotenv from 'dotenv';
import { build } from './app';

const start = async () => {
  dotenv.config();

  let app;

  const start = performance.now();
  try {
    app = await build();
  } catch (e) {
    console.error('Error occured while building fastify');
    console.error(e);
    return;
  }

  app.log.info(
    `Successfully built fastify instance in ${(performance.now() - start).toFixed(2)} ms`
  );

  await app.listen({
    host: app.config.HOST,
    port: app.config.PORT,
  });
};

start();
