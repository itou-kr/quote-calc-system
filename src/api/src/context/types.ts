import { Logger } from '@quote-calc-system/commons/logger';

/**
 * APIコンテキスト
 */
export type ApiContext = {
    // ログ出力オブジェクト
    readonly logger: Logger;
};