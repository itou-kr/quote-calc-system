// import { Request, Response, NextFunction } from 'express';

// // GET /TEST/ping
// export const ping = (req: Request, res: Response, next: NextFunction) => {
//   try {
//     res.status(200).json({ message: 'API側テスト表示' });
//   } catch (err) {
//     next(err);
//   }
// };

// // POST /TEST/calc
// export const calc = (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { totalFP, manMonth } = req.body;

//     // ここはダミー計算
//     const result = {
//       totalFP,
//       manMonth,
//       total: totalFP * manMonth
//     };

//     res.status(200).json(result);
//   } catch (err) {
//     next(err);
//   }
// };
