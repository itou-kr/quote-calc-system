import { combineReducers } from "@reduxjs/toolkit";

import alertMessageStore from "./alertMessageStore";
import testStore from "./TEST/test/testStore";

const rootReducer = combineReducers({
    [alertMessageStore.name]: alertMessageStore.reducer,
    [testStore.name]: testStore.reducer,
});

export default rootReducer;