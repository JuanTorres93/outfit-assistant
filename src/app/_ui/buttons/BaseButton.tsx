import { twMerge } from 'tailwind-merge';

function BaseButton({ ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;

  return (
    <button className={twMerge('font-medium transition cursor-pointer ', className)} {...rest}>
      {props.children}
    </button>
  );
}

export default BaseButton;
