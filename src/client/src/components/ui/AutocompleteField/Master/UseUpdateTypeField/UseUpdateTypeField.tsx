import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useGetUpdateType } from '@front/hooks/consts';
import AutocompleteField, { Props as AutocompleteFieldProps } from '@front/components/ui/AutocompleteField/AutocompleteField';
import { AutocompleteLabelAndValue } from '@front/types/LabelAndValue';

type Props = Omit<AutocompleteFieldProps, 'options' | 'control' | 'trigger'>;

function UseUpdateTypeField(props: Props) {
    const { control, trigger } = useFormContext();
    const { t } = useTranslation();
    const getUpdateType = useGetUpdateType(t);
    const items = getUpdateType();

    const handleisOptionEqualToValue = (option: AutocompleteLabelAndValue, value: AutocompleteLabelAndValue) => {
        return option.value === value.value;
    };
    const handleGetOptionLabel = (option: AutocompleteLabelAndValue) => {
        return option.label || '';
    };

    return <AutocompleteField {...props} control={control} trigger={trigger} options={items} isOptionEqualToValue={handleisOptionEqualToValue} getOptionLabel={handleGetOptionLabel} sx={{ width: '100%' }} />;
}

export default UseUpdateTypeField;