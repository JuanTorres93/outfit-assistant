const options = [
  'Más cómoda',
  'Más holgada',
  'Más formal',
  'Más cálida',
  'Más ligera',
  'Otro color',
  'Similar',
  'Más corta',
];

type Garment = {
  name: string;
  category: string;
  color: string;
};

type GarmentBottomSheetProps = {
  garment: Garment;
  onClose?: () => void;
};
function GarmentBottomSheet({ garment, onClose }: GarmentBottomSheetProps) {
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />

      <div className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl border border-border bg-surface p-6 shadow-lg relative">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />

        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-5 top-5 text-xl text-text-muted"
        >
          ×
        </button>
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />
        <h2 className="text-xl font-semibold text-text">Cambiar</h2>

        <p className="mt-1 text-lg font-medium text-text">{garment.name}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              className="rounded-xl border border-border bg-surface-muted p-3 text-left text-text"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export default GarmentBottomSheet;
