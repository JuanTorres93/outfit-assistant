import { twMerge } from 'tailwind-merge';

import BaseButton from './BaseButton';

function CTAButton({
  isSecondary,
  ...props
}: { isSecondary?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;

  return (
    <BaseButton
      className={twMerge(
        'flex py-4 w-full rounded-xl justify-center bg-text text-text-light hover:bg-text/93',
        isSecondary && 'bg-text-light text-text-muted hover:bg-text-muted/5',
        className,
      )}
      {...rest}
    >
      {props.children}
    </BaseButton>
  );
}

export default CTAButton;
