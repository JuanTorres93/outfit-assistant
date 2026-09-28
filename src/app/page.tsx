import testImage from 'public/ExternalFiles/ImageTest.png';

import SuggestedOutfitOverview from './_ui/Images/SuggestedOutfitOverview';

const outfitDTO = {
  id: 'test-outfit-id',
  userId: 'test-user-id',
  garmentIds: ['test-garment-id-1', 'test-garment-id-2'],
  imageUrl: testImage,
  name: 'Test Outfit',
};

export default function Page() {
  return (
    <div>
      <h1 className="text-3xl font-semibold  font-display">Hello, Next.js!</h1>

      <p className="text-lg ">Welcome to your Next.js app with custom fonts!</p>

      <SuggestedOutfitOverview outfitDTO={outfitDTO} />
    </div>
  );
}
