// import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
// import { I18nextProvider } from 'react-i18next';
import 'react-resizable/css/styles.css';

// import { setupI18n } from '@front/config/i18n';

import { SystemError } from '@front/pages/ERROR';
// import { wrapPromise } from '@front/utils/wrapPromise';

// import { AreaProvider, AuthProvider, ConfirmProvider, MenuProvider, ProgressProvider, ReduxProvider, RouterProvider, ThemeProvider, ConsentProvider } from '@front/providers';
import { ReduxProvider, RouterProvider, ThemeProvider } from '@front/providers';

// import Nowloading from '@front/components/Nowloading';

// const i18n = wrapPromise(setupI18n());

function App() {
    return (
        <ThemeProvider>
            {/* <Suspense fallback={<Nowloading vertical fulHeight/>}> */}
            {/* <Suspense fallback={null}> */}
                {/* <I18nextProvider i18n={i18n.result()}> */}
                    <ErrorBoundary FallbackComponent={SystemError} >
                        <ReduxProvider>
                            {/* <AreaProvider>
                                <AuthProvider>
                                    <MenuProvider>
                                        <ConsentProvider> */}
                                            <RouterProvider />
                                        {/* </ConsentProvider>
                                    </MenuProvider>
                                </AuthProvider>
                            </AreaProvider> */}
                        </ReduxProvider>
                    </ErrorBoundary>
                {/* </I18nextProvider> */}
            {/* </Suspense> */}
        </ThemeProvider>
    );
}

export default App;