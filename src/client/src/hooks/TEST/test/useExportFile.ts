// import { useCallback } from 'react';

// import { useClear as useClearAlertMessage, useSetAlertMessage } from '@front/hooks/useAlert';

// import { CalcModel } from/ '@front/models/CALC/CalcModel';
// import { ViewIdType } from '@front/stores/TEST/test/testStore';

import { exportApi } from '@front/openapi';

// 不要？
import type { ExportApplicationRequest } from '@front/openapi/models';

// const downloadFile = (file: { name: string; content: string }) => {
//   const a = document.createElement('a');
//   a.href = `data:text/plain;base64,${encodeURIComponent(file.content)}`;
//   a.download = file.name;
//   a.click();
//   a.remove();
// };


export const useExportFile = () => {
  return async (formData: ExportApplicationRequest) => {
    const response = await exportApi.exportApplication(formData);
    console.log(formData, 'うううううううううううううううううううううううううううう');
    console.log(response, 'ああああああああああああああああああああああああああああ');

    const exportFile = response.data.exportFile;
    if (!exportFile) return;
    
    downloadBase64File(exportFile.content!, exportFile.name!);
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