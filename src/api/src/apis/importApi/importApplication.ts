import * as Excel from 'exceljs';
import { ImportApplication200Response } from '@quote-calc-system/models';
import path from 'path';
// import * as ImportApi from './types';

let errorMessage: string[];

export const importApplication = async (
  fileBuffer: Buffer,
  fileName: string,
): Promise<ImportApplication200Response> => {
  
  const response = new ImportApplication200Response();
  
  errorMessage = [];

  // 固有項目チェック
  await validateConsistencyDetail(fileBuffer, fileName);
  if (errorMessage.length > 0) {
    response.errorMessages = errorMessage;
    return response;
  }

    // いる？
    // errorMessage = [];

    const wb = new Excel.Workbook();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await wb.xlsx.load(fileBuffer as any);

    /** ===== 1シート目（共通項目） ===== */
    const ws1 = wb.getWorksheet(1);
    if (!ws1) throw new Error('シート1が見つかりません');


    response.projectName = ws1.getCell('C2').value?.toString() ?? '';
    response.productivityFPPerMonth = Number(ws1.getCell('C4').value ?? 0);
    response.projectType = ws1.getCell('C5').value?.toString() ?? '';
    response.ipaValueType = ws1.getCell('C6').value?.toString() ?? '';
    response.totalFP = Number(ws1.getCell('C7').value ?? 0);
    response.totalManMonths = Number(ws1.getCell('C8').value ?? 0);
    response.standardDurationMonths = Number(ws1.getCell('C9').value ?? 0);

    response.processRatios = {
      basicDesign: Number(ws1.getCell('C12').value ?? 0),
      detailedDesign: Number(ws1.getCell('D12').value ?? 0),
      implementation: Number(ws1.getCell('E12').value ?? 0),
      integrationTest: Number(ws1.getCell('F12').value ?? 0),
      systemTest: Number(ws1.getCell('G12').value ?? 0),
    };

    response.processManMonths = {
      basicDesign: Number(ws1.getCell('C13').value ?? 0),
      detailedDesign: Number(ws1.getCell('D13').value ?? 0),
      implementation: Number(ws1.getCell('E13').value ?? 0),
      integrationTest: Number(ws1.getCell('F13').value ?? 0),
      systemTest: Number(ws1.getCell('G13').value ?? 0),
    };

    response.processDurations = {
      basicDesign: Number(ws1.getCell('C14').value ?? 0),
      detailedDesign: Number(ws1.getCell('D14').value ?? 0),
      implementation: Number(ws1.getCell('E14').value ?? 0),
      integrationTest: Number(ws1.getCell('F14').value ?? 0),
      systemTest: Number(ws1.getCell('G14').value ?? 0),
    };

    /** ===== 2シート目（データ機能） ===== */
    const ws2 = wb.getWorksheet(2);
    response.dataFunctions = [];

    if (ws2) {
      const startRow = 3;

      for (let row = startRow; row <= ws2.rowCount; row++) {
        const name = ws2.getCell(`B${row}`).value?.toString();
        if (!name) break; // 空行で終了

        response.dataFunctions.push({
          name,
          updateType: ws2.getCell(`C${row}`).value?.toString() ?? '',
          fpValue: Number(ws2.getCell(`D${row}`).value ?? 0),
          remarks: ws2.getCell(`E${row}`).value?.toString() ?? '',
        });
      }
    }

    /** ===== 3シート目（トランザクション機能） ===== */
    const ws3 = wb.getWorksheet(3);
    response.transactionFunctions = [];

    if (ws3) {
      const startRow = 3;

      for (let row = startRow; row <= ws3.rowCount; row++) {
        const name = ws3.getCell(`B${row}`).value?.toString();
        if (!name) break;

        response.transactionFunctions.push({
          name,
          externalInput: Number(ws3.getCell(`C${row}`).value ?? 0),
          externalOutput: Number(ws3.getCell(`D${row}`).value ?? 0),
          externalInquiry: Number(ws3.getCell(`E${row}`).value ?? 0),
          fpValue: Number(ws3.getCell(`F${row}`).value ?? 0),
          remarks: ws3.getCell(`G${row}`).value?.toString() ?? '',
        });
      }
    }

  return response;
};

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

  // ===== エラーメッセージ定義 =====
  const mustCheckMessage = 'を入力してください。'
  const rangeCheckMessage = 'の範囲で入力してください。';
  const numberCheckMessage = 'は半角数字で入力してください。';
  const pullDownCheckMessage = 'はプルダウンから選択してください。';
  // ===== 1シート目のラベル定義 =====
  const projectNameLabel = "案件名";
  const productivityFPPerMonthLabel = "生産性";
  const projectTypeLabel = "案件種別";
  const newDev = "新規開発";
  const improveDev = "改良開発";
  const renewal = "再開発";
  const median = "中央値";
  const average = "平均値";
  const totalFPLabel = "総FP";
  const basicDesignLabel = "基本設計";
  const detailedDesignLabel = "詳細設計";
  const implementationLabel = "実装";
  const integrationTestLabel = "結合テスト";
  const systemTestLabel = "総合テスト";
  const ratio = "の比率";
  const minPercent = 0;
  const maxPercent = 1;
  // ===== 2シート目のラベル定義 =====
  const write = "内部論理ファイル";
  const readOnly = "外部インターフェースファイル";
  const dataFunctionName = "データファンクション名";
  const dataFunctionType = "データファンクションの種類";
  const sheet2 = 'データファンクションシート 列';
  // ===== 3シート目のラベル定義 =====
  const externalInputLabel = "外部入力";
  const externalOutputLabel = "外部出力";
  const externalInquiryLabel = "外部照会";
  const transactionFunctionName = "トランザクションファンクション名";
  const transactionFunctionType = "トランザクションファンクションの種類";
  const sheet3 = 'トランザクションファンクションシート 列';
  // ===== その他共通定義 =====
  const min_0 = 0;
  const min_1 = 1;
  const max_9999 = 9999;
  const startRow = 3;
  const maxDataName = 50;
  const maxNote = 200;
  const noteLabel = '備考';

  /** ===== 1シート目（共通項目） ===== */
  //=====シート存在チェック=====
  const ws1 = wb.getWorksheet(1);
  if (!ws1) {
    errorMessage.push('共通シートが見つかりません');
    return;
  }
  
  //===== フォーマットチェック =====
  if (ws1.getCell('B2').value?.toString() !== projectNameLabel ||
      ws1.getCell('B4').value?.toString() !== productivityFPPerMonthLabel ||
      ws1.getCell('B5').value?.toString() !== projectTypeLabel ||
      ws1.getCell('B7').value?.toString() !== totalFPLabel) {
    errorMessage.push('ファイルの内容が異なるため、インポートに失敗しました。');
    return;
  }

  //===== 案件名のチェック=====
  const maxProductName = 100;
  const productName = ws1.getCell('C2').value?.toString();
  //必須チェック
  if (!productName || productName.trim() === '') {
    errorMessage.push(projectNameLabel + mustCheckMessage);
  }
  //桁数チェック
  if (productName && productName.length > maxProductName) {
    errorMessage.push(projectNameLabel +`は最大${maxProductName}文字で入力してください。`);
  }

  //===== 生産性のチェック =====
  //必須チェック
  const productivityFPPerMonth = ws1.getCell('C4').value;
  if (!productivityFPPerMonth) {
    errorMessage.push(productivityFPPerMonthLabel + mustCheckMessage);
  }
  //属性チェック
  if (isNaN(Number(productivityFPPerMonth))) {
    errorMessage.push(productivityFPPerMonthLabel + numberCheckMessage);
  }
  //範囲チェック
  if (Number(productivityFPPerMonth) < min_1 || Number(productivityFPPerMonth) > max_9999) {
    errorMessage.push(`${productivityFPPerMonthLabel}は${min_1}～${max_9999}${rangeCheckMessage}`);
  }
  
  //===== 案件種別のチェック =====
  //整合性チェック
  if (!ws1.getCell('C5').value) {
  const type = ws1.getCell('C5').value?.toString();
    if (type !== newDev && type !== improveDev && type !== renewal) {
      errorMessage.push('案件種別' + pullDownCheckMessage);
    }
  }
  
  //===== 使用するIPA代表値のチェック =====
  //整合性チェック
  const IPA = ws1.getCell('C6').value?.toString();
  if (IPA) {
  //console.log(IPA);
    if (IPA !== median && IPA !== average) {
      errorMessage.push('IPA代表値' + pullDownCheckMessage);
    }
  }

  //===== 工程別比率のチェック =====
  //基本設計
  //必須チェック
  const basicDesign = ws1.getCell('C12').value;
  if (!basicDesign) {
    errorMessage.push(basicDesignLabel + ratio + mustCheckMessage);
  }
  //属性チェック
  if (isNaN(Number(basicDesign))) {
    errorMessage.push(basicDesignLabel + ratio + numberCheckMessage);
  }
  //範囲チェック
  if (Number(basicDesign) < minPercent || Number(basicDesign) > maxPercent) {
    errorMessage.push(basicDesignLabel + ratio + 'は0～1' + rangeCheckMessage);
  }

  //詳細設計
  const detailedDesign = ws1.getCell('D12').value;
  //必須チェック
  if (!detailedDesign) {
    errorMessage.push(detailedDesignLabel + ratio + mustCheckMessage);
  }
  //属性チェック
  if (isNaN(Number(detailedDesign))) {
    errorMessage.push(detailedDesignLabel + ratio + numberCheckMessage);
  }
  //範囲チェック
  if (Number(detailedDesign) < minPercent || Number(detailedDesign) > maxPercent) {
    errorMessage.push(detailedDesignLabel + ratio + 'は0～1' + rangeCheckMessage);
  }

  //実装
  const implementation = ws1.getCell('E12').value;
  //必須チェック
  if (!implementation) {
    errorMessage.push(implementationLabel + ratio + mustCheckMessage);
  }
  //属性チェック
  if (isNaN(Number(implementation))) {
    errorMessage.push(implementationLabel + ratio + numberCheckMessage);
  }
  //範囲チェック
  if (Number(implementation) < minPercent || Number(implementation) > maxPercent) {
    errorMessage.push(implementationLabel + ratio + 'は0～1' + rangeCheckMessage);
  }

  //結合テスト
  const integrationTest = ws1.getCell('F12').value;
  //必須チェック
  if (!integrationTest) {
    errorMessage.push(integrationTestLabel + ratio + mustCheckMessage);
  }
  //属性チェック
  if (isNaN(Number(integrationTest))) {
    errorMessage.push(integrationTestLabel + ratio + numberCheckMessage);
  }
  //範囲チェック
  if (Number(integrationTest) < minPercent || Number(integrationTest) > maxPercent) {
    errorMessage.push(integrationTestLabel + ratio + 'は0～1' + rangeCheckMessage);
  }

  //総合テスト
  const systemTest = ws1.getCell('G12').value;
  //必須チェック
  if (!systemTest) {
    errorMessage.push(systemTestLabel + ratio + mustCheckMessage);
  }
  //属性チェック
  if (isNaN(Number(systemTest))) {
    errorMessage.push(systemTestLabel + ratio + numberCheckMessage);
  }
  //範囲チェック
  if (Number(systemTest) < minPercent || Number(systemTest) > maxPercent) {
    errorMessage.push(systemTestLabel + ratio + 'は0～1' + rangeCheckMessage);
  }

  /** ===== 2シート目（データ機能） ===== */
  const ws2 = wb.getWorksheet(2);
  //=====シート存在チェック=====
  if (!ws2) {
    errorMessage.push('データファンクションシートが見つかりません');
    return;
  }

  //===== フォーマットチェック =====
  if (ws2.getCell('A2').value?.toString() !== 'No' ||
      ws2.getCell('B2').value?.toString() !== '名称' ||
      ws2.getCell('C2').value?.toString() !== dataFunctionType ||
      ws2.getCell('D2').value?.toString() !== 'FP値') {
    errorMessage.push('ファイルの内容が異なるため、インポートに失敗しました。');
    return;
  }
  
  //各種チェック
  for (let row = startRow; row <= ws2.rowCount; row++) {
    const name = ws2.getCell(`B${row}`).value?.toString();
    const type = ws2.getCell(`C${row}`).value?.toString();
    const note = ws2.getCell(`E${row}`).value?.toString();
    const outputRow = row - 2
    if (!name && !type) break; // データ名も種類もない場合は終了
    //===== 必須チェック =====
    //ファンクション名
    if (!name) {
      errorMessage.push(sheet2 + outputRow + ':' + dataFunctionName + mustCheckMessage);
    }
    //データファンクションの種類
    if (!type) { 
      errorMessage.push(sheet2 + outputRow + ':' +dataFunctionType + mustCheckMessage);
    }
    //===== 整合性チェック =====
    //データファンクションの種類
    if(type){
      if (type !== write && type !== readOnly) {
        errorMessage.push(sheet2 + outputRow + ':' +dataFunctionType + pullDownCheckMessage);
      }
    }
    //===== 桁数チェック =====
    //ファンクション名
    if (name && name.length > maxDataName) {
      errorMessage.push(sheet2 + outputRow + ':' +dataFunctionName + `は最大${maxDataName}文字で入力してください。`);
    }
    //備考
    if (note && note.length > maxNote) {
      errorMessage.push(sheet2 + outputRow + ':' +noteLabel + `は最大${maxNote}文字で入力してください。`);
    }
  }

  /** ===== 3シート目（トランザクション機能） ===== */
  const ws3 = wb.getWorksheet(3);
  //=====シート存在チェック=====
  if (!ws3) {
    errorMessage.push('シート3が見つかりません');
    return;
  }

  //===== フォーマットチェック =====
  if (ws3.getCell('A2').value?.toString() !== 'No' ||
      ws3.getCell('B2').value?.toString() !== '名称' ||
      ws3.getCell('C2').value?.toString() !== externalInputLabel ||
      ws3.getCell('D2').value?.toString() !== externalOutputLabel ||
      ws3.getCell('E2').value?.toString() !== externalInquiryLabel) {
    errorMessage.push('ファイルの内容が異なるため、インポートに失敗しました。');
    return;
  }

  //各種チェック
  for (let row = startRow; row <= ws3.rowCount; row++) {
    const name = ws3.getCell(`B${row}`).value?.toString();
    const externalInput = ws3.getCell(`C${row}`).value?.toString();
    const externalOutput = ws3.getCell(`D${row}`).value?.toString();
    const externalInquiry = ws3.getCell(`E${row}`).value?.toString();
    const note = ws3.getCell(`G${row}`).value?.toString();
    const outputRow = row - 2
    // トランザクション名と個数がどれもない場合は終了
    if (!name && !externalInput && !externalOutput && !externalInquiry)
      break;

    //===== 必須チェック =====
    if(name){
      if (!externalInput && !externalOutput && !externalInquiry) { 
        //トランザクション名があるが、TF種別がない場合は必須チェックでエラー
        errorMessage.push(sheet3 + outputRow + ':' +transactionFunctionType + mustCheckMessage);
      }
    }
    if (!name) { 
      //TF種別はあるがトランザクション名がない場合は必須チェックでエラー
      errorMessage.push(sheet3 + outputRow + ':' +transactionFunctionName + mustCheckMessage);
    }

    //===== ファンクション名のチェック =====
    //桁数チェック
    if (name && name.length > maxDataName) {
      errorMessage.push(sheet3 + outputRow + ':' +`${transactionFunctionName}は最大${maxDataName}文字で入力してください。`);
    }

    //===== 外部入力に関するチェック =====
    //属性チェック
    if(externalInput){
      if (isNaN(Number(externalInput))) {
        errorMessage.push(sheet3 + outputRow + ':' +externalInputLabel + numberCheckMessage);
      }
    //範囲チェック
      if (Number(externalInput) < min_1 || Number(externalInput) > max_9999) {
        errorMessage.push(sheet3 + outputRow + ':' +externalInputLabel +`は${min_0}～${max_9999}${rangeCheckMessage}`);
      }
    }

    //===== 外部出力に関するチェック =====
    //属性チェック
    if(externalOutput){
      if (isNaN(Number(externalOutput))) {
        errorMessage.push(sheet3 + outputRow + ':' +externalOutputLabel + numberCheckMessage);
      }
    //範囲チェック
      if (Number(externalOutput) < min_1 || Number(externalOutput) > max_9999) {
        errorMessage.push(sheet3 + outputRow + ':' +externalOutputLabel + `は${min_0}～${max_9999}${rangeCheckMessage}`);
      }
    }

    //===== 外部照会に関するチェック =====
    //属性チェック
    if(externalInquiry){
      if (isNaN(Number(externalInquiry))) {
        errorMessage.push(sheet3 + outputRow + ':' +externalInquiryLabel + numberCheckMessage);
      }
    //範囲チェック
      if (Number(externalInquiry) < min_1 || Number(externalInquiry) > max_9999) {
        errorMessage.push(sheet3 + outputRow + ':' +externalInquiryLabel + `は${min_0}～${max_9999}${rangeCheckMessage}`);
      }
    }
    //備考
    if (note && note.length > maxNote) {
      errorMessage.push(sheet2 + outputRow + ':' +noteLabel + `は最大${maxNote}文字で入力してください。`);
    }
  }

  return;
}