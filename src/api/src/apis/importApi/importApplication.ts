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
  /** ===== 1シート目（共通項目） ===== */
  const ws1 = wb.getWorksheet(1);
  if (!ws1) {
    errorMessage.push('シート1が見つかりません');
    return;
  }
}