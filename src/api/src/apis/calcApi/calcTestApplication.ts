import { CalcTestApplication200Response } from '@quote-calc-system/models';
import * as CalcApi from './types';

export const calcTestApplication: CalcApi.calcTestApplication = async ({
  calcTestApplicationRequest = {},
}) => {
  
  const response = new CalcTestApplication200Response();
  
  if(!calcTestApplicationRequest.productivityFPPerMonth) {
    throw new Error('生産性(FP/月)が指定されていません');
  }
  
// 案件名
response.projectName = calcTestApplicationRequest.projectName;

// 生産性(FP/月)
response.productivityFPPerMonth = calcTestApplicationRequest.productivityFPPerMonth;

// データファンクションFP値計算
response.dataFunctions = calcTestApplicationRequest.dataFunctions?.map(df => {
  let fpValue;
  switch (df.updateType) {
    case '更新あり':
      fpValue = 7;
      break;
    case '参照のみ':
      fpValue = 5;
      break;
    default:
      fpValue = 0;
  }

  return {
    ...df,
    fpValue,
  };
});

// トランザクションファンクションFP計算
response.transactionFunctions =
  calcTestApplicationRequest.transactionFunctions?.map(tf => {
    const fpValue =
      (tf.externalInput ?? 0) * 4 +
      (tf.externalOutput ?? 0) * 5 +
      (tf.externalInquiry ?? 0) * 4;

    return {
      ...tf,
      fpValue,
    };
  });

  // 総FP計算
  const dataFunctionsFP =
    response.dataFunctions?.reduce(
      (sum, df) => sum + (df.fpValue ?? 0),
      0
    ) ?? 0;

  const transactionFunctionsFP =
    response.transactionFunctions?.reduce(
      (sum, tf) => sum + (tf.fpValue ?? 0),
      0
    ) ?? 0;

  response.totalFP = dataFunctionsFP + transactionFunctionsFP;

  // 生産性(FP/月)
  if (calcTestApplicationRequest.autoProductivity) {
    if (response.totalFP < 400) {
      response.productivityFPPerMonth = 10.5;
    } else if (response.totalFP < 1000) {
      response.productivityFPPerMonth = 13.1;
    } else if (response.totalFP < 3000) {
      response.productivityFPPerMonth = 9.0;
    } else {
      response.productivityFPPerMonth = 8.4;
    }
  } else {
    response.productivityFPPerMonth = calcTestApplicationRequest.productivityFPPerMonth;
  }

  // 総工数(人月)計算
  response.totalManMonths = Math.ceil((response.totalFP / calcTestApplicationRequest.productivityFPPerMonth) * 100) / 100;

  // 標準工期計算
  response.standardDurationMonths = Math.round(2.64 * Math.pow(response.totalManMonths, 1/3) * 100) / 100;
  
  // 工程別工数計算
  // すみません、ここは確実に要修正です
  response.processManMonths = {
    basicDesign:
      (response.totalManMonths ?? 0) *
      (calcTestApplicationRequest.processRatios?.basicDesign ?? 0),

    detailedDesign:
      (response.totalManMonths ?? 0) *
      (calcTestApplicationRequest.processRatios?.detailedDesign ?? 0),

    implementation:
      (response.totalManMonths ?? 0) *
      (calcTestApplicationRequest.processRatios?.implementation ?? 0),

    integrationTest:
      (response.totalManMonths ?? 0) *
      (calcTestApplicationRequest.processRatios?.integrationTest ?? 0),

    systemTest:
      (response.totalManMonths ?? 0) *
      (calcTestApplicationRequest.processRatios?.systemTest ?? 0),
  };

  // 工程別工期計算
  // すみません、ここは確実に要修正です
  response.processDurations = {
    basicDesign:
      2.64 * (response.processManMonths.basicDesign ?? 0),

    detailedDesign:
      2.64 * (response.processManMonths.detailedDesign ?? 0),

    implementation:
      2.64 * (response.processManMonths.implementation ?? 0),

    integrationTest:
      2.64 * (response.processManMonths.integrationTest ?? 0),

    systemTest:
      2.64 * (response.processManMonths.systemTest ?? 0),
  };

  return response;
};



