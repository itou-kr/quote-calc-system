import { useEffect } from 'react';
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

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        field.onChange(e);
        if (onChange) {
            await onChange(e);
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
            ...userSlotProps?.htmlInput,
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