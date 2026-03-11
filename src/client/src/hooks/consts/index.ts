import { useCallback } from 'react';
import { TFunction } from "i18next";

import { ipaValueType, projectType, updateType } from '@front/consts';
import { AutocompleteLabelAndValue } from '@front/types/LabelAndValue';

/**
 * 案件種別を取得
 * @param t
 * @returns
 */
export function useGetProjectType(t: TFunction<'translation', undefined>) {
    return useCallback((): AutocompleteLabelAndValue[] => {
        return Object.entries(projectType).map(([k, v]) => ({ label: t(`label.projectType.const.${k}`), value: v }));
    }, [t]);
}

/**
 * 使用するIPA代表値を取得
 * @param t
 * @returns
 */
export function useGetIpaValueType(t: TFunction<'translation', undefined>) {
    return useCallback((): AutocompleteLabelAndValue[] => {
        return Object.entries(ipaValueType).map(([k, v]) => ({ label: t(`label.ipaValueType.const.${k}`), value: v }));
    }, [t]);
}

/**
 * データファンクションの種類を取得
 * @param t
 * @returns
 */
export function useGetUpdateType(t: TFunction<'translation', undefined>) {
    return useCallback((): AutocompleteLabelAndValue[] => {
        return Object.entries(updateType).map(([k, v]) => ({ label: t(`label.updateType.const.${k}`), value: v }));
    }, [t]);
}

