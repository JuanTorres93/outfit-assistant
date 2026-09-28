import Image from 'next/image';

import { twMerge } from 'tailwind-merge';

import type { OutfitDTO } from '@/application-layer/dtos/OutfitDTO';

type SuggestedOutfitOverviewProps = Pick<React.ComponentProps<typeof Image>, 'src' | 'alt'> & {
  outfitDTO: OutfitDTO;
} & React.HTMLAttributes<HTMLDivElement>;

export default function SuggestedOutfitOverview({
  outfitDTO,
  className,
  children,
  ...props
}: SuggestedOutfitOverviewProps) {
  return (
    <div
      className={twMerge('relative h-40 w-60 overflow-hidden rounded-3xl border', className)}
      {...props}
    >
      {outfitDTO.imageUrl && (
        <Image src={outfitDTO.imageUrl} alt={outfitDTO.name} fill className="object-cover" />
      )}
      <div className="relative z-10">
        {children ?? (
          <div>
            <h1
              className={twMerge(
                'w-14 h-5.5 border rounded-3xl translate-x-45 translate-y-2 text-center text-sm text-white/75',
              )}
            >
              Style
            </h1>
            <h1 className={twMerge('translate-y-20 translate-x-1 text-sm text-white/75')}>
              You have chosen
            </h1>
            <h1 className={twMerge('translate-y-20 translate-x-1 text-xl text-white')}>
              Style of Clothes
            </h1>
          </div>
        )}
      </div>
    </div>
  );
}
