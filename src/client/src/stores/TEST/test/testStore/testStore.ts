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
/*  t-miwa ビルドできないため、意図的にコメントアウト
export type CalcResult = {
  totalFP: number;        // 総FP
  manMonths: number;      // 総工数
  manMonthsBasicDesign: number;     // 工数_基本設計
  manMonthsDetailedDesign: number;  // 工数_詳細設計
  manMonthsImplementation: number;  // 工数_実装
  manMonthsIntegrationTest: number; // 工数_結合テスト
  manMonthsSystemTest: number;      // 工数_総合テスト
  durationBasicDesign: number;      // 工期_基本設計
  durationDetailedDesign: number;   // 工期_詳細設計
  durationImplementation: number;   // 工期_実装
  durationIntegrationTest: number;  // 工期_結合テスト
  durationSystemTest: number;       // 工期_総合テスト
}
*/
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