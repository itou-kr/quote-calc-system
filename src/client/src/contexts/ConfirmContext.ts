import { createContext } from 'react';
import { ConfirmOptions, ConfirmResult } from '@front/hooks/ui/confirm/useConfirm';

export type CallBackConfirmContext = (options: ConfirmOptions) => Promise<ConfirmResult>;

const ConfirmContext = createContext<CallBackConfirmContext>(() => Promise.resolve(undefined));

export default ConfirmContext;