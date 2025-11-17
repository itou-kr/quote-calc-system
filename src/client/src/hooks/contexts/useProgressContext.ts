import { useContext } from 'react';
import { ProgressContext } from '@front/contexts';

export default function useProgressContext() {
    return useContext(ProgressContext);
}