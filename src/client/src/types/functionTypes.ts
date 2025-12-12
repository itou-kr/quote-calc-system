/**
 * データファンクションの型定義
 */
export type DataFunction = {
    selected: boolean;
    name: string;
    updateType: string;
    fpValue: number;
    remarks: string;
};

/**
 * トランザクションファンクションの型定義
 */
export type TransactionFunction = {
    selected: boolean;
    name: string;
    externalInput: number;
    externalOutput: number;
    externalInquiry: number;
    fpValue: number;
    remarks: string;
};

/**
 * 空のデータファンクションオブジェクトを生成
 */
export const createEmptyDataFunction = (): DataFunction => ({
    selected: false,
    name: '',
    updateType: '',
    fpValue: 0,
    remarks: '',
});

/**
 * 空のトランザクションファンクションオブジェクトを生成
 */
export const createEmptyTransactionFunction = (): TransactionFunction => ({
    selected: false,
    name: '',
    externalInput: 0,
    externalOutput: 0,
    externalInquiry: 0,
    fpValue: 0,
    remarks: '',
});

/**
 * 指定数の空データファンクション配列を生成
 * @param count - 生成する行数
 */
export const createDataFunctions = (count: number): DataFunction[] => 
    Array.from({ length: count }, createEmptyDataFunction);

/**
 * 指定数の空トランザクションファンクション配列を生成
 * @param count - 生成する行数
 */
export const createTransactionFunctions = (count: number): TransactionFunction[] => 
    Array.from({ length: count }, createEmptyTransactionFunction);
