import { Box, Paper, Table, TableHead, TableBody, TableRow, TableCell, Collapse, IconButton, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

export type ProcessRatios = {
    basicDesign: number;
    detailedDesign: number;
    implementation: number;
    integrationTest: number;
    systemTest: number;
};

export type Props = {
    processRatios: ProcessRatios;
    calculateProcessManMonths: (ratio: number, isLast?: boolean) => number;
    calculateProcessDuration: (ratio: number, isLast?: boolean) => number;
    isOpen: boolean;
    onToggle: () => void;
};

/**
 * 工程別内訳テーブル
 * @param props - processRatios: 工程比率, calculateProcessManMonths: 工数計算関数, calculateProcessDuration: 工期計算関数, isOpen: 開閉状態, onToggle: 開閉ハンドラー
 * @returns 工程別内訳テーブルコンポーネント
 */
function ProcessBreakdownTable(props: Props) {
    const { processRatios, calculateProcessManMonths, calculateProcessDuration, isOpen, onToggle } = props;

    return (
        <Box sx={{ mt: 3 }}>
            <Box 
                sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: isOpen ? 2 : 0, 
                    cursor: 'pointer', 
                    bgcolor: '#f5f5f5', 
                    p: 1, 
                    borderRadius: 1 
                }} 
                onClick={onToggle}
            >
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>工程別内訳</Typography>
                <IconButton size="small" sx={{ ml: 1 }}>
                    {isOpen ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                </IconButton>
            </Box>
            
            <Collapse in={isOpen} timeout={300}>
                <Paper elevation={1} sx={{ border: 1, borderColor: 'divider', overflow: 'auto' }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', borderRight: 1, borderColor: 'divider', width: 100 }}></TableCell>
                                <TableCell align="center" sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', borderRight: 1, borderColor: 'divider' }}>基本設計</TableCell>
                                <TableCell align="center" sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', borderRight: 1, borderColor: 'divider' }}>詳細設計</TableCell>
                                <TableCell align="center" sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', borderRight: 1, borderColor: 'divider' }}>実装</TableCell>
                                <TableCell align="center" sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', borderRight: 1, borderColor: 'divider' }}>結合テスト</TableCell>
                                <TableCell align="center" sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold' }}>総合テスト</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5', borderRight: 1, borderColor: 'divider' }}>比率</TableCell>
                                <TableCell align="center" sx={{ borderRight: 1, borderColor: 'divider' }}>{processRatios.basicDesign}</TableCell>
                                <TableCell align="center" sx={{ borderRight: 1, borderColor: 'divider' }}>{processRatios.detailedDesign}</TableCell>
                                <TableCell align="center" sx={{ borderRight: 1, borderColor: 'divider' }}>{processRatios.implementation}</TableCell>
                                <TableCell align="center" sx={{ borderRight: 1, borderColor: 'divider' }}>{processRatios.integrationTest}</TableCell>
                                <TableCell align="center">{processRatios.systemTest}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5', borderRight: 1, borderColor: 'divider' }}>工数(人月)</TableCell>
                                <TableCell align="center" sx={{ borderRight: 1, borderColor: 'divider' }}>{calculateProcessManMonths(processRatios.basicDesign, false)}</TableCell>
                                <TableCell align="center" sx={{ borderRight: 1, borderColor: 'divider' }}>{calculateProcessManMonths(processRatios.detailedDesign, false)}</TableCell>
                                <TableCell align="center" sx={{ borderRight: 1, borderColor: 'divider' }}>{calculateProcessManMonths(processRatios.implementation, true)}</TableCell>
                                <TableCell align="center" sx={{ borderRight: 1, borderColor: 'divider' }}>{calculateProcessManMonths(processRatios.integrationTest, false)}</TableCell>
                                <TableCell align="center">{calculateProcessManMonths(processRatios.systemTest, false)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5', borderRight: 1, borderColor: 'divider' }}>工期(月)</TableCell>
                                <TableCell align="center" sx={{ borderRight: 1, borderColor: 'divider' }}>{calculateProcessDuration(processRatios.basicDesign, false)}</TableCell>
                                <TableCell align="center" sx={{ borderRight: 1, borderColor: 'divider' }}>{calculateProcessDuration(processRatios.detailedDesign, false)}</TableCell>
                                <TableCell align="center" sx={{ borderRight: 1, borderColor: 'divider' }}>{calculateProcessDuration(processRatios.implementation, true)}</TableCell>
                                <TableCell align="center" sx={{ borderRight: 1, borderColor: 'divider' }}>{calculateProcessDuration(processRatios.integrationTest, false)}</TableCell>
                                <TableCell align="center">{calculateProcessDuration(processRatios.systemTest, false)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Paper>
            </Collapse>
        </Box>
    );
}

export default ProcessBreakdownTable;
