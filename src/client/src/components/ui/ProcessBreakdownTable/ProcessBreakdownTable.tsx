import { Box, Paper, Table, TableHead, TableBody, TableRow, TableCell, Collapse, IconButton, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

export type ProcessRatios = {
    basicDesign: number;
    detailedDesign: number;
    implementation: number;
    integrationTest: number;
    systemTest: number;
};

export type ProcessManMonths = {
    basicDesign: number;
    detailedDesign: number;
    implementation: number;
    integrationTest: number;
    systemTest: number;
};

export type ProcessDurations = {
    basicDesign: number;
    detailedDesign: number;
    implementation: number;
    integrationTest: number;
    systemTest: number;
};

export type Props = {
    processRatios?: ProcessRatios;
    processManMonths?: ProcessManMonths;
    processDurations?: ProcessDurations;
    isOpen: boolean;
    onToggle: () => void;
};

/**
 * 工程別内訳テーブル
 * @param props - processRatios: 工程比率, processManMonths: 工数, processDurations: 工期, isOpen: 開閉状態, onToggle: 開閉ハンドラー
 * @returns 工程別内訳テーブルコンポーネント
 */
function ProcessBreakdownTable(props: Props) {
    const { processRatios, processManMonths, processDurations, isOpen, onToggle } = props;
    
    // 合計値を計算
    const totalRatio = processRatios 
        ? (processRatios.basicDesign || 0) + (processRatios.detailedDesign || 0) + (processRatios.implementation || 0) + (processRatios.integrationTest || 0) + (processRatios.systemTest || 0)
        : 0;
    const totalManMonths = processManMonths
        ? (processManMonths.basicDesign || 0) + (processManMonths.detailedDesign || 0) + (processManMonths.implementation || 0) + (processManMonths.integrationTest || 0) + (processManMonths.systemTest || 0)
        : 0;
    const totalDuration = processDurations
        ? (processDurations.basicDesign || 0) + (processDurations.detailedDesign || 0) + (processDurations.implementation || 0) + (processDurations.integrationTest || 0) + (processDurations.systemTest || 0)
        : 0;
    
    return (
        <Box sx={{ mt: 3 }}>
            <Box 
                sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 2, 
                    cursor: 'pointer', 
                    bgcolor: '#f5f5f5', 
                    p: 1, 
                    borderRadius: 1 
                }} 
                onClick={onToggle}
            >
                <AutoAwesomeIcon sx={{ fontSize: 18, mr: 0.5, color: 'text.secondary' }} />
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>工程別内訳</Typography>
                <IconButton size="small" sx={{ ml: 1 }}>
                    {isOpen ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                </IconButton>
            </Box>
            
            <Collapse in={isOpen} timeout={500} unmountOnExit>
                <Paper 
                    elevation={1} 
                    sx={{ 
                        border: 1, 
                        borderColor: 'divider', 
                        overflow: 'auto', 
                        mb: 2,
                        transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
                        opacity: isOpen ? 1 : 0,
                        transform: isOpen ? 'scaleY(1)' : 'scaleY(0.95)',
                        transformOrigin: 'top'
                    }}
                >
                    <Table size="small" sx={{ tableLayout: 'fixed' }}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', borderRight: 1, borderColor: 'divider', width: 120 }}></TableCell>
                                <TableCell align="center" sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', borderRight: 1, borderColor: 'divider', width: 'calc((100% - 240px) / 5)' }}>基本設計</TableCell>
                                <TableCell align="center" sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', borderRight: 1, borderColor: 'divider', width: 'calc((100% - 240px) / 5)' }}>詳細設計</TableCell>
                                <TableCell align="center" sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', borderRight: 1, borderColor: 'divider', width: 'calc((100% - 240px) / 5)' }}>実装</TableCell>
                                <TableCell align="center" sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', borderRight: 1, borderColor: 'divider', width: 'calc((100% - 240px) / 5)' }}>結合テスト</TableCell>
                                <TableCell align="center" sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', borderRight: 1, borderColor: 'divider', width: 'calc((100% - 240px) / 5)' }}>総合テスト</TableCell>
                                <TableCell align="center" sx={{ bgcolor: '#bbdefb', fontWeight: 'bold', width: 120 }}>合計</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5', borderRight: 1, borderColor: 'divider' }}>比率</TableCell>
                                <TableCell align="center" sx={{ bgcolor: '#f5f5f5', borderRight: 1, borderColor: 'divider' }}>{processRatios?.basicDesign}</TableCell>
                                <TableCell align="center" sx={{ bgcolor: '#f5f5f5', borderRight: 1, borderColor: 'divider' }}>{processRatios?.detailedDesign}</TableCell>
                                <TableCell align="center" sx={{ bgcolor: '#f5f5f5', borderRight: 1, borderColor: 'divider' }}>{processRatios?.implementation}</TableCell>
                                <TableCell align="center" sx={{ bgcolor: '#f5f5f5', borderRight: 1, borderColor: 'divider' }}>{processRatios?.integrationTest}</TableCell>
                                <TableCell align="center" sx={{ bgcolor: '#f5f5f5', borderRight: 1, borderColor: 'divider' }}>{processRatios?.systemTest}</TableCell>
                                <TableCell align="center" sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold' }}>{totalRatio.toFixed(3)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5', borderRight: 1, borderColor: 'divider' }}>工数(人月)</TableCell>
                                <TableCell align="center" sx={{ bgcolor: '#f5f5f5', borderRight: 1, borderColor: 'divider' }}>{processManMonths?.basicDesign}</TableCell>
                                <TableCell align="center" sx={{ bgcolor: '#f5f5f5', borderRight: 1, borderColor: 'divider' }}>{processManMonths?.detailedDesign}</TableCell>
                                <TableCell align="center" sx={{ bgcolor: '#f5f5f5', borderRight: 1, borderColor: 'divider' }}>{processManMonths?.implementation}</TableCell>
                                <TableCell align="center" sx={{ bgcolor: '#f5f5f5', borderRight: 1, borderColor: 'divider' }}>{processManMonths?.integrationTest}</TableCell>
                                <TableCell align="center" sx={{ bgcolor: '#f5f5f5', borderRight: 1, borderColor: 'divider' }}>{processManMonths?.systemTest}</TableCell>
                                <TableCell align="center" sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold' }}>{totalManMonths.toFixed(2)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5', borderRight: 1, borderColor: 'divider' }}>工期(月)</TableCell>
                                <TableCell align="center" sx={{ bgcolor: '#f5f5f5', borderRight: 1, borderColor: 'divider' }}>{processDurations?.basicDesign}</TableCell>
                                <TableCell align="center" sx={{ bgcolor: '#f5f5f5', borderRight: 1, borderColor: 'divider' }}>{processDurations?.detailedDesign}</TableCell>
                                <TableCell align="center" sx={{ bgcolor: '#f5f5f5', borderRight: 1, borderColor: 'divider' }}>{processDurations?.implementation}</TableCell>
                                <TableCell align="center" sx={{ bgcolor: '#f5f5f5', borderRight: 1, borderColor: 'divider' }}>{processDurations?.integrationTest}</TableCell>
                                <TableCell align="center" sx={{ bgcolor: '#f5f5f5', borderRight: 1, borderColor: 'divider' }}>{processDurations?.systemTest}</TableCell>
                                <TableCell align="center" sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold' }}>{totalDuration.toFixed(2)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Paper>
            </Collapse>
        </Box>
    );
}

export default ProcessBreakdownTable;
