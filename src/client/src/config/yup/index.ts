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

yup.addMethod(yup.object, 'dataPairCheck', function () {
  return this.test('dataPairCheck', function (value) {
    if (!value) return true;

    const { name, updateType } = value;

    const hasName = !!name?.trim();
    const hasUpdateType = !!updateType?.value;

    if (!hasName && !hasUpdateType) return true;

    const match = this.path?.match(/\[(\d+)\]/);
    const rowNumber = match ? Number(match[1]) + 1 : '';

    if (!hasName && hasUpdateType) {
        return this.createError({
            message: `行${rowNumber}：データファンクションテーブルの名称を入力してください`,
        });
        }

        if (hasName && !hasUpdateType) {
        return this.createError({
            message: `行${rowNumber}：データファンクションの種類を入力してください`,
        });
        }

        return true;
    });
});

yup.addMethod(yup.object, 'transactionPairCheck', function () {
    return this.test('transactionPairCheck', function (value) {
        if (!value) return true;

        const {
            name,
            externalInput,
            externalOutput,
            externalInquiry,
        } = value;

        const hasName = !!name?.trim();
        const hasExternal =
            externalInput != null ||
            externalOutput != null ||
            externalInquiry != null;

        if (!hasName && !hasExternal) return true;

        // 行番号取得
        const match = this.path.match(/\[(\d+)\]/);
        const rowNumber = match ? Number(match[1]) + 1 : '';

        if (hasName && !hasExternal) {
            return this.createError({
                message: `行${rowNumber}：外部入力・外部出力・外部照会のいずれかを入力してください`,
            });
        }

        if (!hasName && hasExternal) {
            return this.createError({
                message: `行${rowNumber}：トランザクションファンクションテーブルの名称を入力してください`,
            });
        }

        return true;
    });
});

}