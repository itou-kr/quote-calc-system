// import { useGetProjectType, useGetIpaValueType, useGetDataFunctionType } from '@front/hooks/consts';
// import { useTranslation } from 'react-i18next';
// import { useAppDispatch } from '@front/stores';

import { ViewIdType } from '@front/stores/TEST/test/testStore';
import { useClear as useClearAlertMessage, useSetAlertMessage } from '@front/hooks/alertMessage';
import { importApi } from '@front/openapi';

/**
 * CALC画面用のインポートフック
 * viewIdをcalcStoreから取得
 */
export const useImportFile = (viewId: ViewIdType) => {
  
  // const dispatch = useAppDispatch();
  const clearAlertMessage = useClearAlertMessage(viewId);
  const setAlertMessage = useSetAlertMessage(viewId);
  // const { t } = useTranslation();
  // const getProjectTypeOptions = useGetProjectType(t);
  // const getIpaValueTypeOptions = useGetIpaValueType(t);
  // const getDataFunctionTypeOptions = useGetDataFunctionType(t);  

  return async (file: File) => {
    clearAlertMessage();
    console.log(file, 'file');
    const response = await importApi.importApplication(file);
    const importFileData = response.data;

    if ((importFileData.errorMessages ?? []).length > 0) {
      setAlertMessage({ severity: 'error', message: (importFileData.errorMessages ?? []).join('\n').replaceAll('<br>', '\n') });
      console.log('errorMessages', importFileData.errorMessages);
      return;
    }

    // // 案件種別を取得
    // const projectTypeLabel = getProjectTypeOptions().find((option) => option.value === calcResultData.projectType)?.label;
    // // 使用するIPA代表値を取得
    // const ipaValueLabel = getIpaValueTypeOptions().find((option) => option.value === calcResultData.ipaValue)?.label;
    // // データファンクションの種類を取得
    // const dataFunctionTypeLabel = getDataFunctionTypeOptions().find((option) => option.value === calcResultData.dataFunctionType)?.label;


    console.log('response', response);
    return importFileData;
  }
};
