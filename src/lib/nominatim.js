export async function geolocate(userQuery) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search.php?` +
      new URLSearchParams({ q: userQuery, format: 'jsonv2' }),
  );

  return await response.json();
}

export async function reverseGeocodeCountry({ lat, lng }) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse.php?` +
      new URLSearchParams({ lat: lat, lon: lng, format: 'jsonv2' }),
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
  };
}
