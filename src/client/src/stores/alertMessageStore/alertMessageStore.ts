import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AlertColor } from '@mui/material/Alert';

import { ViewId } from '@front/types';

export type MessageType = { severity: AlertColor; message: string; icon?: boolean; title?: boolean | string };
export type AlertMessageType = { message: string[]; icon?: boolean; title?: boolean | string };
export type AlertMessageState = {
    messages: { [viewId in ViewId]?: { [severity in AlertColor]?: AlertMessageType } };
};

const initialState: AlertMessageState = {
    messages: {},
};

const alertMessageStore = createSlice({
    name: 'alertMessage',
    initialState,
    reducers: {
        reset: () => initialState,
        clear: (draftState: AlertMessageState, action: PayloadAction<ViewId>) => {
            if (draftState.messages[action.payload]) {
                draftState.messages[action.payload] = undefined;
            }
        },
        setMessage: (draftState: AlertMessageState, action: PayloadAction<{ viewId: ViewId; message: MessageType }>) => {
            const {
                viewId,
                message: { severity, message, icon, title },
            } = action.payload;

            if (draftState.messages[viewId]) {
                if (draftState.messages[viewId][severity]) {
                    draftState.messages[viewId][severity].message.push(message);
                } else {
                    draftState.messages[viewId][severity] = { message: [message], icon, title };
                }
            } else {
                draftState.messages[viewId] = { [severity]: { message: [message], icon, title }};
            }
        },
        overrideMessage: (draftState: AlertMessageState, action: PayloadAction<{ viewId: ViewId; message: MessageType }>) => {
            const {
                viewId,
                message: { severity, message, icon, title },
            } = action.payload;

            if (draftState.messages[viewId]) {
                draftState.messages[viewId][severity] = { message: [message], icon, title };
            } else {
                draftState.messages[viewId] = { [severity]: { message: [message], icon, title } };
            }
        },
    },
});

export default alertMessageStore;