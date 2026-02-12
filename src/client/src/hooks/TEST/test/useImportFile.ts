// import { useCallback } from 'react';

// import { ViewIdType } from '@front/stores/TEST/test/testStore/index';
import { importApi } from '@front/openapi';
import { useClear as useClearAlertMessage, useSetAlertMessage } from '@front/hooks/alertMessage';
import { viewId } from '@front/stores/TEST/test/testStore';

// import { ImportApplicationRequest } from '@front/openapi/models';
// import type {}

// 仮の importFile 関数
// const importFile = async (file: File): Promise<{ name: string; content: string }> => {
//     return new Promise((resolve, reject) => {
//         const reader = new FileReader();

//         reader.onload = () => {
//             resolve({
//                 name: file.name,
//                 content: reader.result as string,
//             });
//         };

//         reader.onerror = () => {
//             reject(reader.error);
//         };

//         reader.readAsText(file); // 仮仕様：テキストファイルとして読み込み
//     });
// };

export const useImportFile = () => {
  const setAlertMessage = useSetAlertMessage(viewId);
  const clearAlertMessage = useClearAlertMessage(viewId);

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

    // 正常メッセージの表示
    setAlertMessage({ severity: 'success', message: 'インポートが完了しました。' });    

    console.log('response', response);
    return importFileData;
  }
};
