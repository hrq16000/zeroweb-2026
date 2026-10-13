import { CITIES, STATES } from "@/lib/geo-data";
import { listIndexableGeoServicePairs } from "@/lib/geo-service-indexability";

const INDEXABLE_CITY_SLUGS = new Set(
  listIndexableGeoServicePairs().map((item) => item.citySlug),
);

export function isGeoCityIndexable(citySlug: string) {
  return INDEXABLE_CITY_SLUGS.has(citySlug);
}

export function listIndexableGeoCities() {
  return Object.values(CITIES).filter((city) => isGeoCityIndexable(city.slug));
}

export function isGeoStateIndexable(stateSlug: string) {
  const state = STATES[stateSlug];
  return Boolean(state?.cities.some((citySlug) => isGeoCityIndexable(citySlug)));
}

export function listIndexableGeoStates() {
  return Object.values(STATES).filter((state) => isGeoStateIndexable(state.slug));
}
