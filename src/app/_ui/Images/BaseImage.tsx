import { twMerge } from 'tailwind-merge';

function BaseImage({ ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  const { className, ...rest } = props;

  return <img className={twMerge('w-full h-full', className)} {...rest} />;
}

export default BaseImage;
