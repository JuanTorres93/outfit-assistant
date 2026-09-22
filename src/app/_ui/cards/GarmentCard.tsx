type GarmentCardProps = {
  image: string;
  name: string;
  category: string;
  color: string;
  //   onClick: () => void;
};

function GarmentCard({ image, name, category, color }: GarmentCardProps) {
  return (
    <button
      type="button"
      //   onClick={onClick}
      className="flex w-full items-center gap-4 rounded-xl border border-border bg-surface p-3 text-left"
    >
      <img src={image} alt={name} className="size-16 rounded-lg object-cover" />

      <div className="flex-1">
        <p className="font-medium text-text">{name}</p>
        <p className="text-sm text-text-muted">
          {category} · {color}
        </p>
      </div>

      <span className="text-xl text-text-muted">›</span>
    </button>
  );
}

export default GarmentCard;
