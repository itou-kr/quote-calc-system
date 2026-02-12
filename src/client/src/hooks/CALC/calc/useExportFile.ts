import { exportApi } from '@front/openapi';
import { useClear as useClearAlertMessage, useSetAlertMessage } from '@front/hooks/alertMessage';
import type { ExportApplicationRequest } from '@front/openapi/models';

/**
 * CALC画面用のエクスポートフック
 * viewIdを'CALC'で固定
 */
export const useExportFile = () => {
  const setAlertMessage = useSetAlertMessage('CALC');
  const clearAlertMessage = useClearAlertMessage('CALC');

  return async (formData: ExportApplicationRequest) => {
    clearAlertMessage();
    
    try {
      const response = await exportApi.exportApplication(formData);
      console.log(response, 'response');
      const exportFileData = response.data;

      if ((exportFileData?.errorMessages?.length ?? 0) > 0) {
        setAlertMessage({
          severity: 'error',
          message: (exportFileData?.errorMessages ?? [])
            .join('\n')
            .replaceAll('<br>', '\n'),
        });
        console.log('errorMessages', exportFileData?.errorMessages);
        return;
      }
      
      if (!exportFileData.exportFile) {
        setAlertMessage({
          severity: 'error',
          message: 'エクスポートファイルの生成に失敗しました',
        });
        return;
      }

      downloadBase64File(exportFileData.exportFile.content!, exportFileData.exportFile.name!);
    } catch (error) {
      setAlertMessage({
        severity: 'error',
        message: 'エクスポートに失敗しました。',
      });
      console.error('Export error:', error);
    }
  };
};

const base64ToBlob = (base64: string, contentType?: string) => {
  const base64Data = base64.startsWith('data:') ? base64.split(',')[1] : base64;

  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: contentType });
}

const downloadBase64File = (base64: string, fileName: string, contentType?: string) => {
  const mimeType = contentType || 'application/octet-stream';
  const blob = base64ToBlob(base64, mimeType);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
