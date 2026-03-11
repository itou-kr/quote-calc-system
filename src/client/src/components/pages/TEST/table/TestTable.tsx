// import { useMemo, memo, useCallback } from 'react';
// // import { TFunction } from 'i18next';
// // import { useTranslation } from 'react-i18next';
// // import { Box, Divider, Stack } from '@mui/material';
// import { GridColDef } from '@mui/x-data-grid';

// // import { useTypedSelector } from '@front/stores';
// import { Columns } from '@front/stores/TEST/test/testStore';
// import DataGrid from '@front/components/ui/DataGrid';
// import Box from '@mui/material/Box/Box';
// import EditIcon from '@mui/icons-material/Edit';
// import TextField from '@front/components/ui/TextField/TextField';
// import DeleteRowButton from '@front/components/ui/Button/DeleteRowButton';
// import AddRowButton from '@front/components/ui/Button/AddRowButton/AddRowButton';

// export type Props = {
//     rowCount: number;
//     data: Columns[];
//     onSelected?: (result: Columns[]) => void;
// }

// const useSetupColumns = () => {
//     return useCallback(
//         () => {
//             const columns: GridColDef<Columns>[] = [];
//             columns.push({
//             field: 'no',
//             headerName: 'No',
//             width: 80,
//             valueGetter: (params) => params.api.getRowIndex(params.id) + 1,
//             });
//             columns.push({
//             field: 'name',
//             headerName: '名称',
//             width: 120,
//             renderHeader: () => (
//                 <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                 <EditIcon sx={{ fontSize: 16, mr: 0.5 }} />
//                 名称
//                 </Box>
//             ),
//             });            
//             columns.push({ field: 'updateType', headerName: 'データファンクションの種類', width: 90 });
//             columns.push({
//                 field: 'fpValue',
//                 headerName: 'FP',
//                 width: 120,
//                 renderCell: (params) => (
//                     <TextField
//                     value={params.value}
//                     type="number"
//                     size="small"
//                     fullWidth
//                     />
//                 ),
//             });
//             columns.push({ field: 'remarks', headerName: '備考', width: 90 });
//             columns.push({ field: 'selected', headerName: '削除', width: 150, editable: true } );
//             return columns;
//         },
//         [],
//     );
// };


// const TestTable = memo((props: Props) => {
//     const { rowCount, data } = props;
//     const setupColumns = useSetupColumns();
//     const columns = useMemo(() => {
//         return setupColumns();
//     }, [setupColumns]);

//     return (
//         <DataGrid
//             rowHeight={53}
//             columnHeaderHeight={56}
//             columns={columns}
//             getRowId={(row) => row.no}
//             rowCount={rowCount}
//             rows={data}
//             browserHorizontalScroll
//             sx={{
//                 border: 'none',

//                 '& .MuiDataGrid-columnHeaders': {
//                 backgroundColor: '#fff',
//                 borderBottom: '1px solid #e0e0e0',
//                 },

//                 '& .MuiDataGrid-row': {
//                 display: 'flex',
//                 },

//                 '& .MuiDataGrid-cell': {
//                 display: 'flex',
//                 alignItems: 'center',
//                 },

//                 '& .MuiDataGrid-virtualScroller': {
//                 overflowX: 'auto',
//                 },
//             }}

//         />

//     );
// });

// export default TestTable;
