import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

type Props = {
  visible?: boolean;
  vertical?: boolean;
  fullHeight?: boolean;
};

function NowLoading({ visible = true, vertical, fullHeight }: Props) {
  if (!visible) return null;

  return (
    <Grid
      container
      direction={vertical ? 'column' : 'row'}
      justifyContent={vertical ? 'center' : 'flex-start'}
      alignItems="center"
      spacing={1}
      sx={{
        height: fullHeight ? '100vh' : vertical ? '100%' : undefined,
      }}
    >
      <Grid>
        <CircularProgress size={vertical ? undefined : 20} color="inherit" />
      </Grid>
      <Grid>
        <Box display="inline-block">Now</Box>
        <Box display="inline-block" ml={1}>
          Loading...
        </Box>
      </Grid>
    </Grid>
  );
}

export default NowLoading;
