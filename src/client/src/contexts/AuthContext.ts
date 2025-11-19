import { createContext } from 'react';

type AuthContext = {
    authorized: boolean;
    setAuthorized: (authrized: boolean) => void;
};

const authContext = createContext<AuthContext>({ authorized: true, setAuthorized: (_authorized: boolean) => {} });

export default authContext;