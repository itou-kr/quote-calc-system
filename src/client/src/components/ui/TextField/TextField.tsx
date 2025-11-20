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
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void | Promise<void>;
    onBlur?: (e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>, value: T[N]) => void | Promise<void>;
    trigger: UseFormTrigger<T>;
    t: TFunction<'translation', undefined>;
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
        onChange,
        onBlur,
        field: { name, ...field },
        fieldState: { invalid, error },
        trigger,
        t,
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

    useEffect(() => {
        if (invalid) {
            trigger(name);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [t]);

    return (
        <StyledTextField
            name={name}
            id={id}
            type={type}
            label={label}
            variant={variant}
            disabled={disabled}
            required={required}
            slotProps={{
                input: {
                    readOnly,
                },
                htmlInput: {
                    maxLength,
                },
            }}
            value={field.value || ''}
            multiline={multiline}
            rows={multiline ? multilineRows : undefined}
            maxRows={multiline && multilineRowsAuto ? 4 : undefined}
            fullWidth={!notFullWidth}
            autoComplete="off"
            sx={sx}
            className={className}
            error={!!error}
            helperText={error?.message}
            onChange={handleChange}
            onBlur={handleBlur}
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