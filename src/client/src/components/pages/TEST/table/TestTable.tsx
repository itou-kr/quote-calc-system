import { useMemo, memo, useCallback } from 'react';
// import { TFunction } from 'i18next';
// import { useTranslation } from 'react-i18next';
// import { Box, Divider, Stack } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

// import { useTypedSelector } from '@front/stores';
import { Columns } from '@front/stores/TEST/test/testStore';
import DataGrid from '@front/components/ui/DataGrid';

export type Props = {
    rowCount: number;
    data: Columns[];
    onSelected?: (result: Columns[]) => void;
}

const useSetupColumns = () => {
    return useCallback(
        () => {
            const columns: GridColDef<Columns>[] = [];
            columns.push({ field: 'no', headerName: 'No', width: 90 });
            columns.push({ field: 'name', headerName: '名称', width: 90 });
            columns.push({ field: 'updateType', headerName: 'データファンクションの種類', width: 90 });
            columns.push({ field: 'fpValue', headerName: 'FP', width: 90 });
            columns.push({ field: 'remarks', headerName: '備考', width: 90 });
            columns.push({ field: 'selected', headerName: '削除', width: 150, editable: true } );
            return columns;
        },
        [],
    );
};


const TestTable = memo((props: Props) => {
    const { rowCount, data } = props;
    const setupColumns = useSetupColumns();
    const columns = useMemo(() => {
        return setupColumns();
    }, [setupColumns]);

    return (
        <DataGrid
            columns={columns}
            getRowId={(row) => row.no}
            rowCount={rowCount}
            rows={data}
            columnHeaderHeight={56}
            browserHorizontalScroll
        />
    );
});

export default TestTable;
