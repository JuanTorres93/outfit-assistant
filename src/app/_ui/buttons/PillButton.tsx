import { twMerge } from 'tailwind-merge';

import BaseButton from './BaseButton';

function PillButton({
  isSelected,
  ...props
}: { isSelected?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;

  return (
    <BaseButton
      className={twMerge(
        'w-fit px-4 py-2 rounded-full border bg-surface-muted',
        isSelected && 'bg-text text-text-light border-text cursor-default',
        !isSelected && 'border-border hover:border-text-muted/60 hover:bg-surface-muted/80',
        className,
      )}
      {...rest}
    >
      {props.children}
    </BaseButton>
  );
}

export default PillButton;
