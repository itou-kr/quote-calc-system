import { format } from '@front/utils/format';
import * as yup from 'yup';

// 正規表現新規作成の場合はここに追加
// const regex = //;

/**
 * i18n 設定時に yup バリデーション用の設定を行う
 * @param _
 * @param t
 */

export function yupSetting(_: unknown) {
    const locale: yup.LocaleObject = {
        mixed: {
            required: (params: { label: string} ) => format('は必須です', params.label),
        },
    };
    yup.setLocale(locale);

    yup.addMethod(yup.number, 'rangeCheck', function rangeCheck(minField: number, maxField: number) {
        return this.test(
            'rangeCheck',
            function (params) {
                return format('は必須です', params.label, minField, maxField);
            },
            function (value) {
                const min = minField;
                const max = maxField;
                if (typeof min === 'number' && typeof max === 'number' && typeof value === 'number') {
                    if (value < min || value > max) {
                        return false;
                    }
                }
                return true;
            }
        );
    });
}