import { ExportTestApplication200Response } from '@quote-calc-system/models';
// import { ExportTestApplication200Response, ExportTestApplicationRequest } from '@quote-calc-system/models';

import * as ExportApi from './types';
import * as Excel from 'exceljs';

export const exportTestApplication: ExportApi.exportTestApplication = async ({
  exportTestApplicationRequest = {},
}) => {
  
  const owb = new Excel.Workbook();
  await owb.xlsx.readFile('templates/sample.xlsx');
  const ows = owb.getWorksheet(1) // 1番目のシートを取得;
  if (!ows) throw new Error('シートが見つかりません');
  // 共通項目シート
  ows.getCell(`C2`).value = exportTestApplicationRequest.projectName || '';
  ows.getCell(`C4`).value = exportTestApplicationRequest.productivityFPPerMonth || '';
  ows.getCell(`C5`).value = exportTestApplicationRequest.projectType || '';
  ows.getCell(`C6`).value = exportTestApplicationRequest.ipaValueType || 0;
  ows.getCell(`C7`).value = exportTestApplicationRequest.totalFP || 0;
  ows.getCell(`C8`).value = exportTestApplicationRequest.totalManMonths || 0;
  ows.getCell(`C9`).value = exportTestApplicationRequest.standardDurationMonths || 0;
  
  ows.getCell(`C12`).value = exportTestApplicationRequest.processRatios?.basicDesign || 0;
  ows.getCell(`D12`).value = exportTestApplicationRequest.processRatios?.detailedDesign || 0;
  ows.getCell(`E12`).value = exportTestApplicationRequest.processRatios?.implementation || 0;
  ows.getCell(`F12`).value = exportTestApplicationRequest.processRatios?.integrationTest || 0;
  ows.getCell(`G12`).value = exportTestApplicationRequest.processRatios?.systemTest || 0;
  
  ows.getCell(`C13`).value = exportTestApplicationRequest.processManMonths?.basicDesign || 0;
  ows.getCell(`D13`).value = exportTestApplicationRequest.processManMonths?.detailedDesign || 0;
  ows.getCell(`E13`).value = exportTestApplicationRequest.processManMonths?.implementation || 0;
  ows.getCell(`F13`).value = exportTestApplicationRequest.processManMonths?.integrationTest || 0;
  ows.getCell(`G13`).value = exportTestApplicationRequest.processManMonths?.systemTest || 0;  
  
  ows.getCell(`C14`).value = exportTestApplicationRequest.processDurations?.basicDesign || 0;
  ows.getCell(`D14`).value = exportTestApplicationRequest.processDurations?.detailedDesign || 0;
  ows.getCell(`E14`).value = exportTestApplicationRequest.processDurations?.implementation || 0;
  ows.getCell(`F14`).value = exportTestApplicationRequest.processDurations?.integrationTest || 0;
  ows.getCell(`G14`).value = exportTestApplicationRequest.processDurations?.systemTest || 0; 

  const dws = owb.getWorksheet(2) // 2番目のシートを取得;
  const dataStartRow = 3;
  const dataFunctions = exportTestApplicationRequest.dataFunctions ?? [];

  // 画面で入力された内容とpropertyに格納
  dataFunctions.forEach((row, index) => {
    if (!dws) return;
    const excelRow = dataStartRow + index;

      dws.getCell(`B${excelRow}`).value = dataFunctions?.[index]?.name || '';
      dws.getCell(`C${excelRow}`).value = dataFunctions?.[index]?.updateType || '';
      dws.getCell(`D${excelRow}`).value = dataFunctions?.[index]?.fpValue || '';
      dws.getCell(`E${excelRow}`).value = dataFunctions?.[index]?.remarks || '';
  });

  const tws = owb.getWorksheet(3) // 3番目のシートを取得;
  const transactionFunctions = exportTestApplicationRequest.transactionFunctions ?? [];

  // 画面で入力された内容とpropertyに格納
  transactionFunctions.forEach((row, index) => {
    if (!tws) return;
    const excelRow = dataStartRow + index;

      tws.getCell(`B${excelRow}`).value = transactionFunctions?.[index]?.name || '';
      tws.getCell(`C${excelRow}`).value = transactionFunctions?.[index]?.externalInput || '';
      tws.getCell(`D${excelRow}`).value = transactionFunctions?.[index]?.externalOutput || '';
      tws.getCell(`E${excelRow}`).value = transactionFunctions?.[index]?.externalInquiry || '';
      tws.getCell(`F${excelRow}`).value = transactionFunctions?.[index]?.fpValue || '';
      tws.getCell(`G${excelRow}`).value = transactionFunctions?.[index]?.remarks || '';

    });

  // Excel → Buffer → Base64
  // let content: Buffer | undefined;
  const buffer = await owb.xlsx.writeBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  // const base64 = Buffer.from(buffer).toStrisng('base64');

  let fileName = 'exportTestApplication.xlsx';
  fileName = 'テストエクスポート.xlsx';

  // content = Buffer.from(buffer).toString('base64');

  const response = new ExportTestApplication200Response();
  response.exportFile = {
    name: fileName,
    content: base64,
  };

  return response;
};



