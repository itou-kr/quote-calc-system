import { ExportApplication200Response } from '@quote-calc-system/models';
// import { exportApplication200Response, exportApplicationRequest } from '@quote-calc-system/models';

import * as ExportApi from './types';
import * as Excel from 'exceljs';

export const exportApplication: ExportApi.exportApplication = async ({
  exportApplicationRequest = {},
}) => {
  
  const owb = new Excel.Workbook();
  await owb.xlsx.readFile('templates/sample.xlsx');
  const ows = owb.getWorksheet(1) // 1番目のシートを取得;
  if (!ows) throw new Error('シートが見つかりません');
  // 共通項目シート
  ows.getCell(`C2`).value = exportApplicationRequest.projectName || '';
  ows.getCell(`C4`).value = exportApplicationRequest.productivityFPPerMonth || '';
  ows.getCell(`C5`).value = exportApplicationRequest.projectType || '';
  ows.getCell(`C6`).value = exportApplicationRequest.ipaValueType || 0;
  ows.getCell(`C7`).value = exportApplicationRequest.totalFP || 0;
  ows.getCell(`C8`).value = exportApplicationRequest.totalManMonths || 0;
  ows.getCell(`C9`).value = exportApplicationRequest.standardDurationMonths || 0;
  
  ows.getCell(`C12`).value = exportApplicationRequest.processRatios?.basicDesign || 0;
  ows.getCell(`D12`).value = exportApplicationRequest.processRatios?.detailedDesign || 0;
  ows.getCell(`E12`).value = exportApplicationRequest.processRatios?.implementation || 0;
  ows.getCell(`F12`).value = exportApplicationRequest.processRatios?.integrationTest || 0;
  ows.getCell(`G12`).value = exportApplicationRequest.processRatios?.systemTest || 0;
  
  ows.getCell(`C13`).value = exportApplicationRequest.processManMonths?.basicDesign || 0;
  ows.getCell(`D13`).value = exportApplicationRequest.processManMonths?.detailedDesign || 0;
  ows.getCell(`E13`).value = exportApplicationRequest.processManMonths?.implementation || 0;
  ows.getCell(`F13`).value = exportApplicationRequest.processManMonths?.integrationTest || 0;
  ows.getCell(`G13`).value = exportApplicationRequest.processManMonths?.systemTest || 0;  
  
  ows.getCell(`C14`).value = exportApplicationRequest.processDurations?.basicDesign || 0;
  ows.getCell(`D14`).value = exportApplicationRequest.processDurations?.detailedDesign || 0;
  ows.getCell(`E14`).value = exportApplicationRequest.processDurations?.implementation || 0;
  ows.getCell(`F14`).value = exportApplicationRequest.processDurations?.integrationTest || 0;
  ows.getCell(`G14`).value = exportApplicationRequest.processDurations?.systemTest || 0; 

  const dws = owb.getWorksheet(2) // 2番目のシートを取得;
  const dataStartRow = 3;
  const dataFunctions = exportApplicationRequest.dataFunctions ?? [];

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
  const transactionFunctions = exportApplicationRequest.transactionFunctions ?? [];

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

  let fileName = 'exportApplication.xlsx';
  fileName = 'テストエクスポート.xlsx';

  // content = Buffer.from(buffer).toString('base64');

  const response = new ExportApplication200Response();
  response.exportFile = {
    name: fileName,
    content: base64,
  };

  return response;
};



