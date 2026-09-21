import testImage from 'public/ExternalFiles/ImageTest.png';

import SuggestedOutfitOverview from './_ui/Images/SuggestedOutfitOverview';

export default function Page() {
  return (
    <div>
      <h1 className="text-3xl font-semibold  font-display">Hello, Next.js!</h1>

      <p className="text-lg ">Welcome to your Next.js app with custom fonts!</p>

      <SuggestedOutfitOverview src={testImage} alt="Should Work" />
    </div>
  );
}
