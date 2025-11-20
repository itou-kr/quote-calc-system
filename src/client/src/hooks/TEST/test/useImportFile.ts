import { useCallback } from 'react';

import { ViewIdType } from '@front/stores/TEST/test/testStore/index';

// 仮の importFile 関数
const importFile = async (file: File): Promise<{ name: string; content: string }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            resolve({
                name: file.name,
                content: reader.result as string,
            });
        };

        reader.onerror = () => {
            reject(reader.error);
        };

        reader.readAsText(file); // 仮仕様：テキストファイルとして読み込み
    });
};

export function useImportFile(viewId: ViewIdType | 'TEST') {
    return useCallback(
        async (file: File) => {
            console.log('useImportFile:', viewId);

            try {
                const result = await importFile(file);
                console.log('importFile result:', result);
                return result; // 読み込んだ内容を返す
            } catch (err) {
                console.error('importFile error:', err);
                throw err;
            }
        },
        [viewId]
    );
}

export default useImportFile;
