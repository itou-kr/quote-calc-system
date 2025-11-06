import { Logger } from '@quote-calc-system/commons/logger';
import { ApiContext } from './types';

export { ApiContext};

export async function getApiContext(logger: Logger): Promise<ApiContext> {
    logger.info('Creating API context');

    const context = {
        logger,
    };

    return context;
}