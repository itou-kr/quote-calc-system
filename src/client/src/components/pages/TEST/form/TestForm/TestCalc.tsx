import { useCalcTest } from '@front/hooks/TEST/test/useCalcTest';

import { Box } from '@mui/material';

import CalcButton from '@front/components/ui/Button/CalcButton';
import { FormType } from './TestForm';
import { CalcTestApplicationRequest } from '@front/openapi';
import { FormProviderProps } from 'react-hook-form';
import { viewId } from '@front/stores/TEST/test/testStore';

type Props = {
    methods: Omit<FormProviderProps<FormType>, 'children'>;
};

function TestCalc(props: Props) {
    const { methods } = props;
    const { handleSubmit, setError } = methods;

    const calcTest = useCalcTest(viewId);
    console.log('calcTest', calcTest);
    
    /**
     * 工数計算
     * @param onValid
     */
    const handleCalcClick = async (onValid: FormType) => {
        const data: CalcTestApplicationRequest = {
            ...onValid,
        };
        console.log('onValid.totalFP', onValid.totalFP)
        console.log('onValid.manMonth', onValid.manMonth)
        const result = await calcTest(data, setError);
        console.log('data', data)
        console.log('result', result)
        console.log('calcTestが完了しました');
    }
    

    return (
        <Box sx={{ borderTop: 1, borderColor: 'divider', p: 3, bgcolor: 'white' }}>
            <CalcButton onClick={handleSubmit(handleCalcClick)} fullWidth/>
        </Box>
    )
};


export default TestCalc;