import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
// import { LabelDisplayedRowsArgs } from '@mui/material/TablePagination';

// import { useThrowError } from '@front/hooks/error';

import {
    useGridApiRef,
    GridAutosizeOptions,
    GridValidRowModel,
    DataGridProps,
    GridRowId,
    // GridCallbackDetails
} from '@mui/x-data-grid';

import { useProgressContext } from '@front/hooks/contexts';
import StyledDataGrid from '@front/components/styles/StyledDataGrid';

const autoSizeOptions: GridAutosizeOptions = {
    outliersFactor: 0,
    includeOutliers: true, // 値の幅に合わせて列幅を調整
    includeHeaders: true, // ヘッダーの幅に合わせて列幅を調整
    expand: true,
};

// const labelDisplayedRows = ({
//     from,
//     to,
//     count,
//     // estimated
// }: LabelDisplayedRowsArgs & {
//     estimated?: number;
// }) => {
//     if (count > 0) {
//         return `Results ${from}–${to} of ${count} records`;
//     }
//     return null
// };

export type RefType<R extends GridValidRowModel = object> = { getSelectedRows: () => Map<GridRowId, R> };

export type Props<R extends GridValidRowModel = object> = Pick<
    DataGridProps<R>,
    'columns' | 'rows' | 'getRowId' | 'columnHeaderHeight' | 'checkboxSelection' | 'isRowSelectable' | 'columnVisibilityModel' | 'style'
> & {
    rowCount: NonNullable<DataGridProps<R>['rowCount']>;
    browserHorizontalScroll?: boolean;
};

const DataGrid = forwardRef(<R extends GridValidRowModel = object>(props: Props<R>, ref: React.Ref<RefType<R>>) => {
    const apiRef = useGridApiRef();
    const { columns, rowCount, rows, getRowId, columnHeaderHeight, browserHorizontalScroll, checkboxSelection, isRowSelectable, columnVisibilityModel } = props;
    const { progress } = useProgressContext();

    useEffect(() => {
        (async () => {
            await new Promise((resolve) => {
                setTimeout(resolve, 1);
            });
            apiRef.current?.autosizeColumns({ ...autoSizeOptions, includeOutliers: false });
        })();
    }, [apiRef]);

    useEffect(() => {
        (async () => {
            if (!progress) {
                await new Promise((resolve) => {
                    setTimeout(resolve, 10);
                });
                apiRef.current?.autosizeColumns(autoSizeOptions);
            }
        })();
    }, [apiRef, progress]);

    useImperativeHandle(ref, () => {
        return {
            getSelectedRows: () => apiRef.current?.getSelectedRows() as Map<GridRowId, R>
        };
    }, [apiRef]);

    return (
        <StyledDataGrid
            apiRef={apiRef}
            columns={columns}
            getRowId={getRowId}
            getRowHeight={columnHeaderHeight ? () => 'auto' : undefined}
            rowCount={rowCount}
            rows={rows}
            autosizeOptions={autoSizeOptions}
            autosizeOnMount
            columnHeaderHeight={columnHeaderHeight}
            paginationMode='server'
            localeText={{ footerRowSelected: () => null }}  
            browserhorizontalscroll={browserHorizontalScroll}
            disableRowSelectionOnClick={!!checkboxSelection}
            checkboxSelection={checkboxSelection}
            isRowSelectable={isRowSelectable}
            columnVisibilityModel={columnVisibilityModel}
        />
    );
}) as <R extends GridValidRowModel = object>(props: Props<R>, ref?: React.Ref<RefType<R>>) => JSX.Element;


export default DataGrid;

