import { Request, Response } from 'express';
import { exportApplication } from './exportApplication';
import { ApiContext } from '@quote-calc-system/context';
import { LoggerImpl } from '@quote-calc-system/commons/logger';

const logger = new LoggerImpl();

export const exportApplicationExpress = async (req: Request, res: Response) => {
  try {
    // req.body が undefined の場合は空オブジェクトを渡す
    const exportApplicationRequest = req.body ?? {};

    // 必要に応じて ApiContext を作成
    const context: ApiContext = {
      // ここに context に必要なものを設定
      logger: console, // 仮
    };

    // OpenAPI 型の関数を呼び出す
    const result = await exportApplication({ exportApplicationRequest }, context);

    res.status(200).json(result);
  } catch (err) {
    logger.error(String(err));
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
