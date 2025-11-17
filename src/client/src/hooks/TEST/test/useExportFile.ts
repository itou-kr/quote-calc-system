import { useCallback } from 'react';

import { ViewIdType } from '@front/stores/TEST/test/testStore/index';

// 仮の exportFile 関数
const exportFile = (file: { name: string; content: string }) => {
    console.log('exportFile called:', file);
};

export function useExportFile(viewId: ViewIdType | 'TEST') {

    // 仮仕様
    return useCallback(
        (file: { name: string; content: string }) => {
            console.log('useExportFile:', viewId);
            exportFile(file);
        },
        [viewId]
    );
}

export default useExportFile;
