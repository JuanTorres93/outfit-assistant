import CTAButton from './_ui/buttons/CTAButton';
import PillButton from './_ui/buttons/PillButton';
import GarmentCard from './_ui/cards/GarmentCard';

const garments = [
  {
    image: 'https://images.unsplash.com/photo-1603252110481-7ba873bf42ab',
    name: 'Camisa blanca',
    category: 'Tops',
    color: 'Blanco',
  },
  {
    image: 'https://images.unsplash.com/photo-1603252110481-7ba873bf42ab',
    name: 'Pantalón negro',
    category: 'Bottoms',
    color: 'Negro',
  },
  {
    image: 'https://images.unsplash.com/photo-1603252110481-7ba873bf42ab',
    name: 'Blazer beige',
    category: 'Outerwear',
    color: 'Beige',
  },
  {
    image: 'https://images.unsplash.com/photo-1603252110481-7ba873bf42ab',
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

      <div className="flex flex-col gap-3">
        {garments.map((garment) => (
          <GarmentCard
            key={garment.name}
            image={garment.image}
            name={garment.name}
            category={garment.category}
            color={garment.color}
          />
        ))}
      </div>
    </div>
  );
}
