import { twMerge } from 'tailwind-merge';

import BaseImage from './BaseImage';

function HeroImage({
  isSecondary,
  ...props
}: { isSecondary?: boolean } & React.ImgHTMLAttributes<HTMLImageElement>) {
  const { className, ...rest } = props;

  return (
    <BaseImage
      className={twMerge(
        isSecondary ? 'w-full h-full object-cover' : 'w-full h-full object-contain',
        className,
      )}
      {...rest}
    />
  );
}

export default HeroImage;
