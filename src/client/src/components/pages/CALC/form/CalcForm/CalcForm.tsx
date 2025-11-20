import * as yup from 'yup';
import { ViewIdType } from '@front/stores/TEST/test/testStore/index';

function CalcForm(props: Props) {
  const { viewId } = props;
  console.log('CalcForm viewId:', viewId);
  return (
    <div>CalcForm</div>
  );
}

const setupYupScheme = () => {
  return yup.object({
  });
};

export type FormType = yup.InferType<ReturnType<typeof setupYupScheme>>;

type Props = {
  viewId: ViewIdType | 'CALC';
  data?: FormType;
  isDirty: boolean;
};

export default CalcForm;