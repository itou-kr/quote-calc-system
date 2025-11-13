import { createContext } from 'react';

type ProgressContext = {
    progress: boolean;
    setProgress: (progress: boolean) => void;
};

const progressContext = createContext<ProgressContext>({ progress: false, setProgress: (_progress: boolean) => {} });

export default progressContext;