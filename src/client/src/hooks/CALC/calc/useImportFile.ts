import { importApi } from '@front/openapi';
import { useClear as useClearAlertMessage, useSetAlertMessage } from '@front/hooks/alertMessage';

/**
 * CALC画面用のインポートフック
 * viewIdを'CALC'で固定
 */
export const useImportFile = () => {
  const setAlertMessage = useSetAlertMessage('CALC');
  const clearAlertMessage = useClearAlertMessage('CALC');

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
    
    console.log('response', response);
    return importFileData;
  }
};
