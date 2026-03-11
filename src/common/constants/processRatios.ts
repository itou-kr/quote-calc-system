import { CalcTestApplicationRequest } from '../../api/src/models/calcTestApplicationRequest';

/**
 * 工程別比率の定数定義
 * 案件種別とIPA代表値に基づく工程別比率のマスタデータ
 */

export type ProcessRatios = {
    basicDesign: number;
    detailedDesign: number;
    implementation: number;
    integrationTest: number;
    systemTest: number;
};

/**
 * 工程別比率マスタデータ
 */
export const PROCESS_RATIOS_MASTER: Record<CalcTestApplicationRequest.ProjectTypeEnum, Record<CalcTestApplicationRequest.IpaValueTypeEnum, ProcessRatios>> = {
    [CalcTestApplicationRequest.ProjectTypeEnum.NEW]: {
        [CalcTestApplicationRequest.IpaValueTypeEnum.MEDIAN]: {
            basicDesign: 0.205,
            detailedDesign: 0.181,
            implementation: 0.241,
            integrationTest: 0.191,
            systemTest: 0.182,
        },
        [CalcTestApplicationRequest.IpaValueTypeEnum.AVERAGE]: {
            basicDesign: 0.207,
            detailedDesign: 0.175,
            implementation: 0.249,
            integrationTest: 0.193,
            systemTest: 0.176,
        },
    },
    [CalcTestApplicationRequest.ProjectTypeEnum.ENHANCEMENT]: {
        [CalcTestApplicationRequest.IpaValueTypeEnum.MEDIAN]: {
            basicDesign: 0.216,
            detailedDesign: 0.185,
            implementation: 0.243,
            integrationTest: 0.193,
            systemTest: 0.163,
        },
        [CalcTestApplicationRequest.IpaValueTypeEnum.AVERAGE]: {
            basicDesign: 0.216,
            detailedDesign: 0.176,
            implementation: 0.244,
            integrationTest: 0.190,
            systemTest: 0.174,
        },
    },
    [CalcTestApplicationRequest.ProjectTypeEnum.REDEVELOPMENT]: {
        [CalcTestApplicationRequest.IpaValueTypeEnum.MEDIAN]: {
            basicDesign: 0.195,
            detailedDesign: 0.161,
            implementation: 0.277,
            integrationTest: 0.193,
            systemTest: 0.174,
        },
        [CalcTestApplicationRequest.IpaValueTypeEnum.AVERAGE]: {
            basicDesign: 0.188,
            detailedDesign: 0.158,
            implementation: 0.271,
            integrationTest: 0.208,
            systemTest: 0.175,
        },
    },
};

/**
 * デフォルトの工程別比率（新規開発・中央値）
 */
export const DEFAULT_PROCESS_RATIOS: ProcessRatios = PROCESS_RATIOS_MASTER[CalcTestApplicationRequest.ProjectTypeEnum.NEW][CalcTestApplicationRequest.IpaValueTypeEnum.MEDIAN];

/**
 * 工程別比率を取得する関数
 * @param projectType 案件種別
 * @param ipaValueType 使用するIPA代表値
 * @returns 工程別比率
 */
export const getProcessRatios = (projectType: CalcTestApplicationRequest.ProjectTypeEnum, ipaValueType: CalcTestApplicationRequest.IpaValueTypeEnum): ProcessRatios => {
    // 型安全性を確保しつつ、未知の値の場合はデフォルトを返す
    if (projectType in PROCESS_RATIOS_MASTER && ipaValueType in PROCESS_RATIOS_MASTER[projectType]) {
        return PROCESS_RATIOS_MASTER[projectType][ipaValueType];
    }
    return DEFAULT_PROCESS_RATIOS;
};
