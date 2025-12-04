import { Request, Response, NextFunction } from 'express';
import createHttpError, { isHttpError } from 'http-errors';
import { RootLogger } from '@quote-calc-system/commons/logger';

export function middleware(rootLogger: RootLogger) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (err: any, req: Request, res: Response, _next: NextFunction) => {
        const { status = 500 } = err;

        const logger = rootLogger.createChild(`${req.method} ${req.path}`);

        const { body, cookies, originalUrl, params, query } = req;

        if (status < 500) {
            logger.error('%s %s', status, err.message);
            logger.debug('%O', err);
            logger.debug('REQUESTED: %O', { originalUrl, cookies, query, body, params });
        } else {
            logger.error(err, err.message);
            logger.error('REQUESTED: %O', { originalUrl, cookies, query, body, params });
        }

        const httpError = isHttpError(err) ? err : createHttpError(status);

        res.status(status).json({
            status,
            message: httpError.message,
        });
    };
}