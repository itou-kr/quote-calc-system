import { useCallback } from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { FormType } from '@front/components/pages/CALC/form/CalcForm/CalcForm';

/**
 * 工程別内訳データの型定義
 */
export type ProcessBreakdown = {
    basicDesign: { manMonths: number; duration: number };
    detailedDesign: { manMonths: number; duration: number };
    implementation: { manMonths: number; duration: number };
    integrationTest: { manMonths: number; duration: number };
    systemTest: { manMonths: number; duration: number };
};

/**
 * Excel出力用フック
 */
export const useExportExcel = () => {
    /**
     * 日付フォーマット関数
     * @returns YYYYMMDD_HHmmss形式の文字列
     */
    const formatDate = (): string => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        return `${year}${month}${day}_${hours}${minutes}${seconds}`;
    };

    /**
     * Excel出力処理
     * @param formData フォームデータ
     * @param totalFP 総FP
     * @param manMonths 総工数
     * @param standardDuration 標準工期
     * @param processBreakdown 工程別内訳データ
     */
    const exportToExcel = useCallback(async (
        formData: FormType,
        totalFP: number,
        manMonths: number,
        standardDuration: number,
        processBreakdown?: ProcessBreakdown
    ) => {
        try {
            // 案件名が未入力の場合はエラー
            if (!formData.projectName || formData.projectName.trim() === '') {
                throw new Error('案件名を入力してください');
            }

            const workbook = new ExcelJS.Workbook();
            workbook.creator = '見積作成支援ツール';
            workbook.created = new Date();

            // ===== シート1: 案件情報 =====
            const sheet1 = workbook.addWorksheet('案件情報');
            sheet1.columns = [
                { key: 'item', width: 30 },
                { key: 'value', width: 30 }
            ];

            // ヘッダー行のスタイル設定
            const headerRow = sheet1.addRow(['項目', '値']);
            headerRow.font = { bold: true, size: 12 };
            headerRow.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFD9E1F2' }
            };
            headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

            // データ行の追加
            sheet1.addRow(['案件名', formData.projectName]);
            sheet1.addRow(['生産性(FP/月)', formData.productivityFPPerMonth]);
            sheet1.addRow(['案件種別', formData.projectType]);
            sheet1.addRow(['使用するIPA代表値', formData.ipaValueType]);

            // 全ての行に罫線を設定
            sheet1.eachRow((row) => {
                row.eachCell((cell) => {
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                });
            });

            // ===== シート2: 計算結果サマリー =====
            const sheet2 = workbook.addWorksheet('計算結果サマリー');
            sheet2.columns = [
                { key: 'item', width: 30 },
                { key: 'value', width: 30 }
            ];

            const summaryHeader = sheet2.addRow(['項目', '値']);
            summaryHeader.font = { bold: true, size: 12 };
            summaryHeader.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFD9E1F2' }
            };
            summaryHeader.alignment = { vertical: 'middle', horizontal: 'center' };

            sheet2.addRow(['総FP', totalFP]);
            sheet2.addRow(['総工数(人月)', manMonths]);
            sheet2.addRow(['標準工期(月)', standardDuration]);

            sheet2.eachRow((row) => {
                row.eachCell((cell) => {
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                });
            });

            // ===== シート3: データファンクション =====
            const sheet3 = workbook.addWorksheet('データファンクション');
            sheet3.columns = [
                { key: 'no', width: 10 },
                { key: 'name', width: 40 },
                { key: 'type', width: 30 },
                { key: 'fp', width: 15 },
                { key: 'remarks', width: 50 }
            ];

            const dataHeader = sheet3.addRow(['No.', '名称', 'データファンクションの種類', 'FP', '備考']);
            dataHeader.font = { bold: true, size: 12 };
            dataHeader.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFD9E1F2' }
            };
            dataHeader.alignment = { vertical: 'middle', horizontal: 'center' };

            // FPが0より大きい行のみ出力
            formData.dataFunctions
                ?.filter(f => f.name && f.name.trim() !== '' && (f.fpValue ?? 0) > 0)
                .forEach((f, index) => {
                    sheet3.addRow({
                        no: index + 1,
                        name: f.name,
                        type: f.updateType,
                        fp: f.fpValue,
                        remarks: f.remarks
                    });
                });

            sheet3.eachRow((row) => {
                row.eachCell((cell) => {
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                });
            });

            // ===== シート4: トランザクションファンクション =====
            const sheet4 = workbook.addWorksheet('トランザクションファンクション');
            sheet4.columns = [
                { key: 'no', width: 10 },
                { key: 'name', width: 40 },
                { key: 'externalInput', width: 15 },
                { key: 'externalOutput', width: 15 },
                { key: 'externalInquiry', width: 15 },
                { key: 'fp', width: 15 },
                { key: 'remarks', width: 50 }
            ];

            const transactionHeader = sheet4.addRow(['No.', '名称', '外部入力', '外部出力', '外部照会', 'FP', '備考']);
            transactionHeader.font = { bold: true, size: 12 };
            transactionHeader.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFD9E1F2' }
            };
            transactionHeader.alignment = { vertical: 'middle', horizontal: 'center' };

            // FPが0より大きい行のみ出力
            formData.transactionFunctions
                ?.filter(f => f.name && f.name.trim() !== '' && (f.fpValue ?? 0) > 0)
                .forEach((f, index) => {
                    sheet4.addRow({
                        no: index + 1,
                        name: f.name,
                        externalInput: f.externalInput,
                        externalOutput: f.externalOutput,
                        externalInquiry: f.externalInquiry,
                        fp: f.fpValue,
                        remarks: f.remarks
                    });
                });

            sheet4.eachRow((row) => {
                row.eachCell((cell) => {
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                });
            });

            // ===== シート5: 工程別内訳 =====
            if (processBreakdown) {
                const sheet5 = workbook.addWorksheet('工程別内訳');
                sheet5.columns = [
                    { key: 'process', width: 30 },
                    { key: 'manMonths', width: 20 },
                    { key: 'duration', width: 20 }
                ];

                const processHeader = sheet5.addRow(['工程', '工数(人月)', '工期(月)']);
                processHeader.font = { bold: true, size: 12 };
                processHeader.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFD9E1F2' }
                };
                processHeader.alignment = { vertical: 'middle', horizontal: 'center' };

                sheet5.addRow(['基本設計', processBreakdown.basicDesign.manMonths, processBreakdown.basicDesign.duration]);
                sheet5.addRow(['詳細設計', processBreakdown.detailedDesign.manMonths, processBreakdown.detailedDesign.duration]);
                sheet5.addRow(['実装', processBreakdown.implementation.manMonths, processBreakdown.implementation.duration]);
                sheet5.addRow(['結合テスト', processBreakdown.integrationTest.manMonths, processBreakdown.integrationTest.duration]);
                sheet5.addRow(['総合テスト', processBreakdown.systemTest.manMonths, processBreakdown.systemTest.duration]);

                sheet5.eachRow((row) => {
                    row.eachCell((cell) => {
                        cell.border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                    });
                });
            }

            // ファイル生成・ダウンロード
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            
            const fileName = `見積_${formData.projectName}_${formatDate()}.xlsx`;
            saveAs(blob, fileName);

        } catch (error) {
            // エラーハンドリング
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Excelファイルの生成中にエラーが発生しました');
        }
    }, []);

    return { exportToExcel };
};
