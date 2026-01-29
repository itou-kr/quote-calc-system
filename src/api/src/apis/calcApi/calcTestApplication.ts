import { CalcTestApplication200Response } from '@quote-calc-system/models';
import * as CalcApi from './types';
import { getProcessRatios } from '@common/constants/processRatios';

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

  // 案件種別とIPA代表値の取得
  const projectType = calcTestApplicationRequest.projectType || '新規開発';
  const ipaValueType = calcTestApplicationRequest.ipaValueType || '中央値';

  // 生産性(FP/月)
  if (calcTestApplicationRequest.autoProductivity) {
    // 案件種別とIPA代表値に基づいて生産性を自動計算
    response.productivityFPPerMonth = getProductivity(projectType, ipaValueType, response.totalFP);
  } else {
    response.productivityFPPerMonth = calcTestApplicationRequest.productivityFPPerMonth;
  }

  // 工程別比率の決定
  let processRatios;
  if (calcTestApplicationRequest.autoProcessRatios) {
    // 案件種別とIPA代表値に基づいて工程別比率を自動計算
    processRatios = getProcessRatios(projectType, ipaValueType);
  } else {
    // 手動入力された工程別比率を使用（文字列の場合は数値に変換）
    const inputRatios = calcTestApplicationRequest.processRatios || getProcessRatios(projectType, ipaValueType);
    processRatios = {
      basicDesign: Number(inputRatios.basicDesign) || 0,
      detailedDesign: Number(inputRatios.detailedDesign) || 0,
      implementation: Number(inputRatios.implementation) || 0,
      integrationTest: Number(inputRatios.integrationTest) || 0,
      systemTest: Number(inputRatios.systemTest) || 0,
    };
  }

  // レスポンスに工程別比率を設定
  response.processRatios = processRatios;

  // 総工数(人月)計算
  response.totalManMonths = Math.ceil((response.totalFP / (response.productivityFPPerMonth || 1)) * 100) / 100;

  // 標準工期計算
  //-----小山修正 ここから----- 
  const FORMLA = 2.64
  response.standardDurationMonths = Math.round(FORMLA * Math.pow(response.totalManMonths, 1/3) * 100) / 100;
  //-----小山修正 ここまで----- 

  // 工程別FP計算
  const ratioSum = (processRatios?.basicDesign ?? 0) + (processRatios?.detailedDesign ?? 0) + (processRatios?.implementation ?? 0) + (processRatios?.integrationTest ?? 0) + (processRatios?.systemTest ?? 0);
  const allocatableFP = (response.totalFP ?? 0) * ratioSum;
  
  // ratioSumが0の場合はゼロ除算を避けるため、全て0に設定
  let basicDesignFP = 0;
  let detailedDesignFP = 0;
  let integrationTestFP = 0;
  let systemTestFP = 0;
  let implementationFP = 0;
  
  if (ratioSum > 0) {
    basicDesignFP = Math.round((response.totalFP ?? 0) * (processRatios?.basicDesign ?? 0) * 100) / 100;
    detailedDesignFP = Math.round((response.totalFP ?? 0) * (processRatios?.detailedDesign ?? 0) * 100) / 100;
    integrationTestFP = Math.round((response.totalFP ?? 0) * (processRatios?.integrationTest ?? 0) * 100) / 100;
    systemTestFP = Math.round((response.totalFP ?? 0) * (processRatios?.systemTest ?? 0) * 100) / 100;
    // 実装工程で丸め誤差を吸収
    implementationFP = Math.round((allocatableFP - basicDesignFP - detailedDesignFP - integrationTestFP - systemTestFP) * 100) / 100;
  }
  

  response.processFPs = {
    basicDesign: basicDesignFP,
    detailedDesign: detailedDesignFP,
    implementation: implementationFP,
    integrationTest: integrationTestFP,
    systemTest: systemTestFP,
  };

  // 工程別工数計算
  const allocatableManMonths = (response.totalManMonths ?? 0) * ratioSum;
  
  let basicDesignManMonths = 0;
  let detailedDesignManMonths = 0;
  let integrationTestManMonths = 0;
  let systemTestManMonths = 0;
  let implementationManMonths = 0;
  
  if (ratioSum > 0) {
    basicDesignManMonths = Math.round((response.totalManMonths ?? 0) * (processRatios?.basicDesign ?? 0) * 100) / 100;
    detailedDesignManMonths = Math.round((response.totalManMonths ?? 0) * (processRatios?.detailedDesign ?? 0) * 100) / 100;
    integrationTestManMonths = Math.round((response.totalManMonths ?? 0) * (processRatios?.integrationTest ?? 0) * 100) / 100;
    systemTestManMonths = Math.round((response.totalManMonths ?? 0) * (processRatios?.systemTest ?? 0) * 100) / 100;
    // 実装工程で丸め誤差を吸収
    implementationManMonths = Math.round((allocatableManMonths - basicDesignManMonths - detailedDesignManMonths - integrationTestManMonths - systemTestManMonths) * 100) / 100;
  }

  response.processManMonths = {
    basicDesign: basicDesignManMonths,
    detailedDesign: detailedDesignManMonths,
    implementation: implementationManMonths,
    integrationTest: integrationTestManMonths,
    systemTest: systemTestManMonths,
  };

  // 工程別工期計算
  const allocatableDuration = (response.standardDurationMonths ?? 0) * ratioSum;
  
  let basicDesignDuration = 0;
  let detailedDesignDuration = 0;
  let integrationTestDuration = 0;
  let systemTestDuration = 0;
  let implementationDuration = 0;
  
  if (ratioSum > 0) {
    basicDesignDuration = Math.round((response.standardDurationMonths ?? 0) * (processRatios?.basicDesign ?? 0) * 100) / 100;
    detailedDesignDuration = Math.round((response.standardDurationMonths ?? 0) * (processRatios?.detailedDesign ?? 0) * 100) / 100;
    integrationTestDuration = Math.round((response.standardDurationMonths ?? 0) * (processRatios?.integrationTest ?? 0) * 100) / 100;
    systemTestDuration = Math.round((response.standardDurationMonths ?? 0) * (processRatios?.systemTest ?? 0) * 100) / 100;
    // 実装工程で丸め誤差を吸収
    implementationDuration = Math.round((allocatableDuration - basicDesignDuration - detailedDesignDuration - integrationTestDuration - systemTestDuration) * 100) / 100;
  }

  response.processDurations = {
    basicDesign: basicDesignDuration,
    detailedDesign: detailedDesignDuration,
    implementation: implementationDuration,
    integrationTest: integrationTestDuration,
    systemTest: systemTestDuration,
  };

  return response;
};



