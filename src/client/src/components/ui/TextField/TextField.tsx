import { useEffect, useRef } from 'react';
import { Controller, Control, FieldValues, FieldPath, UseFormTrigger } from 'react-hook-form';
import { TFunction } from 'i18next';
import { TextFieldProps as MuiTextFieldProps } from '@mui/material/TextField';

import { HookFormRenderProps } from '@front/types';
import StyledTextField from '@front/components/styles/StyledTextField';

type RenderProps<T extends FieldValues = FieldValues, N extends FieldPath<T> = FieldPath<T>> = {
    id?: string;
    type?: MuiTextFieldProps['type'];
    label?: MuiTextFieldProps['label'];
    variant?: MuiTextFieldProps['variant'];
    disabled?: boolean;
    required?: boolean;
    readOnly?: boolean;
    multiline?: boolean;
    multilineRowsAuto?: boolean;
    notFullWidth?: boolean;
    maxLength?: number;
    min?: number;
    max?: number;
    sx?: MuiTextFieldProps['sx'];
    className?: MuiTextFieldProps['className'];
    hideHelperText?: boolean;
    slotProps?: MuiTextFieldProps['slotProps'];
    InputProps?: MuiTextFieldProps['InputProps'];
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void | Promise<void>;
    onBlur?: (e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>, value: T[N]) => void | Promise<void>;
    trigger: UseFormTrigger<T>;
    t: TFunction<'translation', undefined>;
    error?: boolean;
};

function RenderTextField<T extends FieldValues = FieldValues, N extends FieldPath<T> = FieldPath<T>>(props: RenderProps<T, N> & HookFormRenderProps<T, N>) {
    const {
        id,
        type,
        label,
        variant,
        disabled,
        required,
        readOnly,
        multiline,
        multilineRowsAuto,
        notFullWidth,
        maxLength,
        min,
        max,
        sx,
        className,
        hideHelperText,
        slotProps: userSlotProps,
        InputProps: userInputProps,
        onChange,
        onBlur,
        field: { name, ...field },
        fieldState: { invalid, error: formError },
        trigger,
        t,
        error: customError,
    } = props;
    const multilineRows = multilineRowsAuto ? undefined : 4;

    // number型の場合、直前の有効な値を保持
    const previousValidValue = useRef<string>('');

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        field.onChange(e);
        if (onChange) {
            await onChange(e);
        }
    };

    // number型の場合にmin/maxで範囲を制御
    const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
        if (type === 'number') {
            const input = e.currentTarget.value;
            if (input === '' || input === '-') {
                previousValidValue.current = input;
                return;
            }
            
            const numValue = parseFloat(input);
            if (!isNaN(numValue)) {
                // min値チェック
                if (min !== undefined && numValue < min) {
                    e.currentTarget.value = previousValidValue.current;
                    return;
                }
                // max値チェック
                if (max !== undefined && numValue > max) {
                    e.currentTarget.value = previousValidValue.current;
                    return;
                }
                // 有効な値なので保存
                previousValidValue.current = input;
            }
        }
    };

    // IME変換開始を防ぐ
    const handleCompositionStart = (e: React.CompositionEvent<HTMLDivElement>) => {
        if (type === 'number') {
            e.preventDefault();
        }
    };

    // IME変換確定を防ぐ
    const handleCompositionEnd = (e: React.CompositionEvent<HTMLDivElement>) => {
        if (type === 'number') {
            e.preventDefault();
            const target = e.target as HTMLInputElement;
            if (target) {
                // IME入力をクリア
                target.value = '';
                field.onChange({ target: { value: '' } } as any);
            }
        }
    };

    const handleBlur = async (e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        field.onBlur();
        if (onBlur) {
            await onBlur(e, field.value);
        }
    };

    // 数値入力フィールドでマウスホイールによる値変更を無効化
    const handleWheel = (e: React.WheelEvent) => {
        if (type === 'number') {
            const target = e.target as HTMLElement;
            if (target.tagName === 'INPUT') {
                (target as HTMLInputElement).blur();
            }
        }
    };

    // 数値入力フィールドで不正なキー入力を防ぐ
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (type === 'number') {
            // e（指数表記）、+（プラス）は常に禁止
            if (e.key === 'e' || e.key === 'E' || e.key === '+') {
                e.preventDefault();
                return;
            }
            // min >= 0 の場合はマイナスも禁止
            if (e.key === '-' && min !== undefined && min >= 0) {
                e.preventDefault();
                return;
            }
        }
        
        // ユーザーから渡されたonKeyDownも実行
        const userOnKeyDown = (userSlotProps?.htmlInput as any)?.onKeyDown;
        if (userOnKeyDown && typeof userOnKeyDown === 'function') {
            userOnKeyDown(e);
        }
    };

    // 数値入力フィールドのonInputハンドラー（TextField側とユーザー側の両方を実行）
    const handleInputWrapper = (e: React.FormEvent<HTMLInputElement>) => {
        // TextField側のmin/maxチェック
        if (type === 'number' && (min !== undefined || max !== undefined)) {
            handleInput(e);
        }
        
        // ユーザーから渡されたonInputも実行
        const userOnInput = (userSlotProps?.htmlInput as any)?.onInput;
        if (userOnInput && typeof userOnInput === 'function') {
            userOnInput(e);
        }
    };

    useEffect(() => {
        if (invalid) {
            trigger(name);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [t]);

    // slotPropsをマージ（ユーザー指定を優先）
    const mergedSlotProps = {
        input: {
            readOnly,
            ...userSlotProps?.input,
        },
        htmlInput: {
            maxLength,
            min,
            max,
            ...(type === 'number' && (min !== undefined || max !== undefined || (userSlotProps?.htmlInput as any)?.onInput) && { onInput: handleInputWrapper }),
            ...(type === 'number' && { onKeyDown: handleKeyDown }),
            // ユーザー指定の他のプロパティをマージ（onKeyDown, onInputは除外、ラッパー関数内で呼び出す）
            ...(userSlotProps?.htmlInput ? Object.fromEntries(
                Object.entries(userSlotProps.htmlInput as any).filter(([key]) => key !== 'onKeyDown' && key !== 'onInput')
            ) : {}),
        },
    };

    return (
        <StyledTextField
            name={name}
            id={id}
            type={type}
            label={label}
            variant={variant}
            disabled={disabled}
            required={required}
            slotProps={mergedSlotProps}
            InputProps={userInputProps}
            value={field.value ?? ''}
            multiline={multiline}
            rows={multiline ? multilineRows : undefined}
            maxRows={multiline && multilineRowsAuto ? 4 : undefined}
            fullWidth={!notFullWidth}
            autoComplete="off"
            sx={sx}
            className={className}
            error={customError || !!formError}
            helperText={hideHelperText ? undefined : formError?.message}
            onChange={handleChange}
            onBlur={handleBlur}
            onWheel={handleWheel}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            inputRef={field.ref}
        />
    );
}

type Props<T extends FieldValues = FieldValues, N extends FieldPath<T> = FieldPath<T>> = RenderProps<T> & {
    name: N;
    control: Control<T>;
};

/**
 * テキスト入力フィールド
 * react-hook-form対応
 * @param props
 * @returns
 */

function TextField<T extends FieldValues = FieldValues, N extends FieldPath<T> = FieldPath<T>>(props: Props<T, N>) {
    const { name, control, ...textFieldProps } = props;

    const renderTextField = (hookFormRenderProps: HookFormRenderProps<T, N>) => {
        return <RenderTextField {...textFieldProps} {...hookFormRenderProps} />;
    };

    return <Controller name={name} control={control} render={renderTextField} />;
}

export default TextField;