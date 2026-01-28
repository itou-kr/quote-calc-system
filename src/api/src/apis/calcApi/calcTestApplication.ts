import { CalcTestApplication200Response } from '@quote-calc-system/models';
import * as CalcApi from './types';

/** ▼ 工程別比率を計算する関数（案件種別、IPA代表値に基づく） */
const getProcessRatios = (projectType: string, ipaValueType: string) => {
  if (projectType === '新規開発' && ipaValueType === '中央値') {
    return {
      basicDesign: 0.205,
      detailedDesign: 0.181,
      implementation: 0.241,
      integrationTest: 0.191,
      systemTest: 0.182,
    };
  } else if (projectType === '新規開発' && ipaValueType === '平均値') {
    return {
      basicDesign: 0.207,
      detailedDesign: 0.175,
      implementation: 0.249,
      integrationTest: 0.193,
      systemTest: 0.176,
    };
  } else if (projectType === '改良開発' && ipaValueType === '中央値') {
    return {
      basicDesign: 0.216,
      detailedDesign: 0.185,
      implementation: 0.243,
      integrationTest: 0.193,
      systemTest: 0.163,
    };
  } else if (projectType === '改良開発' && ipaValueType === '平均値') {
    return {
      basicDesign: 0.216,
      detailedDesign: 0.176,
      implementation: 0.244,
      integrationTest: 0.190,
      systemTest: 0.174,
    };
  } else if (projectType === '再開発' && ipaValueType === '中央値') {
    return {
      basicDesign: 0.195,
      detailedDesign: 0.161,
      implementation: 0.277,
      integrationTest: 0.193,
      systemTest: 0.174,
    };
  } else if (projectType === '再開発' && ipaValueType === '平均値') {
    return {
      basicDesign: 0.188,
      detailedDesign: 0.158,
      implementation: 0.271,
      integrationTest: 0.208,
      systemTest: 0.175,
    };
  } else {
    // デフォルト値（新規開発・中央値と同じ）
    return {
      basicDesign: 0.205,
      detailedDesign: 0.181,
      implementation: 0.241,
      integrationTest: 0.191,
      systemTest: 0.182,
    };
  }
};

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
    // 手動入力された工程別比率を使用
    processRatios = calcTestApplicationRequest.processRatios || getProcessRatios(projectType, ipaValueType);
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
  const basicDesignFP = Math.round((response.totalFP ?? 0) * (processRatios?.basicDesign ?? 0) * 100) / 100;
  const detailedDesignFP = Math.round((response.totalFP ?? 0) * (processRatios?.detailedDesign ?? 0) * 100) / 100;
  const integrationTestFP = Math.round((response.totalFP ?? 0) * (processRatios?.integrationTest ?? 0) * 100) / 100;
  const systemTestFP = Math.round((response.totalFP ?? 0) * (processRatios?.systemTest ?? 0) * 100) / 100;
  // 実装は、totalFPから他の工程の合計を引いた値（丸め誤差を吸収）
  const implementationFP = Math.round(((response.totalFP ?? 0) - basicDesignFP - detailedDesignFP - integrationTestFP - systemTestFP) * 100) / 100;
  

  response.processFPs = {
    basicDesign: basicDesignFP,
    detailedDesign: detailedDesignFP,
    implementation: implementationFP,
    integrationTest: integrationTestFP,
    systemTest: systemTestFP,
  };

  // 工程別工数計算
  const basicDesignManMonths = Math.round((response.totalManMonths ?? 0) * (processRatios?.basicDesign ?? 0) * 100) / 100;
  const detailedDesignManMonths = Math.round((response.totalManMonths ?? 0) * (processRatios?.detailedDesign ?? 0) * 100) / 100;
  const integrationTestManMonths = Math.round((response.totalManMonths ?? 0) * (processRatios?.integrationTest ?? 0) * 100) / 100;
  const systemTestManMonths = Math.round((response.totalManMonths ?? 0) * (processRatios?.systemTest ?? 0) * 100) / 100;
  // 実装は、totalManMonthsから他の工程の合計を引いた値（丸め誤差を吸収）
  const implementationManMonths = Math.round(((response.totalManMonths ?? 0) - basicDesignManMonths - detailedDesignManMonths - integrationTestManMonths - systemTestManMonths) * 100) / 100;

  response.processManMonths = {
    basicDesign: basicDesignManMonths,
    detailedDesign: detailedDesignManMonths,
    implementation: implementationManMonths,
    integrationTest: integrationTestManMonths,
    systemTest: systemTestManMonths,
  };

  // 工程別工期計算
  const basicDesignDuration = Math.round((response.standardDurationMonths ?? 0) * (processRatios?.basicDesign ?? 0) * 100) / 100;
  const detailedDesignDuration = Math.round((response.standardDurationMonths ?? 0) * (processRatios?.detailedDesign ?? 0) * 100) / 100;
  const integrationTestDuration = Math.round((response.standardDurationMonths ?? 0) * (processRatios?.integrationTest ?? 0) * 100) / 100;
  const systemTestDuration = Math.round((response.standardDurationMonths ?? 0) * (processRatios?.systemTest ?? 0) * 100) / 100;
  // 実装は、standardDurationMonthsから他の工程の合計を引いた値（丸め誤差を吸収）
  const implementationDuration = Math.round(((response.standardDurationMonths ?? 0) - basicDesignDuration - detailedDesignDuration - integrationTestDuration - systemTestDuration) * 100) / 100;

  response.processDurations = {
    basicDesign: basicDesignDuration,
    detailedDesign: detailedDesignDuration,
    implementation: implementationDuration,
    integrationTest: integrationTestDuration,
    systemTest: systemTestDuration,
  };

  return response;
};



