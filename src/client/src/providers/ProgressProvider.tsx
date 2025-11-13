import { useState } from 'react';
import { Backdrop, CircularProgress } from '@mui/material';

import { ProgressContext } from '@front/contexts';

type Props = {
    children?: React.ReactNode;
};

function ProgressProvider({ children }: Props) {
    const [progress, setProgress] = useState(false);

    return (
        <ProgressContext.Provider value={{ progress, setProgress }} >
            {children}
            <Backdrop open={progress} sx={(theme) => ({ bgcolor: 'rgba(0, 0, 0, 0.3)', color: 'rgba(0, 0, 0, 0.4)',  zIndex: theme.zIndex.modal + 10 })}> 
                <CircularProgress color="inherit" size={60}/>
            </Backdrop>
        </ProgressContext.Provider>
    );
}

export default ProgressProvider;