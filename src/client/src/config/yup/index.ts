// import { format } from '@front/utils/format';
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
        required: ({ label, path }) =>
            `${label ?? path}は必須です`,
        },
    };
    yup.setLocale(locale);

yup.addMethod(yup.number, 'rangeCheck', function rangeCheck(min: number, max: number) {
    return this.test(
        'rangeCheck',
        function (value) {
        const { path, schema } = this;

        const label = (schema as any)?.spec?.label ?? path;

        if (typeof value === 'number' && (value < min || value > max)) {
            return this.createError({
            message: `${label}は${min}〜${max}の間で入力してください`,
            });
        }

        return true;
        }
    );
});


}