import { useContext } from 'react';
import { MenuContext } from '@front/contexts';

export default function useMenuContext() {
    return useContext(MenuContext);
}