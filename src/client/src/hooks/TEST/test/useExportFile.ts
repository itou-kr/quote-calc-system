
import { exportApi } from '@front/openapi';
import { useClear as useClearAlertMessage, useSetAlertMessage } from '@front/hooks/alertMessage';
import { viewId } from '@front/stores/TEST/test/testStore';

// 不要？
import type { ExportApplicationRequest } from '@front/openapi/models';



export const useExportFile = () => {
  const setAlertMessage = useSetAlertMessage(viewId);
  const clearAlertMessage = useClearAlertMessage(viewId);

  return async (formData: ExportApplicationRequest) => {
    clearAlertMessage();
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
      return;
    }

    downloadBase64File(exportFileData.exportFile.content!, exportFileData.exportFile.name!);
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