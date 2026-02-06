import { CalcTestApplication200Response, CalcTestApplicationRequest } from '@quote-calc-system/models';
import * as CalcApi from './types';
import { getProcessRatios } from '@common/constants/processRatios';
import { getProductivity } from '@common/constants/productivity';
import * as path from 'path';
import * as Excel from 'exceljs';

// エラーメッセージを格納する配列
let errorMessage: string[] = [];

/**
 * 入力データのバリデーションを行う関数
 * @param calcTestApplicationRequest リクエストデータ
 */
const validateInputData = (calcTestApplicationRequest: CalcTestApplicationRequest) => {
  // 生産性のチェック（整数かつ4桁以下かつ0以上）
  // クライアント側の以下の箇所でチェックしているため不要
  // 1. ProductivityField.tsxで小数点を入力できないように制御
  // 2. CalcForm.tsxのsetupYupScheme()で4桁以下かつ0以上のバリデーションを実施している

  // 工程別比率のチェック（整数部1桁+小数部3桁まで、合計1.0）
  if (calcTestApplicationRequest.processRatios && calcTestApplicationRequest.autoProcessRatios !== true) {
    const ratios = calcTestApplicationRequest.processRatios;
    const ratioFields: Array<{ key: keyof typeof ratios; label: string }> = [
      { key: 'basicDesign', label: '基本設計' },
      { key: 'detailedDesign', label: '詳細設計' },
      { key: 'implementation', label: '実装' },
      { key: 'integrationTest', label: '結合テスト' },
      { key: 'systemTest', label: 'システムテスト' },
    ];

    let ratioSum = 0;
    ratioFields.forEach(field => {
      const value = ratios[field.key];
      if (value !== undefined && value !== null) {
        // 小数点第3位までのチェック
        // クライアント側：ProcessRatiosField.tsxのhandleInputで小数点第3位までに入力制限

        // 0〜1の範囲チェック
        // クライアント側：CalcForm.tsxのyupで.rangeCheck(0.000, 1.000)実施済み
        ratioSum += value;
      }
    });

    // 合計が1.0（100%）であることをチェック（浮動小数点の誤差を考慮して0.001の範囲で許容）
    // クライアント側：ProcessRatiosField.tsxで視覚表示のみ（バリデーションなし）
    // このチェックはAPI側でのみ実施
    if (Math.abs(ratioSum - 1.0) > 0.001) {
      // TODO: エラーメッセージではなく警告メッセージを表示
    }
  }

  // データファンクションのチェック
  if (calcTestApplicationRequest.dataFunctions) {
    const errorRows: number[] = [];
    calcTestApplicationRequest.dataFunctions.forEach((df, index) => {
      const hasName = df.name && df.name.trim() !== '';
      const hasUpdateType = df.updateType && df.updateType !== '';
      // 名称と種類の組み合わせが不正（片方だけ入力されている）
      if ((hasName && !hasUpdateType) || (!hasName && hasUpdateType)) {
        errorRows.push(index + 1);
      }
    });
    
    if (errorRows.length > 0) {
      errorMessage.push(`データファンクションの名称もしくはデータファンクションの種類が不足しています。(No.${errorRows.join(', ')})`);
    }
  }

  // トランザクションファンクションのチェック
  if (calcTestApplicationRequest.transactionFunctions) {
    const errorRows: number[] = [];
    calcTestApplicationRequest.transactionFunctions.forEach((tf, index) => {
      const hasName = tf.name && tf.name.trim() !== '';
      const total = (tf.externalInput ?? 0) + (tf.externalOutput ?? 0) + (tf.externalInquiry ?? 0);
      
      // 名称が入力されているが外部入力・出力・参照の合計が0
      // または名称が空で外部入力・出力・参照の合計が0より大きい
      if ((hasName && total === 0) || (!hasName && total > 0)) {
        errorRows.push(index + 1);
      }
    });
    
    if (errorRows.length > 0) {
      errorMessage.push(`トランザクションファンクションの名称もしくは外部入力・外部出力・外部参照の入力が不足しています。(No.${errorRows.join(', ')})`);
    }
  }

};

export const calcTestApplication: CalcApi.calcTestApplication = async ({
  calcTestApplicationRequest = {},
}) => {
  
  const response = new CalcTestApplication200Response();

  // エラーメッセージ配列の初期化
  errorMessage = [];

  // 入力データのバリデーション実行
  validateInputData(calcTestApplicationRequest);
  
  // エラーがある場合は処理を中断してエラーを返す
  if (errorMessage.length > 0) {
    response.errorMessages = errorMessage;
    return response;
  }
  
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

  // 総FPのバリデーション（整数かつ4桁以下）
  if (response.totalFP > 9999) {
    errorMessage.push('総FPが4桁を超えています。データファンクションまたはトランザクションファンクションの値を調整してください');
    response.errorMessages = errorMessage;
    return response;
  }

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

// インポート機能用のバリデーション関数（未使用だが将来のために残す）
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function validateConsistencyDetail(
  fileBuffer: Buffer,
  fileName: string,
) {
  // ===== 拡張子チェック =====
  const ext = path.extname(fileName).toLowerCase();

  if (ext !== '.xlsx') {
    errorMessage.push('Excelファイル（.xlsx）を選択してください');
    return;
  }
  const wb = new Excel.Workbook();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await wb.xlsx.load(fileBuffer as any);
  /** ===== 1シート目（共通項目） ===== */
  const ws1 = wb.getWorksheet(1);
  if (!ws1) {
    errorMessage.push('シート1が見つかりません');
    return;
  }
}



