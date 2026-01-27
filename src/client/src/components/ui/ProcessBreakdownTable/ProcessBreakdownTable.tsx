import { Box, Paper, Table, TableHead, TableBody, TableRow, TableCell, Collapse, IconButton, Typography, TextField, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import EditIcon from '@mui/icons-material/Edit';
import { ChangeEvent, memo, useEffect, useRef, useState } from 'react';

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
    onRatiosChange?: (ratios: ProcessRatios) => void;
    onResetRatios?: () => void;
};

/**
 * 工程別内訳テーブル
 * @param props - processRatios: 工程比率, processManMonths: 工数, processDurations: 工期, isOpen: 開閉状態, onToggle: 開閉ハンドラー
 * @returns 工程別内訳テーブルコンポーネント
 */
function ProcessBreakdownTable(props: Props) {
    const { processRatios, processManMonths, processDurations, isOpen, onToggle, onRatiosChange, onResetRatios } = props;
    const [localRatios, setLocalRatios] = useState<ProcessRatios>(
        processRatios ?? { basicDesign: 0, detailedDesign: 0, implementation: 0, integrationTest: 0, systemTest: 0 }
    );
    const debounceRef = useRef<number | null>(null);

    // 親からの更新を同期（リセット等）
    useEffect(() => {
        if (processRatios) setLocalRatios(processRatios);
    }, [processRatios]);

    const scheduleNotifyParent = (next: ProcessRatios) => {
        if (!onRatiosChange) return;
        if (debounceRef.current) {
            window.clearTimeout(debounceRef.current);
        }
        debounceRef.current = window.setTimeout(() => {
            onRatiosChange(next);
        }, 120);
    };

    const handleRatioChange = (key: keyof ProcessRatios) => (e: ChangeEvent<HTMLInputElement>) => {
        const val = Math.max(0, Math.min(1, Number(e.target.value)));
        const next = { ...localRatios, [key]: Number.isFinite(val) ? val : 0 };
        setLocalRatios(next);
        scheduleNotifyParent(next);
    };
    
    // 合計値を計算
    const totalRatio = (localRatios.basicDesign || 0) + (localRatios.detailedDesign || 0) + (localRatios.implementation || 0) + (localRatios.integrationTest || 0) + (localRatios.systemTest || 0);
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
                                <TableCell sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', borderRight: 1, borderColor: 'divider', width: 140 }}></TableCell>
                                <TableCell align="center" sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', borderRight: 1, borderColor: 'divider', width: 'calc((100% - 420px) / 5)' }}>基本設計</TableCell>
                                <TableCell align="center" sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', borderRight: 1, borderColor: 'divider', width: 'calc((100% - 420px) / 5)' }}>詳細設計</TableCell>
                                <TableCell align="center" sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', borderRight: 1, borderColor: 'divider', width: 'calc((100% - 420px) / 5)' }}>実装</TableCell>
                                <TableCell align="center" sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', borderRight: 1, borderColor: 'divider', width: 'calc((100% - 420px) / 5)' }}>結合テスト</TableCell>
                                <TableCell align="center" sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', borderRight: 1, borderColor: 'divider', width: 'calc((100% - 420px) / 5)' }}>総合テスト</TableCell>
                                <TableCell align="center" sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', borderLeft: 1, borderRight: 1, borderColor: 'divider', width: 150 }}></TableCell>
                                <TableCell align="center" sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', width: 150 }}>合計</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'white', borderRight: 1, borderColor: 'divider' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <EditIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                        比率
                                    </Box>
                                </TableCell>
                                <TableCell align="center" sx={{ bgcolor: 'white', borderRight: 1, borderColor: 'divider' }}>
                                    <TextField
                                        size="small"
                                        type="number"
                                        value={localRatios.basicDesign}
                                        onChange={handleRatioChange('basicDesign')}
                                        inputProps={{ step: 0.001, min: 0, max: 1 }}
                                        sx={{
                                            '& .MuiInputBase-root': { bgcolor: 'white', width: 100 },
                                            '& input[type="number"]': { paddingRight: '4px', textAlign: 'center' },
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="center" sx={{ bgcolor: 'white', borderRight: 1, borderColor: 'divider' }}>
                                    <TextField
                                        size="small"
                                        type="number"
                                        value={localRatios.detailedDesign}
                                        onChange={handleRatioChange('detailedDesign')}
                                        inputProps={{ step: 0.001, min: 0, max: 1 }}
                                        sx={{
                                            '& .MuiInputBase-root': { bgcolor: 'white', width: 100 },
                                            '& input[type="number"]': { paddingRight: '4px', textAlign: 'center' },
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="center" sx={{ bgcolor: 'white', borderRight: 1, borderColor: 'divider' }}>
                                    <TextField
                                        size="small"
                                        type="number"
                                        value={localRatios.implementation}
                                        onChange={handleRatioChange('implementation')}
                                        inputProps={{ step: 0.001, min: 0, max: 1 }}
                                        sx={{
                                            '& .MuiInputBase-root': { bgcolor: 'white', width: 100 },
                                            '& input[type="number"]': { paddingRight: '4px', textAlign: 'center' },
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="center" sx={{ bgcolor: 'white', borderRight: 1, borderColor: 'divider' }}>
                                    <TextField
                                        size="small"
                                        type="number"
                                        value={localRatios.integrationTest}
                                        onChange={handleRatioChange('integrationTest')}
                                        inputProps={{ step: 0.001, min: 0, max: 1 }}
                                        sx={{
                                            '& .MuiInputBase-root': { bgcolor: 'white', width: 100 },
                                            '& input[type="number"]': { paddingRight: '4px', textAlign: 'center' },
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="center" sx={{ bgcolor: 'white', borderRight: 1, borderColor: 'divider' }}>
                                    <TextField
                                        size="small"
                                        type="number"
                                        value={localRatios.systemTest}
                                        onChange={handleRatioChange('systemTest')}
                                        inputProps={{ step: 0.001, min: 0, max: 1 }}
                                        sx={{
                                            '& .MuiInputBase-root': { bgcolor: 'white', width: 100 },
                                            '& input[type="number"]': { paddingRight: '4px', textAlign: 'center' },
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="center" sx={{ bgcolor: 'white', borderLeft: 1, borderRight: 1, borderColor: 'divider' }}>
                                    {onResetRatios && (
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<RestartAltIcon />}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onResetRatios();
                                            }}
                                            sx={{ fontSize: '0.75rem', py: 0.5, px: 1.5 }}
                                        >
                                            リセット
                                        </Button>
                                    )}
                                </TableCell>
                                <TableCell align="center" sx={{ bgcolor: 'white', fontWeight: 'bold', color: '#212121' }}>
                                    {totalRatio.toFixed(3)}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'white', borderRight: 1, borderColor: 'divider' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#212121' }}>
                                        <AutoAwesomeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                        工数(人月)
                                    </Box>
                                </TableCell>
                                <TableCell align="center" sx={{ bgcolor: 'white', borderRight: 1, borderColor: 'divider' }}>
                                    <Box sx={{ fontWeight: 'bold', color: '#212121', height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {processManMonths?.basicDesign ? processManMonths.basicDesign.toFixed(2) : '0.00'}
                                    </Box>
                                </TableCell>
                                <TableCell align="center" sx={{ bgcolor: 'white', borderRight: 1, borderColor: 'divider' }}>
                                    <Box sx={{ fontWeight: 'bold', color: '#212121', height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {processManMonths?.detailedDesign ? processManMonths.detailedDesign.toFixed(2) : '0.00'}
                                    </Box>
                                </TableCell>
                                <TableCell align="center" sx={{ bgcolor: 'white', borderRight: 1, borderColor: 'divider' }}>
                                    <Box sx={{ fontWeight: 'bold', color: '#212121', height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {processManMonths?.implementation ? processManMonths.implementation.toFixed(2) : '0.00'}
                                    </Box>
                                </TableCell>
                                <TableCell align="center" sx={{ bgcolor: 'white', borderRight: 1, borderColor: 'divider' }}>
                                    <Box sx={{ fontWeight: 'bold', color: '#212121', height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {processManMonths?.integrationTest ? processManMonths.integrationTest.toFixed(2) : '0.00'}
                                    </Box>
                                </TableCell>
                                <TableCell align="center" sx={{ bgcolor: 'white', borderRight: 1, borderColor: 'divider' }}>
                                    <Box sx={{ fontWeight: 'bold', color: '#212121', height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {processManMonths?.systemTest ? processManMonths.systemTest.toFixed(2) : '0.00'}
                                    </Box>
                                </TableCell>
                                <TableCell align="center" sx={{ bgcolor: 'white', borderLeft: 1, borderRight: 1, borderColor: 'divider' }}>-</TableCell>
                                <TableCell align="center" sx={{ bgcolor: 'white', fontWeight: 'bold', color: '#212121' }}>
                                    {totalManMonths.toFixed(2)}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'white', borderRight: 1, borderColor: 'divider' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#212121' }}>
                                        <AutoAwesomeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                        標準工期(月)
                                    </Box>
                                </TableCell>
                                <TableCell align="center" sx={{ bgcolor: 'white', borderRight: 1, borderColor: 'divider' }}>
                                    <Box sx={{ fontWeight: 'bold', color: '#212121', height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {processDurations?.basicDesign ? processDurations.basicDesign.toFixed(2) : '0.00'}
                                    </Box>
                                </TableCell>
                                <TableCell align="center" sx={{ bgcolor: 'white', borderRight: 1, borderColor: 'divider' }}>
                                    <Box sx={{ fontWeight: 'bold', color: '#212121', height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {processDurations?.detailedDesign ? processDurations.detailedDesign.toFixed(2) : '0.00'}
                                    </Box>
                                </TableCell>
                                <TableCell align="center" sx={{ bgcolor: 'white', borderRight: 1, borderColor: 'divider' }}>
                                    <Box sx={{ fontWeight: 'bold', color: '#212121', height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {processDurations?.implementation ? processDurations.implementation.toFixed(2) : '0.00'}
                                    </Box>
                                </TableCell>
                                <TableCell align="center" sx={{ bgcolor: 'white', borderRight: 1, borderColor: 'divider' }}>
                                    <Box sx={{ fontWeight: 'bold', color: '#212121', height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {processDurations?.integrationTest ? processDurations.integrationTest.toFixed(2) : '0.00'}
                                    </Box>
                                </TableCell>
                                <TableCell align="center" sx={{ bgcolor: 'white', borderRight: 1, borderColor: 'divider' }}>
                                    <Box sx={{ fontWeight: 'bold', color: '#212121', height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {processDurations?.systemTest ? processDurations.systemTest.toFixed(2) : '0.00'}
                                    </Box>
                                </TableCell>
                                <TableCell align="center" sx={{ bgcolor: 'white', borderLeft: 1, borderRight: 1, borderColor: 'divider' }}>-</TableCell>
                                <TableCell align="center" sx={{ bgcolor: 'white', fontWeight: 'bold', color: '#212121' }}>
                                    {totalDuration.toFixed(2)}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Paper>
            </Collapse>
        </Box>
    );
}

export default memo(ProcessBreakdownTable);
