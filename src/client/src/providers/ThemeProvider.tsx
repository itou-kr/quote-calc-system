import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { colors } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
// import React from 'react';

import type {} from '@mui/material/themeCssVarsAugmentation';

const muiTheme = createTheme({
    cssVariables: true,
    palette: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        primary: (colors as any)[import.meta.env.VITE_MUI_PRIMARY_COLOR] || colors.blueGrey,
        secondary: colors.deepOrange,
    },
    typography: {
        button: {
            textTransform: 'none',
        },
        fontFamily: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: () => {
                return {
                    'html, body': {
                        height: '100vh',
                        maxHeight: '100%',
                        padding: 0,
                        margin: 0,
                    },
                };
            },
        },
        MuiContainer: {
            defaultProps: {
                maxWidth: false,
            },
        },
        MuiButton: {
            defaultProps: {
                variant: 'contained',
            },
        },
        MuiInputLabel: {
            defaultProps: {
                shrink: true,
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                notchedOutline: () => ({ '& legend': { maxWidth: '100%' } }),
            },
        },
        MuiTextField: {
            defaultProps: {
                size: 'small',
            },
        },
        MuiRadio: {
            defaultProps: {
                size: 'small',
            },
        },
        MuiIconButton: {
            defaultProps: {
                size: 'small',
            },
        },
        MuiAutocomplete: {
            defaultProps: {
                size: 'small',
            },
        },
        MuiTable: {
            defaultProps: {
                size: 'small',
            },
        },
    },
});

type Props = {
    children: React.ReactNode;
};

function ThemeProvider(props: Props) {
    const { children } = props;

    return (
        <MuiThemeProvider theme={muiTheme} noSsr>
        <CssBaseline />
            {children}
        </MuiThemeProvider>
    );
}

export default ThemeProvider;