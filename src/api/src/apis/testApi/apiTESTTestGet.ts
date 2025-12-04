// export const apiTESTTestGet = () => {
//   throw new Error("apiTESTTestGet is not implemented yet");
// };

import { Request, Response, NextFunction } from 'express';

// GET /TEST/ping
export const apiTESTTestGet = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({ message: 'API側テスト表示!!!!' });
  } catch (err) {
    next(err);
  }
};

