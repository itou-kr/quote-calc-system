import { combineReducers } from "@reduxjs/toolkit";

import alertMessageStore from "./alertMessageStore";
import testStore from "./TEST/test/testStore";
import calcStore from "./TEST/test/calcStore";

const rootReducer = combineReducers({
    [alertMessageStore.name]: alertMessageStore.reducer,
    [testStore.name]: testStore.reducer,
    [calcStore.name]: calcStore.reducer,
});

export default rootReducer;