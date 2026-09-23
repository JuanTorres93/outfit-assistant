import CTAButton from './_ui/buttons/CTAButton';
import PillButton from './_ui/buttons/PillButton';
import GarmentCard from './_ui/cards/GarmentCard';
import GarmentList from './_ui/cards/GarmentList';

const garments = [
  {
    image: 'https://images.unsplash.com/photo-1603252110481-7ba873bf42ab',
    name: 'Camisa blanca',
    category: 'Tops',
    color: 'Blanco',
  },
  {
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1',
    name: 'Pantalón negro',
    category: 'Bottoms',
    color: 'Negro',
  },
  {
    image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3',
    name: 'Blazer beige',
    category: 'Outerwear',
    color: 'Beige',
  },
  {
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    name: 'Zapatos negros',
    category: 'Shoes',
    color: 'Negro',
  },
];

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

      <GarmentList garments={garments} />
    </div>
  );
}
