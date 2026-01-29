
import { Paper } from '@mui/material';
import FlexBox from '@front/components/ui/FlexBox';
import SummarizeIcon from '@mui/icons-material/Summarize';
import Text from '@front/components/ui/Text';



export default function Header() {

    return (
        <Paper elevation={0} sx={{ bgcolor: '#1976d2', color: 'white', p: 2, borderRadius: 0 }}>
            <FlexBox gap={1}>
                <SummarizeIcon sx={{ fontSize: 32 }} />
                <Text variant="pageTitle">見積作成支援ツール</Text>
            </FlexBox>
        </Paper>
    )
}