import { useState, useCallback, useMemo, useEffect } from 'react';
import { Control, UseFormTrigger, UseFormSetValue, UseFormClearErrors, UseFormWatch, FieldValues } from 'react-hook-form';
import { TFunction } from 'i18next';
import { Checkbox } from '@mui/material';
import FormSection from '@front/components/ui/FormSection';
import TextField from '@front/components/ui/TextField';
import FlexBox from '@front/components/ui/FlexBox';
import Text from '@front/components/ui/Text';

export type Props<T extends FieldValues = any> = {
    control: Control<T>;
    trigger: UseFormTrigger<T>;
    setValue: UseFormSetValue<T>;
    watch: UseFormWatch<T>;
    clearErrors?: UseFormClearErrors<T>;
    t: TFunction<'translation', undefined>;
};

/**
 * 生産性入力フィールド
 */
function ProductivityField<T extends FieldValues = any>(props: Props<T>) {
    const { control, trigger, setValue, watch, clearErrors, t } = props;

    const [autoProductivity, setAutoProductivity] = useState(true);

    // プルダウンの値を監視
    const projectType = watch('projectType' as any) || '新規開発';
    const ipaValueType = watch('ipaValueType' as any) || '中央値';
    const totalFP = watch('totalFP' as any);

    // 生産性を計算する関数
    const getDefaultProductivity = useCallback((projType: string, ipaVal: string, fp: number): number => {
        const safeFP = fp ?? 0;
        
        if (projType === '新規開発' && ipaVal === '中央値') {
            if (safeFP < 400) return 10.5;
            if (safeFP < 1000) return 13.1;
            if (safeFP < 3000) return 9.0;
            return 8.4;
        } else if (projType === '新規開発' && ipaVal === '平均値') {
            if (safeFP < 400) return 11.1;
            if (safeFP < 1000) return 21.2;
            if (safeFP < 3000) return 19.7;
            return 12.9;
        } else if (projType === '改良開発' && ipaVal === '中央値') {
            if (safeFP < 200) return 10.4;
            if (safeFP < 400) return 8.9;
            if (safeFP < 1000) return 12.3;
            return 13.2;
        } else if (projType === '改良開発' && ipaVal === '平均値') {
            if (safeFP < 200) return 18.9;
            if (safeFP < 400) return 14.6;
            if (safeFP < 1000) return 20.6;
            return 20.7;
        } else if (projType === '再開発' && ipaVal === '中央値') {
            if (safeFP < 200) return 20.1;
            if (safeFP < 400) return 20.1;
            if (safeFP < 1000) return 51.5;
            return 18.9;
        } else if (projType === '再開発' && ipaVal === '平均値') {
            if (safeFP < 200) return 37.8;
            if (safeFP < 400) return 37.8;
            if (safeFP < 1000) return 37.8;
            return 39.3;
        } else {
            // デフォルト値（新規開発・中央値と同じ）
            if (safeFP < 400) return 10.5;
            if (safeFP < 1000) return 13.1;
            if (safeFP < 3000) return 9.0;
            return 8.4;
        }
    }, []);

    // 自動入力がONの場合、プルダウンの値またはtotalFPが変わったら自動的に更新
    useEffect(() => {
        if (autoProductivity) {
            const productivity = getDefaultProductivity(projectType, ipaValueType, totalFP);
            setValue('productivityFPPerMonth' as any, productivity as any);
        }
    }, [autoProductivity, projectType, ipaValueType, totalFP, getDefaultProductivity, setValue]);

    // イベントハンドラーをメモ化
    const handleProductivityKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === '-' || e.key === 'e' || e.key === '+') {
            e.preventDefault();
        }
    }, []);

    const handleProductivityBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        if (!isNaN(value)) {
            const formatted = Math.round(value * 10) / 10;
            setValue('productivityFPPerMonth' as any, parseFloat(formatted.toFixed(1)) as any);
            e.target.value = formatted.toFixed(1);
        }
    }, [setValue]);

    const handleCheckboxChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        setAutoProductivity(checked);
        setValue('autoProductivity' as any, checked as any);
        // チェックをONにしたタイミングで現在のtotalFPに基づいた値を設定し、エラーを解除
        if (checked) {
            const productivity = getDefaultProductivity(projectType, ipaValueType, totalFP);
            setValue('productivityFPPerMonth' as any, productivity as any, { shouldValidate: true });
            clearErrors?.('productivityFPPerMonth' as any);
        }
    }, [setValue, clearErrors, getDefaultProductivity, projectType, ipaValueType, totalFP]);

    // スタイルをメモ化
    const productivitySx = useMemo(() => ({
        '& .MuiInputBase-root': { bgcolor: autoProductivity ? '#f5f5f5' : 'white' }
    }), [autoProductivity]);

    const productivitySlotProps = useMemo(() => ({
        htmlInput: {
            min: 0.1,
            step: 0.1,
            onKeyDown: handleProductivityKeyDown,
            onBlur: handleProductivityBlur
        }
    }), [handleProductivityKeyDown, handleProductivityBlur]);

    return (
        <FormSection 
            label="生産性(FP/月)" 
            required
            rightElement={
                <FlexBox>
                    <Checkbox 
                        checked={autoProductivity} 
                        onChange={handleCheckboxChange}
                        size="small"
                        sx={{ p: 0, mr: 0.5 }}
                    />
                    <Text variant="label">自動入力</Text>
                </FlexBox>
            }
        >
            <TextField 
                name={"productivityFPPerMonth" as any}
                control={control} 
                trigger={trigger} 
                t={t} 
                type="number" 
                hideHelperText 
                disabled={autoProductivity}
                slotProps={productivitySlotProps}
                sx={productivitySx}
            />
        </FormSection>
    );
}

export default ProductivityField;
