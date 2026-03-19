import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { LoadingStatus } from '@front/types';
import { CalcTestApplication200Response } from '@front/openapi';
import { CalcTestApplicationRequest } from '@front/openapi';
import type {
    CalcTestApplicationRequestProjectTypeEnum,
    CalcTestApplicationRequestIpaValueTypeEnum,
    DataFunctionUpdateType,
} from '@front/openapi/models';


export type CalcState = {
  loading: LoadingStatus;
  data: CalcTestApplication200Response & CalcTestApplicationRequest| undefined;
  isDirty: boolean;
};

export const viewId = 'CALC';
export type ViewIdType = typeof viewId;

const initialState: CalcState = {
  loading: undefined,
  data: undefined,
  isDirty: false,
};

const calcStore = createSlice({
  name: 'calc',
  initialState,
  reducers: {
    reset: () => initialState,
    setLoading: (draftState: CalcState, action: PayloadAction<LoadingStatus>) => {
      draftState.loading = action.payload;
    },
    setCalc: (draftState: CalcState, action: PayloadAction<CalcState['data']>) => {
      draftState.data = action.payload;
    },
    setDirty: (draftState: CalcState, action: PayloadAction<boolean>) => {
      draftState.isDirty = action.payload;
    },
    setProjectType: (
      draftState,
      action: PayloadAction<CalcTestApplicationRequestProjectTypeEnum>
    ) => {
      if (!draftState.data) return;
      draftState.data.projectType = action.payload;
    },
    setIpaValueType: (
      draftState,
      action: PayloadAction<CalcTestApplicationRequestIpaValueTypeEnum>
    ) => {
      if (!draftState.data) return;
      draftState.data.ipaValueType = action.payload;
    },
    setDataFunctions: (
      draftState,
      action: PayloadAction<
        { updateType: DataFunctionUpdateType }[]
      >
    ) => {
      if (!draftState.data) return;
      draftState.data.dataFunctions = action.payload;
    },
  },
});

export default calcStore;
