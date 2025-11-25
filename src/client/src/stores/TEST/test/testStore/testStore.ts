import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { LoadingStatus } from '@front/types';

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

export type TestState = {
  loading: LoadingStatus;
  rowCount: number;
  data: TestRow[];
  isDirty: boolean;
};
export type Columns = TestState['data'][number];

export const viewId = 'TEST';
export type ViewIdType = typeof viewId;

const initialState: TestState = {
  loading: undefined,
  rowCount: 0,
  data: [],
  isDirty: false,
};

const testStore = createSlice({
  name: 'test',
  initialState,
  reducers: {
    reset: () => initialState,
    setLoading: (draftState: TestState, action: PayloadAction<LoadingStatus>) => {
      draftState.loading = action.payload;
    },
    setTest: (draftState: TestState, action: PayloadAction<Pick<TestState, 'rowCount' | 'data'>>) => {
      if (draftState.loading) {
        draftState.rowCount = action.payload.rowCount;
        draftState.data = action.payload.data;
        draftState.loading = 'completed';
      }
    },
  },
});

export default testStore;