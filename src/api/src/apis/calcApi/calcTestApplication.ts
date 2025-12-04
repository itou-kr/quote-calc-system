import { CalcTestApplication200Response } from '@quote-calc-system/models';
import * as TestApi from './types';

export const calcTestApplication: TestApi.calcTestApplication = async ({ calcTestApplicationRequest }) => {
    const { totalFP } = calcTestApplicationRequest;

    const response = new CalcTestApplication200Response();
    response.totalFP = totalFP;

    if (totalFP !== undefined) {
        response.manMonth = totalFP * 2;
    }

    return response;
};




// import { Request, Response, NextFunction } from 'express';

// // POST /TEST/calc
// export const calcTestApplication = (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { totalFP, manMonth } = req.body || {};

//     // if (totalFP === undefined || manMonth === undefined) {
//     //   return res.status(400).json({ message: 'totalFP or manMonth is missing' });
//     // }

//     const result = {
//       totalFP,
//       manMonth,
//       total: totalFP * manMonth,
//     };

//     return res.status(200).json(result);
//   } catch (err) {
//     return next(err);
//   }
// };

