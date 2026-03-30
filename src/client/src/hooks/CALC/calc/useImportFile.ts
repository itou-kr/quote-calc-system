// import { useCallback } from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

// import { ViewIdType } from '@front/stores/TEST/test/testStore/index';
import { importApi } from '@front/openapi';
import { useClear as useClearAlertMessage, useSetAlertMessage } from '@front/hooks/alertMessage';
import calcStore, { viewId } from '@front/stores/CALC/calc/calcStore';
import type { FormType } from '@front/components/pages/CALC/form/CalcForm';
import { useAppDispatch } from '@front/stores';
import type {
    CalcTestApplicationRequestProjectTypeEnum,
    CalcTestApplicationRequestIpaValueTypeEnum,
    DataFunctionUpdateType,
} from '@front/openapi/models';
import { useGetUpdateType } from '@front/hooks/consts';


export const useImportFile = () => {
  const setAlertMessage = useSetAlertMessage(viewId);
  const clearAlertMessage = useClearAlertMessage(viewId);
  const dispatch = useAppDispatch();
  
  const { t } = useTranslation();
  const getUpdateTypes = useGetUpdateType(t);
  const updateTypeOptions = useMemo(() => getUpdateTypes(), [getUpdateTypes]);
  
  return async (file: File): Promise<FormType | undefined> => {
    clearAlertMessage();
    const response = await importApi.importApplication(file);
    const importFileData = response.data;



    // データファンクションの種類のラベルを取得

    const formData: FormType = {
      ...importFileData,
      projectType: {
        label: importFileData.projectType,
        value: importFileData.projectType,         
      },
      ipaValueType: {
        label: importFileData.ipaValueType,
        value: importFileData.ipaValueType,  
      },
      dataFunctions: importFileData.dataFunctions?.map(df => ({
        ...df,
        updateType: {
            label:
                updateTypeOptions.find(v => v.value === df.updateType)?.label
                ?? df.updateType,
            value: df?.updateType ?? undefined,
        },
      })) ?? [],
    };

    if ((importFileData.errorMessages ?? []).length > 0) {
      setAlertMessage({ severity: 'error', message: (importFileData.errorMessages ?? []).join('\n').replaceAll('<br>', '\n') });
      console.log('errorMessages', importFileData.errorMessages);
      return;
    }

    // enum項目をストアに設定
    dispatch(
      calcStore.actions.setProjectType(
        formData.projectType.value as CalcTestApplicationRequestProjectTypeEnum
      )
    );
    dispatch(
      calcStore.actions.setIpaValueType(
        formData.ipaValueType.value as CalcTestApplicationRequestIpaValueTypeEnum
      )
    );
  dispatch(
    calcStore.actions.setDataFunctions(
      (formData.dataFunctions ?? []).map(df => ({
        ...df,
        updateType: df.updateType?.value as DataFunctionUpdateType,
      }))
    )
  );
    console.log('store', calcStore)

    // 正常メッセージの表示
    setAlertMessage({ severity: 'success', message: 'インポートが完了しました。' });    

    console.log('インポート後のresponse', response);
    return formData;

    // return importFileData;
  }
};
