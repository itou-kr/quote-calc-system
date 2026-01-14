import * as yup from 'yup';

export const CalcModelScheme = yup.object({
    /** 案件名 */
    projectName: yup.string(),
    /** 生産性(FP/月) */
    productivityFPPerMonth: yup.number(),
    /** 案件種別*/
    projectType: yup.string(),
    /** 使用するIPA代表値*/
    ipaValueType: yup.string(),
    /** 総FP */
    totalFP: yup.number(),
    /** 総工数(人月) */
    totalManMonths: yup.number(),
    /** 標準工期(月) */
    standardDurationMonths: yup.number(),
    /** 工程別比率 */
    processRatios: yup
    .object({
        basicDesign: yup.number(),
        detailedDesign: yup.number(),
        implementation: yup.number(),
        integrationTest: yup.number(),
        systemTest: yup.number(),
    }),
    /** 工程別工数 */
    processManMonths: yup
    .object({
        basicDesign: yup.number(),
        detailedDesign: yup.number(),
        implementation: yup.number(),
        integrationTest: yup.number(),
        systemTest: yup.number(),
    }),
    /** 工程別工期 */
    processDurations: yup
    .object({
        basicDesign: yup.number(),
        detailedDesign: yup.number(),
        implementation: yup.number(),
        integrationTest: yup.number(),
        systemTest: yup.number(),
    }),
    /** データファンクション情報 */
    dataFunctions: yup.array().of(
        yup.object({
            selected: yup.boolean(),
            name: yup.string(),
            updateType: yup.string(),
            fpValue: yup.number(),
            remarks: yup.string(),
        })
    ),
    // トランザクションファンクション情報
    transactionFunctions: yup.array().of(
        yup.object({
            selected: yup.boolean(),
            name: yup.string(),
            externalInput: yup.number(),
            externalOutput: yup.number(),
            externalInquiry: yup.number(),
            fpValue: yup.number(),
            remarks: yup.string(),
        })
    ),
});

export type CalcModel = yup.InferType<typeof CalcModelScheme>;