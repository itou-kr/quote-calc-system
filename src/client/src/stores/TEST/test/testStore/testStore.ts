import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// --- viewId --- //
export const viewId = 'TEST';
export type ViewIdType = typeof viewId;

// --- State 型 --- //
export type TestState = {
  loading: boolean;
  value: string;
  isDirty: boolean;
}

// --- 初期値 --- //
const initialState: TestState = {
  loading: false,
  value: '',
  isDirty: false,
};

// --- Slice 定義 --- //
const testStore = createSlice({
  name: 'test',
  initialState,
  reducers: {
    reset: () => initialState,
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setValue: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
    setDirty: (draftState: TestState, action: PayloadAction<boolean>) => {
      draftState.isDirty = action.payload;
    },
  },
});

export default testStore;
