import { useCallback } from 'react';
import { UseFormGetValues, FieldValues } from 'react-hook-form';

type DataFunctionErrors = Record<number, { name: boolean; updateType: boolean }>;
type TransactionFunctionErrors = Record<number, { name: boolean; externalInput: boolean; externalOutput: boolean; externalInquiry: boolean }>;

export const useFunctionValidation = <T extends FieldValues>(
    getValues: UseFormGetValues<T>,
    setDataFunctionErrors: (errors: DataFunctionErrors) => void,
    setTransactionFunctionErrors: (errors: TransactionFunctionErrors) => void
) => {
    /** ▼ データファンクションのバリデーション */
    const validateDataFunctions = useCallback(() => {
        const currentDataFunctions = getValues('dataFunctions' as any);
        const errors: DataFunctionErrors = {};
        
        if (currentDataFunctions) {
            currentDataFunctions.forEach((item: any, index: number) => {
                const hasName = item.name && item.name.trim() !== '';
                const hasSelection = item.updateType && item.updateType !== '';
                
                // エラー条件1: 名称欄が入力されているかつ、プルダウンの選択がデフォルト値
                // エラー条件2: 名称欄が未入力かつ、プルダウンで何かしらの値が選択されている
                if ((hasName && !hasSelection) || (!hasName && hasSelection)) {
                    errors[index] = {
                        name: Boolean(!hasName && hasSelection),
                        updateType: Boolean(hasName && !hasSelection),
                    };
                }
            });
        }
        
        setDataFunctionErrors(errors);
        return Object.keys(errors).length === 0;
    }, [getValues, setDataFunctionErrors]);

    /** ▼ トランザクションファンクションのバリデーション */
    const validateTransactionFunctions = useCallback(() => {
        const currentTransactionFunctions = getValues('transactionFunctions' as any);
        const errors: TransactionFunctionErrors = {};
        
        if (currentTransactionFunctions) {
            currentTransactionFunctions.forEach((item: any, index: number) => {
                const hasName = item.name && item.name.trim() !== '';
                const inputValue = item.externalInput;
                const outputValue = item.externalOutput;
                const inquiryValue = item.externalInquiry;
                
                // 真の未入力判定（空文字列、null、undefinedのみ）
                const isInputReallyEmpty = inputValue === undefined || inputValue === null || String(inputValue).trim() === '';
                const isOutputReallyEmpty = outputValue === undefined || outputValue === null || String(outputValue).trim() === '';
                const isInquiryReallyEmpty = inquiryValue === undefined || inquiryValue === null || String(inquiryValue).trim() === '';
                
                // 1以上の値があるかチェック
                const hasInputValue = !isInputReallyEmpty && Number(inputValue) > 0;
                const hasOutputValue = !isOutputReallyEmpty && Number(outputValue) > 0;
                const hasInquiryValue = !isInquiryReallyEmpty && Number(inquiryValue) > 0;
                
                const hasAnyTF = hasInputValue || hasOutputValue || hasInquiryValue;
                const allTFReallyEmpty = isInputReallyEmpty && isOutputReallyEmpty && isInquiryReallyEmpty;
                
                // エラー条件1: 名称が未入力かつ、TFのいずれかの個数が1以上
                // エラー条件2: 名称が入力されているかつ、TFすべてが真に未入力
                if ((!hasName && hasAnyTF) || (hasName && allTFReallyEmpty)) {
                    errors[index] = {
                        name: Boolean(!hasName && hasAnyTF),
                        externalInput: Boolean(hasName && allTFReallyEmpty),
                        externalOutput: Boolean(hasName && allTFReallyEmpty),
                        externalInquiry: Boolean(hasName && allTFReallyEmpty),
                    };
                }
            });
        }
        
        setTransactionFunctionErrors(errors);
        return Object.keys(errors).length === 0;
    }, [getValues, setTransactionFunctionErrors]);

    return {
        validateDataFunctions,
        validateTransactionFunctions,
    };
};
