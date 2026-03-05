import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { LoggerModule } from 'nestjs-pino';
import { PrettyOptions } from 'pino-pretty';

@Module({
  imports: [
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => {
        const targets: {
          target: 'pino-pretty';
          options: PrettyOptions;
          levels?: Record<string, number>;
        }[] = [
          {
            target: 'pino-pretty',
            options: {
              singleLine: true,
              colorize: true,
              levelFirst: false,
              translateTime: "yyyy-MM-dd'T'HH:mm:ss.l'Z'",
              messageFormat: '[{context}] {msg}',
              ignore: 'pid,hostname,context,req,res,responseTime',
              errorLikeObjectKeys: ['err', 'error'],
            },
          },
        ];

        return {
          pinoHttp: {
            transport: {
              targets,
            },
            redact: ['req.headers.authorization'],
            autoLogging: false,

            // 🔥 Adds a UUID to each request
            genReqId: (req) => {
              const existingId = req.headers['x-request-id'];
              const id = typeof existingId === 'string' ? existingId : randomUUID();
              req.id = id;
              return id;
            },

            // 🔍 Customize log output
            customProps: (req, res) => ({
              uuid: req.id,
              path: req.url,
              method: req.method,
              statusCode: res.statusCode,
            }),

            // 🧼 Clean up request/response logs
            serializers: {
              req(req) {
                return {
                  id: req.id,
                  method: req.method,
                  url: req.url,
                  body: req.raw?.body,
                };
              },
              res(res) {
                return {
                  statusCode: res.statusCode,
                };
              },
            },

            // 🎯 Adjust log level by response
            customLogLevel: (res, err) => {
              const statusCode = res.statusCode as number;
              if (statusCode >= 500 || err) return 'error';
              if (statusCode >= 400) return 'warn';
              return 'info';
            },
          },
        };
      },
    }),
  ],
  exports: [LoggerModule],
})
export class LoggerConfigModule {}
