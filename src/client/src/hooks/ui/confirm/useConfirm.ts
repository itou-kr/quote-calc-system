import React, { useContext } from "react";

import { ConfirmContext, CallBackConfirmContext } from "@front/contexts";
import  { ConfirmResultYes, ConfirmResultNo, ConfirmResultCancel } from  '@front/components/ui/Confirm';

export type ConfirmOptions = {
    title?: React.ReactNode;
    icon?: 'error' | 'warning' | 'info' | 'help';
    message: React.ReactNode;
    yes?: React.ReactNode;
    no?: React. ReactNode;
    cancel?: React.ReactNode;
    close?: boolean;
};

export type ConfirmResult = ConfirmResultYes | ConfirmResultNo | ConfirmResultCancel | undefined;

function useConfirm() {
    const confirm = useContext<CallBackConfirmContext>(ConfirmContext);
    return confirm;
}

export default useConfirm;
