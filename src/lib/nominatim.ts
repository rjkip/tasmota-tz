type GeocodingResults = {
  /** @example 20601386 */
  place_id: number;
  /** @example 'Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright' */
  licence: string;
  /** @example 'relation' */
  osm_type: string;
  /** @example 2730349 */
  osm_id: number;
  /** @example '-43.530955' */
  lat: string;
  /** @example '172.6364343' */
  lon: string;
  /** @example 'boundary' */
  category: string;
  /** @example 'administrative' */
  type: string;
  /** @example 14 */
  place_rank: number;
  /** @example 0.646320462985571 */
  importance: number;
  /** @example 'city' */
  addresstype: string;
  /** @example 'Christchurch' */
  name: string;
  /** @example 'Christchurch, Christchurch City, Canterbury, New Zealand' */
  display_name: string;
  /** @example ['-43.6292014', '-43.3890866', '172.3930248', '172.8216267'] */
  boundingbox: [string, string, string, string];
}[];

export async function geolocate(userQuery: string): Promise<GeocodingResults> {
  if (!userQuery.trim()) {
    return [];
  }

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search.php?` +
      new URLSearchParams({ q: userQuery, format: 'jsonv2' }),
  );

  return await response.json();
}

export async function reverseGeocodeCountry({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}): Promise<{
  countryIso: string;
  displayName: string;
  country: string;
  lat: number;
  lng: number;
}> {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse.php?` +
      new URLSearchParams({ lat: lat.toString(), lon: lng.toString(), format: 'jsonv2' }),
  );
  const result = await response.json();

  return {
    countryIso:
      result &&
      result.address &&
      result.address.country_code &&
      result.address.country_code.toUpperCase(),
    displayName: result && result.display_name,
    country: result && result.address && result.address.country,
    lat,
    lng,
  };
}
