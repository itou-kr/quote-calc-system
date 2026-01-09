import { ExportTestApplication200Response } from '@quote-calc-system/models';
// import { ExportTestApplication200Response, ExportTestApplicationRequest } from '@quote-calc-system/models';

import * as ExportApi from './types';
import * as Excel from 'exceljs';

// const dataStartRow = 2;

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


  
  // const dataFunctions = exportTestApplicationRequest.standardDurationMonths ?? [];


  // 画面で入力された内容とpropertyに格納
  // dataFunctions.forEach((row, index) => {
  //   if (!ows) return;
  //   const excelRow = dataStartRow + index;

  //     ows.getCell(`A${excelRow}`).value = dataFunctions?.[index]?.name || '';
  //     ows.getCell(`B${excelRow}`).value = dataFunctions?.[index]?.updateType || '';
  //     ows.getCell(`C${excelRow}`).value = dataFunctions?.[index]?.fpValue || '';
  //     ows.getCell(`D${excelRow}`).value = dataFunctions?.[index]?.remarks || '';
  //     ows.getCell(`E${excelRow}`).value = dataFunctions?.[index]?.selected || false;
  //   // return true;
  // }
// );

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



