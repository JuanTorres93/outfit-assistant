'use client';

import { useState } from 'react';

import GarmentBottomSheet from '../bottom-sheets/GarmentBottomSheet';
import GarmentCard from './GarmentCard';

type Garment = {
  image: string;
  name: string;
  category: string;
  color: string;
};

type GarmentListProps = {
  garments: Garment[];
};

function GarmentList({ garments }: GarmentListProps) {
  const [selectedGarment, setSelectedGarment] = useState<Garment | null>(null);

  return (
    <>
      <div className="flex flex-col gap-3">
        {garments.map((garment) => (
          <GarmentCard
            key={garment.name}
            image={garment.image}
            name={garment.name}
            category={garment.category}
            color={garment.color}
            onClick={() => setSelectedGarment(garment)}
          />
        ))}
      </div>

      {selectedGarment && (
        <GarmentBottomSheet garment={selectedGarment} onClose={() => setSelectedGarment(null)} />
      )}
    </>
  );
}

export default GarmentList;
