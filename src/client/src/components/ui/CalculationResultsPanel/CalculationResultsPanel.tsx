import { Box, Paper, Collapse, IconButton, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { ReactNode, memo } from 'react';

export type Props = {
    isOpen: boolean;
    onToggle: () => void;
    summaryContent?: ReactNode;
    children: ReactNode;
};

/**
 * 計算結果パネル
 * 展開/折りたたみ機能を持つパネルコンポーネント
 */
function CalculationResultsPanel(props: Props) {
    const { isOpen, onToggle, summaryContent, children } = props;
    
    return (
        <Box sx={{ mt: 1 }}>
            <Box 
                sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 1, 
                    cursor: 'pointer', 
                    bgcolor: '#f5f5f5', 
                    p: 1, 
                    borderRadius: 1 
                }} 
                onClick={onToggle}
            >
                <AutoAwesomeIcon sx={{ fontSize: 18, mr: 0.5, color: 'text.secondary' }} />
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>計算結果</Typography>
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
                        overflow: 'hidden', 
                        mb: 2,
                        transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
                        opacity: isOpen ? 1 : 0,
                        transform: isOpen ? 'scaleY(1)' : 'scaleY(0.95)',
                        transformOrigin: 'top'
                    }}
                >
                    <Box sx={{ 
                        display: summaryContent ? 'grid' : 'block', 
                        gridTemplateColumns: summaryContent ? { xs: '1fr', md: '320px 1fr' } : undefined, 
                        gap: summaryContent ? 1 : 0, 
                        alignItems: 'start', 
                        p: summaryContent ? 1 : 0 
                    }}>
                        {summaryContent && (
                            <Box sx={{ position: 'sticky', top: 0, alignSelf: 'start', borderRight: 1, borderColor: 'divider', pr: 2 }}>
                                {summaryContent}
                            </Box>
                        )}
                        <Paper elevation={0} sx={{ p: 2, bgcolor: 'white' }}>
                            {children}
                        </Paper>
                    </Box>
                </Paper>
            </Collapse>
        </Box>
    );
}

export default memo(CalculationResultsPanel);
