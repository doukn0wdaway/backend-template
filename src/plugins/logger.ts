import { FastifyBaseLogger, FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import pino from 'pino';

// INFO: consider using lnav or grafana or etc for better readability of file

declare module 'fastify' {
  interface FastifyInstance {
    logger: Logger;
  }
  interface FastifyRequest {
    logger: Logger;
  }
}

export default fastifyPlugin(async (app: FastifyInstance) => {
  const fastifyLogger = app.log;

  const logger = new Logger(fastifyLogger);

  app.decorate('logger', logger);

  app.addHook('onRequest', async request => {
    request.logger = app.logger.child('HTTP');
  });
});

export class Logger {
  private logger: FastifyBaseLogger;
  private prefix?: string;

  constructor(
    logger?: FastifyBaseLogger,
    options: { level?: string } = {},
    prefix?: string
  ) {
    this.logger =
      logger ||
      pino({
        level: options.level || 'info',
        transport: {
          targets: [
            {
              target: 'pino-pretty',
              options: {
                ignore: 'pid,hostname',
                translateTime: 'HH:MM:ss UTC',
                messageFormat: '{msg}',
                singleLine: true,
              },
            },
            {
              target: 'pino/file',
              options: { destination: './logs.txt', mkdir: true }, // INFO: changes log file path
              level: 'info',
            },
          ],
        },
      });

    this.prefix = prefix ? `[${prefix}]` : '';
  }

  log(
    level: 'info' | 'warn' | 'error' | 'debug',
    message: string,
    meta?: Record<string, unknown>
  ): void {
    const logObject: Record<string, unknown> = {
      msg: this.prefix ? `${this.prefix} ${message}` : message,
      ...meta,
    };

    this.logger[level](logObject);
  }

  info(message: string, meta?: Record<string, unknown>): void {
    this.log('info', message, meta);
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    this.log('warn', message, meta);
  }

  error(message: string, meta?: Record<string, unknown>): void {
    this.log('error', message, meta);
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    this.log('debug', message, meta);
  }

  child(prefix: string): Logger {
    return new Logger(this.logger, {}, prefix);
  }
}
