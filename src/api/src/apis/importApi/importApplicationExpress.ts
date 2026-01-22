import { Request, Response } from 'express';
import { importApplication } from './importApplication';
// import { ApiContext } from '@quote-calc-system/context';
import { LoggerImpl } from '@quote-calc-system/commons/logger';

const logger = new LoggerImpl();

export const importApplicationExpress = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
        return res.status(400).json({
            status: 400,
            message: 'file is required',
        });
        }

        const result = await importApplication(req.file.buffer);

        return res.status(200).json(result);
    } catch (err) {
        if (err instanceof Error) {
        logger.error(err.message);
        } else {
        logger.error(String(err));
        }

        return res.status(500).json({
        status: 500,
        message: 'Internal Server Error',
        });
    }
};

