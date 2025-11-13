import { createContext } from 'react';

export type ConsentContextType = {
    consent?: boolean;
    changeConsent: (consent?: boolean) => void;
};

const consentContext = createContext<ConsentContextType>({ consent: undefined, changeConsent: (_consent?: boolean) => {} });

export default consentContext;