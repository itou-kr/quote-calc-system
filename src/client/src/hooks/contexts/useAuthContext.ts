import { useContext } from 'react';
import { AuthContext } from '@front/contexts';

export default function useAuthContext() {
    return useContext(AuthContext);
}