# What `Garment` needs to provide

The `Outfit` recommendation engine (`src/application-layer/outfit/`) — `OutfitGenerator` and `RecommendationEngine` in particular — consumes garments through a narrow interface, [`MatchableGarment`](../src/application-layer/outfit/generation/MatchableGarment.ts).

`Garment` doesn't have to be literally this shape — it just needs to expose these as public getters, the same way `User`/`Event`/`Closet`/`Outfit` expose plain getters over their value objects today.

- **`id`**: `string` — used by everything.
- **`category`**: `'shirt' | 'pants' | 'jacket' | 'dress' | 'shoes' | 'accessory'` — used by `OutfitGenerator`.
  Same union proposed originally. Mapped internally to a slot (top/bottom/outerwear/dress/footwear/accessory) to know which garments can combine into one outfit.
- **`color`**: `{ name: string; hue: number; brightness: number; isNeutral: boolean }` — used by `ColorMatcher`.
  `hue` is 0-359° on the color wheel (ignored when `isNeutral` is `true`). `brightness` is 0 (darkest) - 100 (brightest). `isNeutral` flags white/black/gray/beige/etc., which are treated as compatible with everything.
- **`style`**: `Style[]` (`'business' | 'casual' | 'elegant' | 'minimalist' | 'sport' | 'streetwear' | 'vintage'`) — used by `StyleMatcher`.
  An array because a garment can fit more than one style (e.g. a plain white tee is both `casual` and `minimalist`).
- **`season`**: `Season[]` (`'spring' | 'summer' | 'autumn' | 'winter'`) — used by `OutfitGenerator`.
  Which seasons the garment is appropriate for; used as a hard filter.
- **`occasion`**: `Occasion[]` (`'office' | 'party' | 'wedding' | 'gym' | 'casual'`) — used by `OutfitGenerator`.
  Which occasions the garment suits; used as a hard filter.
- **`fit`**: `'slim' | 'regular' | 'wide'` — used by `BodyRecommendationService`.
  **New field, not in the original proposal.** Needed to score silhouette balance (e.g. avoiding wide top + wide bottom) and body-shape-specific adjustments.
- **`warmthLevel`**: `number` — used by `WeatherFilter`, `RecommendationEngine`.
  0 (lightest, e.g. a tank top) to 10 (warmest, e.g. a heavy winter coat). `WeatherFilter` computes an allowed `[min, max]` range from the temperature and this is checked against it.
- **`isWaterproof`**: `boolean`, optional — reserved.
  `WeatherFilter` already computes `requiresWaterproof` from rain/snow conditions; not yet wired into `OutfitGenerator`'s filtering, but the field is reserved for when it is.
- **`isWindproof`**: `boolean`, optional — reserved.
  Same as above, for `requiresWindproof`.

## Fields from the original proposal this layer does **not** need

`name`, `material`, `imageUrl`, `dominantColors`, `formality`, `tags` are all useful for display or
for `GarmentAnalysisService`/`ImageExtractionService`, but nothing in `src/application-layer/outfit/`
reads them today. Keep them on `Garment` for your own purposes — they just don't need to match any
particular shape as far as this code is concerned.

## Still open

- `OutfitGenerator` doesn't yet filter on `isWaterproof`/`isWindproof` even though `WeatherFilter`
  computes whether they're required — wire this up once it matters.
- `formality` could feed an `OccasionMatcher` (e.g. preferring higher formality for weddings/office)
  if one gets built later; not required for now.
