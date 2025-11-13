import { createContext } from 'react';
import { Menu } from '@front/types';

type MenuContext = {
    menu?: Menu;
};

const menuContext = createContext<MenuContext>({ menu: undefined });

export default menuContext;