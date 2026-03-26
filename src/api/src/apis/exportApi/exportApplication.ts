import { ExportApplication200Response } from '@quote-calc-system/models';
// import { exportApplication200Response, exportApplicationRequest } from '@quote-calc-system/models';

import * as ExportApi from './types';
import * as Excel from 'exceljs';

export const exportApplication: ExportApi.exportApplication = async ({
  exportApplicationRequest = {},
}) => {
  const exportResult = '見積算出結果';
  const underScore  ='_';
  const xlsx = '.xlsx';

const projectTypeLabelMap: Record<string, string> = {
  N: '新規開発',
  E: '改良開発',
  R: '再開発',
};

const ipaValueTypeLabelMap: Record<string, string> = {
  M: '中央値',
  A: '平均値',
};

const updateTypeLabelMap: Record<string, string> = {
  I: '内部論理ファイル',
  E: '外部インターフェースファイル',
}


  const owb = new Excel.Workbook();
  await owb.xlsx.readFile('templates/template.xlsx');
  const ows = owb.getWorksheet(1) // 1番目のシートを取得;
  if (!ows) throw new Error('シートが見つかりません');
  // 共通項目シート
  ows.getCell(`C2`).value = exportApplicationRequest.projectName || '';
  ows.getCell(`C4`).value = exportApplicationRequest.productivityFPPerMonth || '';
  ows.getCell(`C5`).value = projectTypeLabelMap[exportApplicationRequest.projectType ?? ''] ?? '';
  ows.getCell(`C6`).value = ipaValueTypeLabelMap[exportApplicationRequest.ipaValueType ?? ''] ?? '';
  ows.getCell(`C7`).value = exportApplicationRequest.totalFP || 0;
  ows.getCell(`C8`).value = exportApplicationRequest.totalManMonths || 0;
  ows.getCell(`C9`).value = exportApplicationRequest.standardDurationMonths || 0;
  
  ows.getCell(`C12`).value = exportApplicationRequest.displayedProcessRatios?.basicDesign || 0;
  ows.getCell(`D12`).value = exportApplicationRequest.displayedProcessRatios?.detailedDesign || 0;
  ows.getCell(`E12`).value = exportApplicationRequest.displayedProcessRatios?.implementation || 0;
  ows.getCell(`F12`).value = exportApplicationRequest.displayedProcessRatios?.integrationTest || 0;
  ows.getCell(`G12`).value = exportApplicationRequest.displayedProcessRatios?.systemTest || 0;
  
  ows.getCell(`C13`).value = exportApplicationRequest.processFPs?.basicDesign || 0;
  ows.getCell(`D13`).value = exportApplicationRequest.processFPs?.detailedDesign || 0;
  ows.getCell(`E13`).value = exportApplicationRequest.processFPs?.implementation || 0;
  ows.getCell(`F13`).value = exportApplicationRequest.processFPs?.integrationTest || 0;
  ows.getCell(`G13`).value = exportApplicationRequest.processFPs?.systemTest || 0;  
  
  ows.getCell(`C14`).value = exportApplicationRequest.processManMonths?.basicDesign || 0;
  ows.getCell(`D14`).value = exportApplicationRequest.processManMonths?.detailedDesign || 0;
  ows.getCell(`E14`).value = exportApplicationRequest.processManMonths?.implementation || 0;
  ows.getCell(`F14`).value = exportApplicationRequest.processManMonths?.integrationTest || 0;
  ows.getCell(`G14`).value = exportApplicationRequest.processManMonths?.systemTest || 0;  
  
  ows.getCell(`C15`).value = exportApplicationRequest.processDurations?.basicDesign || 0;
  ows.getCell(`D15`).value = exportApplicationRequest.processDurations?.detailedDesign || 0;
  ows.getCell(`E15`).value = exportApplicationRequest.processDurations?.implementation || 0;
  ows.getCell(`F15`).value = exportApplicationRequest.processDurations?.integrationTest || 0;
  ows.getCell(`G15`).value = exportApplicationRequest.processDurations?.systemTest || 0; 

  const dws = owb.getWorksheet(2) // 2番目のシートを取得;
  const dataStartRow = 3;
  const dataFunctions = exportApplicationRequest.dataFunctions ?? [];

  // 画面で入力された内容とpropertyに格納
  dataFunctions.forEach((row, index) => {
    if (!dws) return;
    const excelRow = dataStartRow + index;
      dws.getCell(`B${excelRow}`).value = dataFunctions?.[index]?.name || '';
      dws.getCell(`C${excelRow}`).value = updateTypeLabelMap[dataFunctions?.[index]?.updateType ?? ''] ?? '';;
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

 const currentDate = new Date()
  .toLocaleString("ja-JP", {timeZone: "Asia/Tokyo",
    year: "numeric",    month: "2-digit",    day: "2-digit",
    hour: "2-digit",    minute: "2-digit",    second: "2-digit"
  })
  .replace(/\//g, "")
  .replace(/:/g, "")
  .replace(/ /g, "");

  const prjName = exportApplicationRequest.projectName;

  let fileName = 'exportApplication.xlsx';
  fileName =  exportResult + underScore + prjName + 
              underScore + currentDate + xlsx;

  // content = Buffer.from(buffer).toString('base64');

  const response = new ExportApplication200Response();
  response.exportFile = {
    name: fileName,
    content: base64,
  };

  return response;
};



