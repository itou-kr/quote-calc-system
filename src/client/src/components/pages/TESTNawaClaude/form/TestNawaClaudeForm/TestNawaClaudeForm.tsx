import { useState } from 'react';
import { Box, TextField, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, Checkbox, IconButton, Collapse, Tabs, Tab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';
import CalculateIcon from '@mui/icons-material/Calculate';
import LockIcon from '@mui/icons-material/Lock';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

type Row = {
    id: number;
    name: string;
    updateType?: string;
    dataInput?: number;
    dataProcessOutput?: number;
    dataOutputOnly?: number;
    fpValue: number;
    note: string;
    selected: boolean;
}

type PhaseData = {
    ratio: number;
    workers: number;
    period: number;
}

type Results = {
    totalFP: number;
    totalWorkload: number;
    phases: {
        basic: PhaseData;
        detailed: PhaseData;
        implementation: PhaseData;
        integration: PhaseData;
        total: PhaseData;
    };
}

function FPEstimationSystem() {
    const [projectName, setProjectName] = useState<string>('');
    const [fpPerMonth, setFpPerMonth] = useState<string>('9999');
    const [caseType, setCaseType] = useState<string>('新規開発');
    const [isResultsExpanded, setIsResultsExpanded] = useState<boolean>(true);
    // タブ切り替え用
    const [tabIndex, setTabIndex] = useState(0);
    // データベース情報入力テーブル
    const [dbRows, setDbRows] = useState<Row[]>([
        { id: 1, name: '社員マスタ', updateType: '更新あり', fpValue: 0, note: '', selected: false },
        { id: 2, name: '部員マスタ', updateType: '更新あり', fpValue: 0, note: '', selected: false },
        { id: 3, name: '', updateType: '参照のみ', fpValue: 0, note: '', selected: true },
        { id: 4, name: '', updateType: '', fpValue: 0, note: '', selected: false },
    ]);
    // 画面情報入力テーブル
    const [screenRows, setScreenRows] = useState<Row[]>([
        { id: 1, name: '社員一覧', dataInput: 0, dataProcessOutput: 1, dataOutputOnly: 1, fpValue: 0, note: '', selected: false },
        { id: 2, name: '社員入力', dataInput: 3, dataProcessOutput: 0, dataOutputOnly: 1, fpValue: 0, note: '', selected: false },
        { id: 3, name: '請求一覧', dataInput: 0, dataProcessOutput: 1, dataOutputOnly: 1, fpValue: 0, note: '', selected: false },
        { id: 4, name: '請求入力', dataInput: 3, dataProcessOutput: 0, dataOutputOnly: 1, fpValue: 0, note: '', selected: false },
    ]);
    const [results] = useState<Results>({
        totalFP: 9999,
        totalWorkload: 9999,
        phases: {
            basic: { ratio: 0.157, workers: 12, period: 2 },
            detailed: { ratio: 0.189, workers: 15, period: 3 },
            implementation: { ratio: 0.354, workers: 28, period: 5 },
            integration: { ratio: 0.164, workers: 13, period: 2 },
            total: { ratio: 0.136, workers: 11, period: 2 }
        }
    });
    // タブ切り替えハンドラ
    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };
    // 行追加・削除
    const addRow = (): void => {
        if (tabIndex === 0) {
            setDbRows([...dbRows, { id: dbRows.length + 1, name: '', updateType: '', fpValue: 0, note: '', selected: false }]);
        } else {
            setScreenRows([...screenRows, { id: screenRows.length + 1, name: '', dataInput: 0, dataProcessOutput: 0, dataOutputOnly: 0, fpValue: 0, note: '', selected: false }]);
        }
    };
    const deleteRow = (): void => {
        if (tabIndex === 0) {
            setDbRows(dbRows.filter(row => !row.selected));
        } else {
            setScreenRows(screenRows.filter(row => !row.selected));
        }
    };
    const toggleSelect = (id: number): void => {
        if (tabIndex === 0) {
            setDbRows(dbRows.map(row => row.id === id ? { ...row, selected: !row.selected } : row));
        } else {
            setScreenRows(screenRows.map(row => row.id === id ? { ...row, selected: !row.selected } : row));
        }
    };
    const updateRow = (id: number, field: keyof Row, value: string | number | boolean): void => {
        if (tabIndex === 0) {
            setDbRows(dbRows.map(row => row.id === id ? { ...row, [field]: value } : row));
        } else {
            setScreenRows(screenRows.map(row => row.id === id ? { ...row, [field]: value } : row));
        }
    };
    const calculateFP = (): void => {
        if (tabIndex === 0) {
            setDbRows(dbRows.map(row => ({ ...row, fpValue: row.name ? Math.floor(Math.random() * 50) + 10 : 0 })));
        } else {
            setScreenRows(screenRows.map(row => ({ ...row, fpValue: row.name ? Math.floor(Math.random() * 50) + 10 : 0 })));
        }
    };
    return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f5f5f5' }}>
        {/* ヘッダー */}
        <Box sx={{ bgcolor: 'primary.main', color: 'white', px: 3, py: 1.5, boxShadow: 3 }}>
        <Typography variant="h6" fontWeight="bold">FP見積システム</Typography>
        </Box>

        {/* 凡例 */}
        <Box sx={{ bgcolor: '#e3f2fd', borderLeft: 4, borderColor: 'primary.main', px: 3, py: 1, mx: 3, mt: 2, borderRadius: '0 4px 4px 0' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: '0.875rem' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EditIcon sx={{ fontSize: 16, color: '#2196f3' }} />
            <Typography variant="body2" fontWeight="medium">入力欄（青枠）</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LockIcon sx={{ fontSize: 16, color: '#757575' }} />
            <Typography variant="body2" fontWeight="medium">自動計算欄（グレー背景）</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <InfoIcon sx={{ fontSize: 16, color: '#64b5f6' }} />
            <Typography variant="body2" color="text.secondary">計算ボタンを押すと自動で値が更新されます</Typography>
            </Box>
        </Box>
        </Box>

        {/* メインコンテンツエリア */}
        <Box sx={{ display: 'flex', flex: 1, gap: 2, p: 3, overflow: 'hidden' }}>
        
        {/* 左サイドバー - 固定幅 */}
        <Box sx={{ width: 320, flexShrink: 0 }}>
            <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 2 }}>
            <Box sx={{ p: 2.5, flex: 1, overflowY: 'auto' }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ borderBottom: 1, borderColor: 'divider', pb: 1.5, mb: 2 }}>
                案件情報
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* 案件名 */}
                <Box>
                    <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                    案件名 <Typography component="span" color="primary">*</Typography>
                    </Typography>
                    <TextField
                    fullWidth
                    size="small"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="案件名を入力"
                    sx={{ 
                        '& .MuiOutlinedInput-root': { 
                        bgcolor: 'white',
                        '& fieldset': { borderColor: '#42a5f5', borderWidth: 2 },
                        '&:hover fieldset': { borderColor: '#1976d2' },
                        '&.Mui-focused fieldset': { borderColor: '#1976d2' }
                        } 
                    }}
                    />
                </Box>

                {/* 生産性 */}
                <Box>
                    <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                    生産性(FP/月) <Typography component="span" color="primary">*</Typography>
                    </Typography>
                    <TextField
                    fullWidth
                    size="small"
                    type="number"
                    value={fpPerMonth}
                    onChange={(e) => setFpPerMonth(e.target.value)}
                    sx={{ 
                        '& .MuiOutlinedInput-root': { 
                        bgcolor: 'white',
                        '& fieldset': { borderColor: '#42a5f5', borderWidth: 2 },
                        '&:hover fieldset': { borderColor: '#1976d2' },
                        '&.Mui-focused fieldset': { borderColor: '#1976d2' }
                        } 
                    }}
                    />
                </Box>

                {/* 案件種別 */}
                <Box>
                    <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                    案件種別 <Typography component="span" color="primary">*</Typography>
                    </Typography>
                    <Select
                    fullWidth
                    size="small"
                    value={caseType}
                    onChange={(e) => setCaseType(e.target.value)}
                    sx={{ 
                        bgcolor: 'white',
                        '& fieldset': { borderColor: '#42a5f5', borderWidth: 2 },
                        '&:hover fieldset': { borderColor: '#1976d2' },
                        '&.Mui-focused fieldset': { borderColor: '#1976d2' }
                    }}
                    >
                    <MenuItem value="新規開発">新規開発</MenuItem>
                    <MenuItem value="機能追加">機能追加</MenuItem>
                    <MenuItem value="保守・改修">保守・改修</MenuItem>
                    </Select>
                </Box>

                {/* アクションボタン */}
                <Box sx={{ display: 'flex', gap: 1, pt: 1 }}>
                    <Button
                    variant="outlined"
                    fullWidth
                    size="small"
                    startIcon={<UploadIcon />}
                    sx={{ fontSize: '0.75rem' }}
                    >
                    インポート
                    </Button>
                    <Button
                    variant="outlined"
                    fullWidth
                    size="small"
                    startIcon={<DownloadIcon />}
                    sx={{ fontSize: '0.75rem' }}
                    >
                    エクスポート
                    </Button>
                </Box>

                {/* 計算結果サマリー */}
                <Box sx={{ pt: 2, borderTop: 1, borderColor: 'divider' }}>
                    <Typography variant="body2" fontWeight="bold" sx={{ mb: 1.5 }}>
                    計算結果サマリー
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Paper sx={{ bgcolor: '#f5f5f5', p: 1.5, position: 'relative', boxShadow: 0 }}>
                        <LockIcon sx={{ position: 'absolute', top: 8, right: 8, fontSize: 14, color: '#9e9e9e' }} />
                        <Typography variant="caption" color="text.secondary">総FP</Typography>
                        <Typography variant="h5" fontWeight="bold">{results.totalFP}</Typography>
                    </Paper>
                    <Paper sx={{ bgcolor: '#f5f5f5', p: 1.5, position: 'relative', boxShadow: 0 }}>
                        <LockIcon sx={{ position: 'absolute', top: 8, right: 8, fontSize: 14, color: '#9e9e9e' }} />
                        <Typography variant="caption" color="text.secondary">総工数(人月)</Typography>
                        <Typography variant="h5" fontWeight="bold">{results.totalWorkload}</Typography>
                    </Paper>
                    </Box>
                </Box>
                </Box>
            </Box>

            {/* 計算ボタン - 下部固定 */}
            <Box sx={{ p: 2.5, borderTop: 1, borderColor: 'divider', bgcolor: '#fafafa' }}>
                <Button
                fullWidth
                variant="contained"
                startIcon={<CalculateIcon />}
                onClick={calculateFP}
                sx={{ py: 1.5, fontWeight: 'medium', bgcolor: '#2196f3', '&:hover': { bgcolor: '#1976d2' } }}
                >
                工数計算を実行
                </Button>
            </Box>
            </Paper>
        </Box>

        {/* メインエリア - テーブル */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Paper sx={{ flex: 1, display: 'flex', flexDirection: 'column', boxShadow: 2 }}>
            {/* タブ切り替え */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#fafafa' }}>
                <Box sx={{ px: 3 }}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ pt: 2 }}>ファンクション情報入力</Typography>
                    <Box sx={{ mt: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ flexGrow: 1 }}>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <Tabs value={tabIndex} onChange={handleTabChange}>
                                        <Tab label="データファンクション" />
                                        <Tab label="トランザクションファンクション" />
                                    </Tabs>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={addRow}
                                    size="small"
                                    sx={{ bgcolor: '#2196f3', '&:hover': { bgcolor: '#1976d2' } }}
                                >
                                    行追加
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    startIcon={<DeleteIcon />}
                                    onClick={deleteRow}
                                    disabled={tabIndex === 0 ? !dbRows.some(r => r.selected) : !screenRows.some(r => r.selected)}
                                    size="small"
                                >
                                    行削除
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
            {/* テーブル本体 - スクロール可能 */}
            <TableContainer sx={{ flex: 1, overflowY: 'auto', overflowX: 'auto', maxHeight: 'calc(100vh - 400px)' }}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ width: 60 }}>No</TableCell>
                            <TableCell sx={{ width: tabIndex === 0 ? 400 : 280 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <EditIcon sx={{ fontSize: 16, color: '#2196f3' }} />
                                    {tabIndex === 0 ? '名称' : '名称'}
                                </Box>
                            </TableCell>
                            {tabIndex === 0 ? (
                                <TableCell sx={{ width: 240 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <EditIcon sx={{ fontSize: 16, color: '#2196f3' }} />
                                        更新種別
                                    </Box>
                                </TableCell>
                            ) : (
                                <>
                                    <TableCell sx={{ width: 120 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <EditIcon sx={{ fontSize: 16, color: '#2196f3' }} />
                                            外部入力
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ width: 120 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <EditIcon sx={{ fontSize: 16, color: '#2196f3' }} />
                                            外部出力
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ width: 120 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <EditIcon sx={{ fontSize: 16, color: '#2196f3' }} />
                                            外部照会
                                        </Box>
                                    </TableCell>
                                </>
                            )}
                            <TableCell sx={{ width: 120 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <LockIcon sx={{ fontSize: 16, color: '#9e9e9e' }} />
                                    FP値
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <EditIcon sx={{ fontSize: 16, color: '#2196f3' }} />
                                    備考
                                </Box>
                            </TableCell>
                            <TableCell sx={{ width: 80 }}>選択</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(tabIndex === 0 ? dbRows : screenRows).map((row) => (
                            <TableRow key={row.id} hover>
                                <TableCell align="center">{row.id}</TableCell>
                                <TableCell>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        value={row.name}
                                        onChange={(e) => updateRow(row.id, 'name', e.target.value)}
                                        placeholder={tabIndex === 0 ? "テーブル名を入力" : "画面名称を入力"}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': { borderColor: '#42a5f5', borderWidth: 2 },
                                                '&:hover fieldset': { borderColor: '#1976d2' },
                                                '&.Mui-focused fieldset': { borderColor: '#1976d2' }
                                            }
                                        }}
                                    />
                                </TableCell>
                                {tabIndex === 0 ? (
                                    <TableCell>
                                        <Select
                                            fullWidth
                                            size="small"
                                            value={row.updateType || ''}
                                            onChange={(e) => updateRow(row.id, 'updateType', e.target.value)}
                                            sx={{
                                                '& fieldset': { borderColor: '#42a5f5', borderWidth: 2 },
                                                '&:hover fieldset': { borderColor: '#1976d2' },
                                                '&.Mui-focused fieldset': { borderColor: '#1976d2' }
                                            }}
                                        >
                                            <MenuItem value="">選択してください</MenuItem>
                                            <MenuItem value="更新あり">更新あり</MenuItem>
                                            <MenuItem value="参照のみ">参照のみ</MenuItem>
                                        </Select>
                                    </TableCell>
                                ) : (
                                    <>
                                        <TableCell>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                type="number"
                                                value={row.dataInput || 0}
                                                onChange={(e) => updateRow(row.id, 'dataInput', Number(e.target.value))}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        '& fieldset': { borderColor: '#42a5f5', borderWidth: 2 },
                                                        '&:hover fieldset': { borderColor: '#1976d2' },
                                                        '&.Mui-focused fieldset': { borderColor: '#1976d2' }
                                                    }
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                type="number"
                                                value={row.dataProcessOutput || 0}
                                                onChange={(e) => updateRow(row.id, 'dataProcessOutput', Number(e.target.value))}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        '& fieldset': { borderColor: '#42a5f5', borderWidth: 2 },
                                                        '&:hover fieldset': { borderColor: '#1976d2' },
                                                        '&.Mui-focused fieldset': { borderColor: '#1976d2' }
                                                    }
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                type="number"
                                                value={row.dataOutputOnly || 0}
                                                onChange={(e) => updateRow(row.id, 'dataOutputOnly', Number(e.target.value))}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        '& fieldset': { borderColor: '#42a5f5', borderWidth: 2 },
                                                        '&:hover fieldset': { borderColor: '#1976d2' },
                                                        '&.Mui-focused fieldset': { borderColor: '#1976d2' }
                                                    }
                                                }}
                                            />
                                        </TableCell>
                                    </>
                                )}
                                <TableCell>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        value={row.fpValue}
                                        InputProps={{
                                            readOnly: true,
                                            sx: { bgcolor: '#f5f5f5', textAlign: 'center' }
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        value={row.note}
                                        onChange={(e) => updateRow(row.id, 'note', e.target.value)}
                                        placeholder="備考を入力"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': { borderColor: '#42a5f5', borderWidth: 2 },
                                                '&:hover fieldset': { borderColor: '#1976d2' },
                                                '&.Mui-focused fieldset': { borderColor: '#1976d2' }
                                            }
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <Checkbox
                                        checked={row.selected}
                                        onChange={() => toggleSelect(row.id)}
                                        size="small"
                                        sx={{
                                            color: '#43a047',
                                            '&.Mui-checked': {
                                                color: '#43a047',
                                            },
                                        }}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            </Paper>
        </Box>
        </Box>

        {/* 下部：工程別詳細結果（折りたたみ可能） */}
        <Paper sx={{ borderTop: 1, borderColor: 'divider', boxShadow: 3 }}>
        <Box
            onClick={() => setIsResultsExpanded(!isResultsExpanded)}
            sx={{ 
            px: 3, 
            py: 1.5, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            cursor: 'pointer',
            '&:hover': { bgcolor: '#fafafa' }
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <LockIcon sx={{ fontSize: 20, color: '#9e9e9e' }} />
            <Typography fontWeight="bold">工程別詳細結果</Typography>
            </Box>
            <IconButton size="small">
            {isResultsExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
        </Box>
        
        <Collapse in={isResultsExpanded}>
            <Box sx={{ px: 3, pb: 2 }}>
            <TableContainer>
                <Table size="small">
                <TableHead>
                    <TableRow sx={{ bgcolor: '#fafafa' }}>
                    <TableCell sx={{ fontWeight: 'medium', width: 120 }}>工程</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'medium' }}>基本設計</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'medium' }}>詳細設計</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'medium' }}>実装</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'medium' }}>結合テスト</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'medium' }}>総合テスト</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                    <TableCell sx={{ fontWeight: 'medium' }}>比率</TableCell>
                    <TableCell align="right" sx={{ bgcolor: '#fafafa' }}>{results.phases.basic.ratio}</TableCell>
                    <TableCell align="right" sx={{ bgcolor: '#fafafa' }}>{results.phases.detailed.ratio}</TableCell>
                    <TableCell align="right" sx={{ bgcolor: '#fafafa' }}>{results.phases.implementation.ratio}</TableCell>
                    <TableCell align="right" sx={{ bgcolor: '#fafafa' }}>{results.phases.integration.ratio}</TableCell>
                    <TableCell align="right" sx={{ bgcolor: '#fafafa' }}>{results.phases.total.ratio}</TableCell>
                    </TableRow>
                    <TableRow>
                    <TableCell sx={{ fontWeight: 'medium' }}>工数</TableCell>
                    <TableCell align="right" sx={{ bgcolor: '#fafafa' }}>{results.phases.basic.workers}</TableCell>
                    <TableCell align="right" sx={{ bgcolor: '#fafafa' }}>{results.phases.detailed.workers}</TableCell>
                    <TableCell align="right" sx={{ bgcolor: '#fafafa' }}>{results.phases.implementation.workers}</TableCell>
                    <TableCell align="right" sx={{ bgcolor: '#fafafa' }}>{results.phases.integration.workers}</TableCell>
                    <TableCell align="right" sx={{ bgcolor: '#fafafa' }}>{results.phases.total.workers}</TableCell>
                    </TableRow>
                    <TableRow>
                    <TableCell sx={{ fontWeight: 'medium' }}>工期</TableCell>
                    <TableCell align="right" sx={{ bgcolor: '#fafafa' }}>{results.phases.basic.period}</TableCell>
                    <TableCell align="right" sx={{ bgcolor: '#fafafa' }}>{results.phases.detailed.period}</TableCell>
                    <TableCell align="right" sx={{ bgcolor: '#fafafa' }}>{results.phases.implementation.period}</TableCell>
                    <TableCell align="right" sx={{ bgcolor: '#fafafa' }}>{results.phases.integration.period}</TableCell>
                    <TableCell align="right" sx={{ bgcolor: '#fafafa' }}>{results.phases.total.period}</TableCell>
                    </TableRow>
                </TableBody>
                </Table>
            </TableContainer>
            </Box>
        </Collapse>
        </Paper>
    </Box>
    );
}

export default FPEstimationSystem;