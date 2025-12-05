import { CalcTestApplication200Response } from '@quote-calc-system/models';
import * as CalcApi from './types';

export const calcTestApplication: CalcApi.calcTestApplication = async ({
  calcTestApplicationRequest = {},
}) => {
  const totalFP = calcTestApplicationRequest.totalFP;

  const response = new CalcTestApplication200Response();
  response.manMonth = totalFP

  return response;
};



