import testImage from './ExternalFiles/ImageTEst.png';
import HeroImage from './_ui/Images/HeroImage';

export default function Page() {
  return (
    <div>
      <h1 className="text-3xl font-semibold  font-display">Hello, Next.js!</h1>

      <p className="text-lg ">Welcome to your Next.js app with custom fonts!</p>

      <HeroImage src={'./ExternalFiles/ImageTEst.png'} alt="Should Work" />
    </div>
  );
}
