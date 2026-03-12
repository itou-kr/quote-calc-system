// import { useCallback } from 'react';

// import { ViewIdType } from '@front/stores/TEST/test/testStore/index';
import { importApi } from '@front/openapi';
import { useClear as useClearAlertMessage, useSetAlertMessage } from '@front/hooks/alertMessage';
import { viewId } from '@front/stores/CALC/calc/calcStore';
import type { FormType } from '@front/components/pages/CALC/form/CalcForm';

export const useImportFile = () => {
  const setAlertMessage = useSetAlertMessage(viewId);
  const clearAlertMessage = useClearAlertMessage(viewId);

  return async (file: File): Promise<FormType | undefined> => {
    clearAlertMessage();
    console.log(file, 'file');
    const response = await importApi.importApplication(file);
    const importFileData = response.data;

    if ((importFileData.errorMessages ?? []).length > 0) {
      setAlertMessage({ severity: 'error', message: (importFileData.errorMessages ?? []).join('\n').replaceAll('<br>', '\n') });
      console.log('errorMessages', importFileData.errorMessages);
      return;
    }

    // 正常メッセージの表示
    setAlertMessage({ severity: 'success', message: 'インポートが完了しました。' });    

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
          label: df.updateType ?? '',
          value: df.updateType ?? '',
        }
      })),
    };

    console.log('response', response);
    return formData;

    // return importFileData;
  }
};
