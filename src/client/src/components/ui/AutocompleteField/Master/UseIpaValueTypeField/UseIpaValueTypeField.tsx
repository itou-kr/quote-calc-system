import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useGetIpaValueType } from '@front/hooks/consts';
import AutocompleteField, { Props as AutocompleteFieldProps } from '@front/components/ui/AutocompleteField/AutocompleteField';
import { AutocompleteLabelAndValue } from '@front/types/LabelAndValue';

type Props = Omit<AutocompleteFieldProps, 'options' | 'control' | 'trigger'>;

function UseIpaValueTypeField(props: Props) {
    const { control, trigger } = useFormContext();
    const { t } = useTranslation();
    const getIpaValueType = useGetIpaValueType(t);
    const items = getIpaValueType();

    const handleisOptionEqualToValue = (option: AutocompleteLabelAndValue, value: AutocompleteLabelAndValue) => {
        return option.value === value.value;
    };
    const handleGetOptionLabel = (option: AutocompleteLabelAndValue) => {
        return option.label || '';
    };

    return <AutocompleteField {...props} control={control} trigger={trigger} options={items} isOptionEqualToValue={handleisOptionEqualToValue} getOptionLabel={handleGetOptionLabel} />;
}

export default UseIpaValueTypeField;