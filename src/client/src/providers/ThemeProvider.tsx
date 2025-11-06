// import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import React from 'react';

type Props = {
    children?: React.ReactNode;
};

function ThemeProvider(props: Props) {
    const { children } = props;

    return (
        <>
            {/* <MuiThemeProvider theme={muiTheme} noSsr> */}
            {/* <CssBaseline /> */}
            {children}
            {/* </MuiThemeProvider> */}
        </>
    );
}

export default ThemeProvider;