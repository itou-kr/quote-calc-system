import { DataGrid as MuiDataGrid, gridClasses, GridValidRowModel, DataGridProps } from '@mui/x-data-grid';
import { inputBaseClasses } from '@mui/material/InputBase';
import { checkboxClasses } from '@mui/material/Checkbox';
import { tablePaginationClasses } from '@mui/material/TablePagination';
import { styled } from '@mui/material/styles';

const StyledDataGrid = styled(MuiDataGrid)<{ browserhorizontalscroll?: boolean }>(({ theme, browserhorizontalscroll: browserHorizontalScroll }) => ({
    ...(browserHorizontalScroll ? { minWidth: '100%', width: 'calc(var(--DataGrid-columnsTotalWidth) + var(--DataGrid-scrollbarSize) * var(--DataGrid-hasScrollY) + 4px)' } : {}),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // [`& .${gridClasses.columnHeaders} [role=row]`]: {background: ((theme.vars || theme).palette.primary as any)[900], color: (theme.vars || theme).palette.primary.contrastText },
    [`& .${gridClasses.columnHeaders} [role=row]`]: {background: ((theme.vars || theme).palette.primary as any)[900], color: '#000000' },
    [`& .${gridClasses['columnSeparator--sideRight']}`]: { display: 'none' },
    [`& .${gridClasses.cell}:focus, & .${gridClasses.cell}:focus-within, & .${gridClasses.columnHeader}:focus, & .${gridClasses.columnHeader}:focus-within`]: {
        outline: 'none',
        outlineoffset: 0,
    },
    [`& .${gridClasses.columnHeader}`]: {
        borderRight: `1px solid ${(theme.vars || theme).palette.primary.contrastText}`,
    },
    [`& .${gridClasses.columnHeaderTitle}`]: {
        textOverflow: 'initial',
    },
    [`& .${inputBaseClasses.root}.${tablePaginationClasses.input}`]: { display: 'none' },
    [`& .${tablePaginationClasses.root}`]: { display: 'flex', flexGrow: 0 },
    [`& .${tablePaginationClasses.toolbar}`]: { padding: 0},
    [`& .${tablePaginationClasses.actions}`]: { order: 1, margin: 0 },
    [`& .${tablePaginationClasses.displayedRows}`]: { order: 2 },
    [`& .${gridClasses.columnHeaderTitleContainerContent} .${checkboxClasses.root}`]: {
        color: (theme.vars || theme).palette.common.white,
    },
    [`& .${gridClasses.columnHeaderTitleContainerContent} .${checkboxClasses.root}:not(.Mui-checked) .PrivateSwitchBase-input`]: {
        // width: 'auto',
        // height: 'auto',
        width: 15,
        height: 15,
        top: 'auto',
        left: 'auto',
        opacity: 1,
        visibility: 'hidden',
        ['&::before']: {content: '""', height: '100%', position: 'absolute', visibility: 'visible', background: (theme.vars || theme).palette.background.default },        
    },
})) as <R extends GridValidRowModel = object>(props: DataGridProps<R> & React.RefAttributes<HTMLDivElement> & { browserhorizontalscroll?: boolean }) => JSX.Element;

export default StyledDataGrid;