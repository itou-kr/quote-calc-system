import { CalcTestApplication200Response } from '@quote-calc-system/models';
import * as CalcApi from './types';

/** ▼ 生産性を計算する関数（案件種別、IPA代表値、総FPに基づく） */
const getProductivity = (projectType: string, ipaValueType: string, totalFP: number): number => {
  // 案件種別とIPA代表値の組み合わせごとに、FP範囲に応じた生産性を返す
  if (projectType === '新規開発' && ipaValueType === '中央値') {
    if (totalFP < 400) return 10.5;
    if (totalFP < 1000) return 13.1;
    if (totalFP < 3000) return 9.0;
    return 8.4;
  } else if (projectType === '新規開発' && ipaValueType === '平均値') {
    if (totalFP < 400) return 11.1;
    if (totalFP < 1000) return 21.2;
    if (totalFP < 3000) return 19.7;
    return 12.9;
  } else if (projectType === '改良開発' && ipaValueType === '中央値') {
    if (totalFP < 200) return 10.4;
    if (totalFP < 400) return 8.9;
    if (totalFP < 1000) return 12.3;
    return 13.2;
  } else if (projectType === '改良開発' && ipaValueType === '平均値') {
    if (totalFP < 200) return 18.9;     // データ無のため、全体の平均値を採用
    if (totalFP < 400) return 14.6;
    if (totalFP < 1000) return 20.6;
    return 20.7;
  } else if (projectType === '再開発' && ipaValueType === '中央値') {
    if (totalFP < 200) return 20.1;     // データ無のため、全体の中央値を採用
    if (totalFP < 400) return 20.1;     // データ無のため、全体の中央値を採用
    if (totalFP < 1000) return 51.5;
    return 18.9;
  } else if (projectType === '再開発' && ipaValueType === '平均値') {
    if (totalFP < 200) return 37.8;     // データ無のため、全体の平均値を採用
    if (totalFP < 400) return 37.8;     // データ無のため、全体の平均値を採用
    if (totalFP < 1000) return 37.8;    // データ無のため、全体の平均値を採用
    return 39.3;
  } else {
    // デフォルト値（新規開発・中央値と同じ）
    if (totalFP < 400) return 10.5;
    if (totalFP < 1000) return 13.1;
    if (totalFP < 3000) return 9.0;
    return 8.4;
  }
};

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
  //-----小山記載 ここから----- 
  //TODO：名称に文字列が入っている場合のみ計算する分岐を入れる
  //-----小山記載 ここまで----- 
  switch (df.updateType) {
    case '内部論理ファイル':
      fpValue = 7;
      break;
    case '外部インタフェースファイル':
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
    //-----小山記載 ここから----- 
    //TODO：名称に文字列が入っている場合のみ計算する分岐を入れる
    //-----小山記載 ここまで----- 
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
    // 案件種別とIPA代表値に基づいて生産性を自動計算
    const projectType = calcTestApplicationRequest.projectType || '新規開発';
    const ipaValueType = calcTestApplicationRequest.ipaValueType || '中央値';   
    response.productivityFPPerMonth = getProductivity(projectType, ipaValueType, response.totalFP);
  } else {
    response.productivityFPPerMonth = calcTestApplicationRequest.productivityFPPerMonth;
  }

  // 総工数(人月)計算
  response.totalManMonths = Math.ceil((response.totalFP / (response.productivityFPPerMonth || 1)) * 100) / 100;

  // 標準工期計算
  //-----小山修正 ここから----- 
  const FORMLA = 2.64
  response.standardDurationMonths = Math.round(FORMLA * Math.pow(response.totalManMonths, 1/3) * 100) / 100;
  //-----小山修正 ここまで----- 

  // 工程別工数計算
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
  response.processDurations = {
    basicDesign:
    //-----小山修正 ここから----- 
      FORMLA * Math.pow((response.processManMonths.basicDesign ?? 0),1/3),

    detailedDesign:
      FORMLA * Math.pow((response.processManMonths.detailedDesign ?? 0),1/3),

    implementation:
      FORMLA * Math.pow((response.processManMonths.implementation ?? 0),1/3),

    integrationTest:
      FORMLA * Math.pow((response.processManMonths.integrationTest ?? 0),1/3),

    systemTest:
      FORMLA * Math.pow((response.processManMonths.systemTest ?? 0),1/3),
      //-----小山修正 ここまで----- 
  };

  return response;
};



