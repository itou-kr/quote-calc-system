import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { LoadingStatus } from '@front/types';
import { CalcTestApplication200Response } from '@front/openapi';

export type TestRow = {
  // id: number;
  // projectName: string;
  // productivityFPPerMonth: number;
  // projectType: string;

  // テーブル項目
  isSelected: string;
  rowNo: number;
  itemName: string;
  updateType: string;
  fpValue: string;
  note: string;
};

export type CalcState = {
  loading: LoadingStatus;
  rowCount: number;
  data: CalcTestApplication200Response | undefined;
  isDirty: boolean;
};

export const viewId = 'CALC';
export type ViewIdType = typeof viewId;

const initialState: CalcState = {
  loading: undefined,
  rowCount: 0,
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
  },
});

export default calcStore;