import { Box, Table, TableHead, TableBody, TableRow, TableCell, Typography } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { memo } from 'react';

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

export type ProcessFPs = {
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
    processFPs?: ProcessFPs;
    processManMonths?: ProcessManMonths;
    processDurations?: ProcessDurations;
};

/**
 * 工程別内訳テーブル
 * @param props - processRatios: 工程比率, processManMonths: 工数, processDurations: 工期
 * @returns 工程別内訳テーブルコンポーネント
 */
function ProcessBreakdownTable(props: Props) {
    const { processRatios, processFPs, processManMonths, processDurations } = props;
    const toNumber = (value: unknown) => {
        const num = typeof value === 'number' ? value : Number(value);
        return Number.isFinite(num) ? num : 0;
    };

    const normalizedRatios: ProcessRatios = {
        basicDesign: toNumber(processRatios?.basicDesign),
        detailedDesign: toNumber(processRatios?.detailedDesign),
        implementation: toNumber(processRatios?.implementation),
        integrationTest: toNumber(processRatios?.integrationTest),
        systemTest: toNumber(processRatios?.systemTest),
    };
    
    // 合計値を計算
    const totalRatio =
        normalizedRatios.basicDesign +
        normalizedRatios.detailedDesign +
        normalizedRatios.implementation +
        normalizedRatios.integrationTest +
        normalizedRatios.systemTest;
    const totalFPValue = processFPs
        ? (processFPs.basicDesign || 0) + (processFPs.detailedDesign || 0) + (processFPs.implementation || 0) + (processFPs.integrationTest || 0) + (processFPs.systemTest || 0)
        : 0;
    const totalManMonths = processManMonths
        ? (processManMonths.basicDesign || 0) + (processManMonths.detailedDesign || 0) + (processManMonths.implementation || 0) + (processManMonths.integrationTest || 0) + (processManMonths.systemTest || 0)
        : 0;
    const totalDuration = processDurations
        ? (processDurations.basicDesign || 0) + (processDurations.detailedDesign || 0) + (processDurations.implementation || 0) + (processDurations.integrationTest || 0) + (processDurations.systemTest || 0)
        : 0;
    
    return (
        <Box sx={{ minWidth: 0, overflowX: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, pl: 0 }}>
                <AutoAwesomeIcon sx={{ fontSize: 18, mr: 0.5, color: 'text.secondary' }} />
                <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.95rem' }}>開発工程別内訳</Typography>
            </Box>
            <Table size="small" sx={{ tableLayout: 'fixed', minWidth: 800 }}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', borderRight: 1, borderColor: 'divider', width: 120 }}></TableCell>
                        <TableCell align="center" sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', borderRight: 1, borderColor: 'divider', width: 'calc((100% - 420px) / 6)' }}>基本設計</TableCell>
                        <TableCell align="center" sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', borderRight: 1, borderColor: 'divider', width: 'calc((100% - 420px) / 6)' }}>詳細設計</TableCell>
                        <TableCell align="center" sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', borderRight: 1, borderColor: 'divider', width: 'calc((100% - 420px) / 6)' }}>製造</TableCell>
                        <TableCell align="center" sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', borderRight: 1, borderColor: 'divider', width: 'calc((100% - 420px) / 6)' }}>結合テスト</TableCell>
                        <TableCell align="center" sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', borderRight: 1, borderColor: 'divider', width: 'calc((100% - 420px) / 6)' }}>総合テスト</TableCell>
                        <TableCell align="center" sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', width: 'calc((100% - 420px) / 6)' }}>合計</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow sx={{ height: 45 }}>
                        <TableCell sx={{ fontWeight: 'bold', bgcolor: '#fafafa', borderRight: 1, borderColor: 'divider', verticalAlign: 'middle' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                比率
                            </Box>
                        </TableCell>
                        <TableCell align="center" sx={{ bgcolor: '#fafafa', borderRight: 1, borderColor: 'divider', verticalAlign: 'middle' }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#212121' }}>
                                {normalizedRatios.basicDesign.toFixed(3)}
                            </Typography>
                        </TableCell>
                        <TableCell align="center" sx={{ bgcolor: '#fafafa', borderRight: 1, borderColor: 'divider', verticalAlign: 'middle' }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#212121' }}>
                                {normalizedRatios.detailedDesign.toFixed(3)}
                            </Typography>
                        </TableCell>
                        <TableCell align="center" sx={{ bgcolor: '#fafafa', borderRight: 1, borderColor: 'divider', verticalAlign: 'middle' }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#212121' }}>
                                {normalizedRatios.implementation.toFixed(3)}
                            </Typography>
                        </TableCell>
                        <TableCell align="center" sx={{ bgcolor: '#fafafa', borderRight: 1, borderColor: 'divider', verticalAlign: 'middle' }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#212121' }}>
                                {normalizedRatios.integrationTest.toFixed(3)}
                            </Typography>
                        </TableCell>
                        <TableCell align="center" sx={{ bgcolor: '#fafafa', borderRight: 1, borderColor: 'divider', verticalAlign: 'middle' }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#212121' }}>
                                {normalizedRatios.systemTest.toFixed(3)}
                            </Typography>
                        </TableCell>
                        <TableCell align="center" sx={{ 
                            bgcolor: totalRatio === 1 ? '#fafafa' : '#ffebee', 
                            fontWeight: 'bold', 
                            color: totalRatio === 1 ? '#212121' : '#c62828',
                            verticalAlign: 'middle' 
                        }}>
                            {totalRatio.toFixed(3)}
                        </TableCell>
                    </TableRow>
                    <TableRow sx={{ height: 45 }}>
                        <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f0f4ff', borderRight: 1, borderColor: 'divider', verticalAlign: 'middle' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#1565c0' }}>
                                FP
                            </Box>
                        </TableCell>
                        <TableCell align="center" sx={{ bgcolor: '#f0f4ff', borderRight: 1, borderColor: 'divider', verticalAlign: 'middle' }}>
                            <Box sx={{ fontWeight: 'bold', color: '#1565c0' }}>
                                {processFPs?.basicDesign !== undefined ? processFPs.basicDesign.toFixed(2) : '0.00'}
                            </Box>
                        </TableCell>
                        <TableCell align="center" sx={{ bgcolor: '#f0f4ff', borderRight: 1, borderColor: 'divider', verticalAlign: 'middle' }}>
                            <Box sx={{ fontWeight: 'bold', color: '#1565c0' }}>
                                {processFPs?.detailedDesign !== undefined ? processFPs.detailedDesign.toFixed(2) : '0.00'}
                            </Box>
                        </TableCell>
                        <TableCell align="center" sx={{ bgcolor: '#f0f4ff', borderRight: 1, borderColor: 'divider', verticalAlign: 'middle' }}>
                            <Box sx={{ fontWeight: 'bold', color: '#1565c0' }}>
                                {processFPs?.implementation !== undefined ? processFPs.implementation.toFixed(2) : '0.00'}
                            </Box>
                        </TableCell>
                        <TableCell align="center" sx={{ bgcolor: '#f0f4ff', borderRight: 1, borderColor: 'divider', verticalAlign: 'middle' }}>
                            <Box sx={{ fontWeight: 'bold', color: '#1565c0' }}>
                                {processFPs?.integrationTest !== undefined ? processFPs.integrationTest.toFixed(2) : '0.00'}
                            </Box>
                        </TableCell>
                        <TableCell align="center" sx={{ bgcolor: '#f0f4ff', borderRight: 1, borderColor: 'divider', verticalAlign: 'middle' }}>
                            <Box sx={{ fontWeight: 'bold', color: '#1565c0' }}>
                                {processFPs?.systemTest !== undefined ? processFPs.systemTest.toFixed(2) : '0.00'}
                            </Box>
                        </TableCell>
                        <TableCell align="center" sx={{ bgcolor: '#f0f4ff', fontWeight: 'bold', color: '#1565c0', verticalAlign: 'middle' }}>
                            {totalFPValue.toFixed(2)}
                        </TableCell>
                    </TableRow>
                    <TableRow sx={{ height: 45 }}>
                        <TableCell sx={{ fontWeight: 'bold', bgcolor: '#e8f5e9', borderRight: 1, borderColor: 'divider', verticalAlign: 'middle', color: '#2e7d32' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                工数(人月)
                            </Box>
                        </TableCell>
                        <TableCell align="center" sx={{ bgcolor: '#e8f5e9', borderRight: 1, borderColor: 'divider', verticalAlign: 'middle', color: '#2e7d32' }}>
                            <Box sx={{ fontWeight: 'bold' }}>
                                {processManMonths?.basicDesign ? processManMonths.basicDesign.toFixed(2) : '0.00'}
                            </Box>
                        </TableCell>
                        <TableCell align="center" sx={{ bgcolor: '#e8f5e9', borderRight: 1, borderColor: 'divider', verticalAlign: 'middle', color: '#2e7d32' }}>
                            <Box sx={{ fontWeight: 'bold' }}>
                                {processManMonths?.detailedDesign ? processManMonths.detailedDesign.toFixed(2) : '0.00'}
                            </Box>
                        </TableCell>
                        <TableCell align="center" sx={{ bgcolor: '#e8f5e9', borderRight: 1, borderColor: 'divider', verticalAlign: 'middle', color: '#2e7d32' }}>
                            <Box sx={{ fontWeight: 'bold' }}>
                                {processManMonths?.implementation ? processManMonths.implementation.toFixed(2) : '0.00'}
                            </Box>
                        </TableCell>
                        <TableCell align="center" sx={{ bgcolor: '#e8f5e9', borderRight: 1, borderColor: 'divider', verticalAlign: 'middle', color: '#2e7d32' }}>
                            <Box sx={{ fontWeight: 'bold' }}>
                                {processManMonths?.integrationTest ? processManMonths.integrationTest.toFixed(2) : '0.00'}
                            </Box>
                        </TableCell>
                        <TableCell align="center" sx={{ bgcolor: '#e8f5e9', borderRight: 1, borderColor: 'divider', verticalAlign: 'middle', color: '#2e7d32' }}>
                            <Box sx={{ fontWeight: 'bold' }}>
                                {processManMonths?.systemTest ? processManMonths.systemTest.toFixed(2) : '0.00'}
                            </Box>
                        </TableCell>
                        <TableCell align="center" sx={{ bgcolor: '#e8f5e9', fontWeight: 'bold', color: '#2e7d32', verticalAlign: 'middle' }}>
                            {totalManMonths.toFixed(2)}
                        </TableCell>
                    </TableRow>
                    <TableRow sx={{ height: 45 }}>
                        <TableCell sx={{ fontWeight: 'bold', bgcolor: '#fff3e0', borderRight: 1, borderColor: 'divider', verticalAlign: 'middle', color: '#ef6c00' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                標準工期(月)
                            </Box>
                        </TableCell>
                        <TableCell align="center" sx={{ bgcolor: '#fff3e0', borderRight: 1, borderColor: 'divider', verticalAlign: 'middle', color: '#ef6c00' }}>
                            <Box sx={{ fontWeight: 'bold' }}>
                                {processDurations?.basicDesign ? processDurations.basicDesign.toFixed(2) : '0.00'}
                            </Box>
                        </TableCell>
                        <TableCell align="center" sx={{ bgcolor: '#fff3e0', borderRight: 1, borderColor: 'divider', verticalAlign: 'middle', color: '#ef6c00' }}>
                            <Box sx={{ fontWeight: 'bold' }}>
                                {processDurations?.detailedDesign ? processDurations.detailedDesign.toFixed(2) : '0.00'}
                            </Box>
                        </TableCell>
                        <TableCell align="center" sx={{ bgcolor: '#fff3e0', borderRight: 1, borderColor: 'divider', verticalAlign: 'middle', color: '#ef6c00' }}>
                            <Box sx={{ fontWeight: 'bold' }}>
                                {processDurations?.implementation ? processDurations.implementation.toFixed(2) : '0.00'}
                            </Box>
                        </TableCell>
                        <TableCell align="center" sx={{ bgcolor: '#fff3e0', borderRight: 1, borderColor: 'divider', verticalAlign: 'middle', color: '#ef6c00' }}>
                            <Box sx={{ fontWeight: 'bold' }}>
                                {processDurations?.integrationTest ? processDurations.integrationTest.toFixed(2) : '0.00'}
                            </Box>
                        </TableCell>
                        <TableCell align="center" sx={{ bgcolor: '#fff3e0', borderRight: 1, borderColor: 'divider', verticalAlign: 'middle', color: '#ef6c00' }}>
                            <Box sx={{ fontWeight: 'bold' }}>
                                {processDurations?.systemTest ? processDurations.systemTest.toFixed(2) : '0.00'}
                            </Box>
                        </TableCell>
                        <TableCell align="center" sx={{ bgcolor: '#fff3e0', fontWeight: 'bold', color: '#ef6c00', verticalAlign: 'middle' }}>
                            {totalDuration.toFixed(2)}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </Box>
    );
}

export default memo(ProcessBreakdownTable);
