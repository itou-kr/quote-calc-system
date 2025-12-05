// import { Request, Response, NextFunction } from 'express';
// import { init } from '@quote-calc-system/commons/oracledb';
// import { Logger } from '@quote-calc-system/commons/logger';

// export function middleware(logger: Logger) {
//     const waitUntilInitialized = init(logger).catch((e) => e);
//     return async (req: Request, res: Response, next: NextFunction) => {
//         next(await waitUntilInitialized);;
//     }
// }