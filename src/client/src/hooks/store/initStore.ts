import { setupStore } from '@front/stores';

/**
 * ストアの初期設定
 * @returns
*/
export async function initStore() {
    return setupStore({});
}

export default initStore;