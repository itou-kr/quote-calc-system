import { useState } from 'react';
import { Box, TextField, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, Checkbox, Divider, AppBar, Toolbar, Tabs, Tab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

function TestNawaForm() {
    // エラーメッセージ表示
    // ...existing code...
    // 生産性
    const [_productivity, _setProductivity] = useState<number>(9999);
    // 比率データ（サンプル値）
    const ratios = [0.157, 0.189, 0.354, 0.164, 0.136];
    // プロジェクト種別
    const [_projectType, _setProjectType] = useState<string>('新規開発');
    // 工数・工期（出力例）
    const outputs = [12, 15, 28, 13, 11];
    const terms = [2, 3, 5, 2, 2];
    // テーブル共通型
    type DataRow = {
        checked: boolean;
        name: string;
        type: string;
        fp: number;
        note: string;
    };
    // データベース情報入力テーブル
    const [dataRows, setDataRows] = useState<DataRow[]>([
        { checked: false, name: '社員マスタ', type: '更新あり', fp: 0, note: '' },
        { checked: false, name: '部員マスタ', type: '更新あり', fp: 0, note: '' },
        { checked: true, name: '', type: '参照のみ', fp: 0, note: '' },
        { checked: false, name: '', type: '', fp: 0, note: '' },
    ]);
    // 画面情報入力テーブル（サンプル）
    const [screenRows, setScreenRows] = useState<DataRow[]>([
        { checked: false, name: '社員一覧画面', type: '参照のみ', fp: 0, note: '' },
        { checked: false, name: '社員編集画面', type: '更新あり', fp: 0, note: '' },
    ]);
    // タブ切り替え
    const [tabIndex, setTabIndex] = useState(0);
    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    // 行追加・削除（タブごとに処理分岐）
    const handleAddRow = () => {
        if (tabIndex === 0) {
            setDataRows([...dataRows, { checked: false, name: '', type: '', fp: 0, note: '' }]);
        } else {
            setScreenRows([...screenRows, { checked: false, name: '', type: '', fp: 0, note: '' }]);
        }
    };
    const handleDeleteRow = () => {
        if (tabIndex === 0) {
            setDataRows(dataRows.filter(row => !row.checked));
        } else {
            setScreenRows(screenRows.filter(row => !row.checked));
        }
    };
    const handleRowChange = (idx: number, key: keyof DataRow, value: any) => {
        if (tabIndex === 0) {
            const newRows = dataRows.map((row, i) =>
                i === idx ? { ...row, [key]: value } : row
            );
            setDataRows(newRows);
        } else {
            const newRows = screenRows.map((row, i) =>
                i === idx ? { ...row, [key]: value } : row
            );
            setScreenRows(newRows);
        }
    };

    // ボタン処理
    // ...existing code...

    return (
        <Box sx={{ maxWidth: 1400, mx: 'auto', mt: 0, p: 0 }}>
            {/* ①ヘッダー（タイトルバー） */}
            <AppBar position="static" color="primary" sx={{ mb: 1 }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        FP見積システム サンプル
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* ②案件名入力欄＋③ボタン */}
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, mb: 2 }}>
                {/* ②案件名入力欄 */}
                <Box sx={{ flex: 2, display: 'flex', alignItems: 'center', p: 1 }}>
                    <Typography sx={{ fontWeight: 'bold', minWidth: 80 }}>案件名</Typography>
                    <TextField size="small" sx={{ background: '#fff', minWidth: 800, flex: 1, ml: 2 }} placeholder="案件名を入力" />
                </Box>
                {/* ③ボタン */}
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2 }}>
                    <Button sx={{ flex: 1 }} variant="outlined">インポート</Button>
                    <Button sx={{ flex: 1 }} variant="outlined">エクスポート</Button>
                </Box>
            </Box>

            {/* ④⑤⑥：3分割グリッド */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '20fr 20fr 10fr 50fr', gap: 2, mb: 2 }}>
                {/* ④生産性（FP/月）+ プロジェクト種別 */}
                <Box sx={{ background: '#f5f5f5', borderRadius: 2, boxShadow: 2, p: 2, display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                            <Typography sx={{ fontWeight: 'bold', minWidth: 100 }}>生産性(FP/月)</Typography>
                            <TextField
                                type="number"
                                value={_productivity}
                                onChange={e => _setProductivity(Number(e.target.value))}
                                size="small"
                                sx={{ background: '#e3f2fd', minWidth: 90 }}
                                inputProps={{ min: 1 }}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                            <Typography sx={{ fontWeight: 'bold', minWidth: 100 }}>案件種別</Typography>
                            <Select
                                value={_projectType}
                                onChange={e => _setProjectType(e.target.value)}
                                size="small"
                                sx={{ background: '#e3f2fd', minWidth: 90 }}
                            >
                                <MenuItem value="新規開発">新規開発</MenuItem>
                                <MenuItem value="改良開発">改良開発</MenuItem>
                                <MenuItem value="再開発">再開発</MenuItem>
                            </Select>
                        </Box>
                    </Box>
                </Box>
                {/* ⑤総FP + 工数 */}
                <Box sx={{ background: '#f8f8f8', borderRadius: 2, boxShadow: 1, p: 2, display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center', justifyContent: 'center' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center', justifyContent: 'center' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                            <Typography sx={{ fontWeight: 'bold', minWidth: 80 }}>総FP</Typography>
                            <Box sx={{ background: '#e8f5e9', px: 2, py: 1, borderRadius: 1, minWidth: 90, textAlign: 'center', fontWeight: 'bold' }}>9999</Box>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2, mt: 2 }}>
                            <Typography sx={{ fontWeight: 'bold', minWidth: 80 }}>工数(人月)</Typography>
                            <Box sx={{ background: '#e8f5e9', px: 2, py: 1, borderRadius: 1, minWidth: 90, textAlign: 'center', fontWeight: 'bold' }}>9999</Box>
                        </Box>
                    </Box>
                </Box>
                {/* ③ボタン */}
                <Box sx={{ background: '#f8f8f8', borderRadius: 2, boxShadow: 1, p: 2, display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center', justifyContent: 'center' }}>
                    <Button sx={{ flex: 1 }} variant="outlined" color="primary">工数計算</Button>
                </Box>
                {/* ⑥比率表 */}
                <Box sx={{ background: '#fff', borderRadius: 2, boxShadow: 1, p: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ background: '#e0e0e0', width: 40 }}></TableCell>
                                    <TableCell sx={{ background: '#e0e0e0', fontWeight: 'bold', width: 80 }}>基本設計</TableCell>
                                    <TableCell sx={{ background: '#e0e0e0', fontWeight: 'bold', width: 80 }}>詳細設計</TableCell>
                                    <TableCell sx={{ background: '#e0e0e0', fontWeight: 'bold', width: 80 }}>実装</TableCell>
                                    <TableCell sx={{ background: '#e0e0e0', fontWeight: 'bold', width: 80 }}>結合テスト</TableCell>
                                    <TableCell sx={{ background: '#e0e0e0', fontWeight: 'bold', width: 80 }}>総合テスト</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell sx={{ background: '#e0e0e0', fontWeight: 'bold', width: 40 }}>比率</TableCell>
                                    {ratios.map((ratio, idx) => (
                                        <TableCell key={idx} sx={{ background: '#fff', color: 'primary.main', fontWeight: 'bold', width: 80 }}>{ratio}</TableCell>
                                    ))}
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ background: '#e0e0e0', fontWeight: 'bold', width: 40 }}>工数</TableCell>
                                    {outputs.map((output, idx) => (
                                        <TableCell key={idx} sx={{ background: '#fff', width: 80 }}>{output}</TableCell>
                                    ))}
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ background: '#e0e0e0', fontWeight: 'bold', width: 40 }}>工期</TableCell>
                                    {terms.map((term, idx) => (
                                        <TableCell key={idx} sx={{ background: '#fff', width: 80 }}>{term}</TableCell>
                                    ))}
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>

            {/* ⑦メインテーブル（データ入力・表示） */}
            <Tabs value={tabIndex} onChange={handleTabChange} sx={{ mb: 0.5 }}>
                <Tab label="データベース情報入力（データファンクション）" />
                <Tab label="画面情報入力（トランザクションファンクション）" />
            </Tabs>
            <TableContainer component={Paper} sx={{ mb: 1 }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>No</TableCell>
                            <TableCell>名称</TableCell>
                            <TableCell>更新種別</TableCell>
                            <TableCell>FP値</TableCell>
                            <TableCell>備考</TableCell>
                            <TableCell>選択</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(tabIndex === 0 ? dataRows : screenRows).map((row, idx) => (
                            <TableRow key={idx}>
                                <TableCell>{idx + 1}</TableCell>
                                <TableCell>
                                    <TextField value={row.name} onChange={e => handleRowChange(idx, 'name', e.target.value)} size="small" sx={{ background: '#e3f2fd' }} />
                                </TableCell>
                                <TableCell>
                                    <Select value={row.type} onChange={e => handleRowChange(idx, 'type', e.target.value)} size="small" sx={{ background: '#e3f2fd', minWidth: 120 }}>
                                        <MenuItem value="更新あり">更新あり</MenuItem>
                                        <MenuItem value="参照のみ">参照のみ</MenuItem>
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ background: '#e8f5e9', width: 80, px: 1, py: 0.5, borderRadius: 1, textAlign: 'center', fontWeight: 'bold' }}>{row.fp}</Box>
                                </TableCell>
                                <TableCell>
                                    <TextField value={row.note} onChange={e => handleRowChange(idx, 'note', e.target.value)} size="small" />
                                </TableCell>
                                <TableCell>
                                    <Checkbox checked={row.checked} onChange={e => handleRowChange(idx, 'checked', e.target.checked)} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddRow}>行追加</Button>
                <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={handleDeleteRow}>行削除</Button>
            </Box>
            <Divider sx={{ my: 3 }} />
        </Box>
    );
}

export default TestNawaForm;