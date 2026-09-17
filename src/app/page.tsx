import CTAButton from './_ui/buttons/CTAButton';
import PillButton from './_ui/buttons/PillButton';

export default function Page() {
  return (
    <div>
      {/* Playground for components during initial dev phase */}
      <h1 className="text-3xl font-semibold  font-display">Hello, Next.js!</h1>

      <p className="text-lg ">Welcome to your Next.js app with custom fonts!</p>

      <PillButton isSelected>Selected Button</PillButton>
      <PillButton>Button</PillButton>

      <CTAButton>Continue</CTAButton>
      <CTAButton isSecondary>Skip</CTAButton>
    </div>
  );
}
