/**
 * 生産性マスターデータ
 * 案件種別とIPA代表値の組み合わせごとに、FP範囲に応じた生産性を定義
 */

export type ProjectType = '新規開発' | '改良開発' | '再開発';
export type IpaValueType = '中央値' | '平均値';

export type ProductivityRange = {
  /** FP範囲の最小値（未指定の場合は0） */
  minFP?: number;
  /** FP範囲の最大値（未指定の場合は無限大） */
  maxFP?: number;
  /** 生産性（FP/月） */
  productivity: number;
};

/**
 * 生産性マスターデータ
 * 案件種別 × IPA代表値 × FP範囲ごとの生産性を定義
 */
export const PRODUCTIVITY_MASTER: Record<ProjectType, Record<IpaValueType, ProductivityRange[]>> = {
  新規開発: {
    中央値: [
      { maxFP: 400, productivity: 10 },
      { minFP: 400, maxFP: 1000, productivity: 13 },
      { minFP: 1000, maxFP: 3000, productivity: 9 },
      { minFP: 3000, productivity: 8 },
    ],
    平均値: [
      { maxFP: 400, productivity: 11 },
      { minFP: 400, maxFP: 1000, productivity: 21 },
      { minFP: 1000, maxFP: 3000, productivity: 19 },
      { minFP: 3000, productivity: 12 },
    ],
  },
  改良開発: {
    中央値: [
      { maxFP: 200, productivity: 10 },
      { minFP: 200, maxFP: 400, productivity: 9 },
      { minFP: 400, maxFP: 1000, productivity: 12 },
      { minFP: 1000, productivity: 13 },
    ],
    平均値: [
      { maxFP: 200, productivity: 18 },                 // データ無のため、全体の平均値を採用
      { minFP: 200, maxFP: 400, productivity: 14 },
      { minFP: 400, maxFP: 1000, productivity: 20 },
      { minFP: 1000, productivity: 20 },
    ],
  },
  再開発: {
    中央値: [
      { maxFP: 200, productivity: 20 },                 // データ無のため、全体の中央値を採用
      { minFP: 200, maxFP: 400, productivity: 20 },     // データ無のため、全体の中央値を採用
      { minFP: 400, maxFP: 1000, productivity: 51 },
      { minFP: 1000, productivity: 18 },
    ],
    平均値: [
      { maxFP: 200, productivity: 37 },                 // データ無のため、全体の平均値を採用
      { minFP: 200, maxFP: 400, productivity: 37 },     // データ無のため、全体の平均値を採用
      { minFP: 400, maxFP: 1000, productivity: 37 },    // データ無のため、全体の平均値を採用
      { minFP: 1000, productivity: 39 },
    ],
  },
};

/**
 * デフォルトの生産性（新規開発・中央値と同じ）
 */
export const DEFAULT_PRODUCTIVITY_RANGES = PRODUCTIVITY_MASTER['新規開発']['中央値'];

/**
 * 案件種別、IPA代表値、総FPから生産性を取得
 * @param projectType 案件種別
 * @param ipaValueType IPA代表値
 * @param totalFP 総FP
 * @returns 生産性（FP/月）
 */
export const getProductivity = (projectType: string, ipaValueType: string, totalFP: number): number => {
  const safeFP = totalFP ?? 0;
  const ranges = PRODUCTIVITY_MASTER[projectType as ProjectType]?.[ipaValueType as IpaValueType] 
    || DEFAULT_PRODUCTIVITY_RANGES;

  for (const range of ranges) {
    const minFP = range.minFP ?? 0;
    const maxFP = range.maxFP ?? Infinity;
    
    if (safeFP >= minFP && safeFP < maxFP) {
      return range.productivity;
    }
  }

  // フォールバック（通常は到達しない）
  return ranges[ranges.length - 1].productivity;
};
