import cookieParser from 'cookie-parser';
import express from 'express';
import { inspect } from 'util';
import { RootLogger } from '@quote-calc-system/commons/logger';
import * as DevLogin from '@quote-calc-system/middlewares/devLogin';
import * as ErrorHandler from '@quote-calc-system/middlewares/openApiValidator';
import * as OpenApiValidator from 'express-openapi-validator';
import operationHandlerResolver from './commons/operationHandlerResolver';
import testRouter from './routes/test';
import path from 'path';
inspect.defaultOptions = {
  ...inspect.defaultOptions,
  breakLength: process.env.NODE_ENV === 'development' ? Infinity : inspect.defaultOptions.breakLength,
  depth: null,
  colors: process.env.NODE_ENV === 'development',
};

export function init(logger: RootLogger) {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());

  // ----------------------------------------------------------------------
  // 開発用ログイン API（NODE_ENV = development の場合のみ有効）
  // ----------------------------------------------------------------------
  app.use(DevLogin.middleware());

  // ----------------------------------------------------------------------
  // OpenAPI で定義された API
  // ----------------------------------------------------------------------
  app.use('/TEST', testRouter);
  app.use(
    OpenApiValidator.middleware({
      apiSpec: path.join(__dirname, '..', 'openapi', 'openapi.yml'),
      validateRequests: false,
      validateResponses: false,
      operationHandlers: {
        basePath: './apis',
        resolver: operationHandlerResolver(logger),
      }
    })
  );

  // ----------------------------------------------------------------------
  // エラー処理
  // ----------------------------------------------------------------------
  app.use(ErrorHandler.middleware(logger));

  // ----------------------------------------------------------------------
  // シャットダウン処理
  // ----------------------------------------------------------------------
  const shutdownHook = async () => {
    logger.info('shutdown...');
    try {
      // DB接続がないため、DB関連の処理は記載なし
      logger.info('No Database connection to close.');
      process.exit(0);
    } catch (e) {
      if (e instanceof Error) {
        logger.error(`${e}`, e.message);
      } else {
        logger.error(`${e}`);
      }
      process.exit(1);
    }
  };

  process.once('SIGTERM', shutdownHook);
  process.once('SIGINT', shutdownHook);
  process.once('SIGUSR2', shutdownHook);

  return app;
}