'use client';

type GarmentCardProps = {
  image: string;
  name: string;
  category: string;
  color: string;
  onClick?: () => void;
};

function GarmentCard({ image, name, category, color, onClick }: GarmentCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-xl border border-border bg-surface p-3 text-left transition-colors hover:bg-surface-muted"
    >
      <img src={image} alt={name} className="size-20 rounded-lg object-cover" />

      <div className="flex-1">
        <p className="font-semibold text-text">{name}</p>
        <p className="text-sm text-text-muted">
          {category} · {color}
        </p>
      </div>

      <span className="text-xl text-text-muted">›</span>
    </button>
  );
}

export default GarmentCard;
