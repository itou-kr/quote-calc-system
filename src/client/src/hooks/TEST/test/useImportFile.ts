// import { useCallback } from 'react';

// import { ViewIdType } from '@front/stores/TEST/test/testStore/index';
import { importApi } from '@front/openapi';

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
  return async (file: File) => {
    // const formData = new FormData();
    // formData.append('file', file);
    console.log(file, 'file');
    const response = await importApi.importApplication(file);
    console.log('response', response);
    return response.data;
  };
};
