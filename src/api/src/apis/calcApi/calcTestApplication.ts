import { CalcTestApplication200Response } from '@quote-calc-system/models';
import * as CalcApi from './types';

export const calcTestApplication: CalcApi.calcTestApplication = async ({
  calcTestApplicationRequest = {},
}) => {

  const response = new CalcTestApplication200Response();
  response.totalFP = 100;

  response.manMonth = calcTestApplicationRequest.totalFP

  return response;
};



