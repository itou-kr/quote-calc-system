import { Provider } from 'react-redux';

import { wrapPromise } from '@front/utils/wrapPromise';
import { initStore } from '@front/hooks/store';

type Props = {
    children: React.ReactNode;
};

const store = wrapPromise(initStore());

function ReduxProvider({ children }: Props) {
    return <Provider store={store.result()}>{children}</Provider>;
}   

export default ReduxProvider;