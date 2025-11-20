import Button, { Props as BaseButtonProps } from '@front/components/ui/Button';
import { useProgressContext } from '@front/hooks/contexts';
import { useThrowError } from '@front/hooks/error';
import { useConfirm, ConfirmOptions } from '@front/hooks/ui/confirm';

export type Props = BaseButtonProps & {
    confirm?: ConfirmOptions;
};

function ProgressButton(props: Props) {
    const { onClick, disabled, children, confirm: confirmOptions, ...buttonProps } = props;
    const { progress, setProgress } = useProgressContext();

    const confirm = useConfirm();
    const throwError = useThrowError();

    const  handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (progress) return;

        setProgress(true);

        try {
            const shouldHandleOnClock = !confirmOptions || (await confirm(confirmOptions)) === 'yes';
            if (shouldHandleOnClock) {
                await onClick(e);
            }
        } catch (error) {
            throwError(error);
        } finally {
            setProgress(false);
        }
    };

    return (
        <Button {...buttonProps} onClick={handleClick} disabled={progress || disabled}>
            {children}
        </Button>
    );
}

export default ProgressButton;