import { combineReducers } from "@reduxjs/toolkit";

import alertMessageStore from "./alertMessageStore";

const rootReducer = combineReducers({
    [alertMessageStore.name]: alertMessageStore.reducer
});

export default rootReducer;