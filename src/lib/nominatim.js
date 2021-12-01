export async function geolocate(newCountryDisplayName) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search.php?` +
      new URLSearchParams({ q: newCountryDisplayName, format: 'jsonv2' })
  );
  const result = await response.json();

  if (result && result[0] && result[0].lat && result[0].lon) {
    const { lat, lon } = result[0];
    return { lat, lng: lon };
  } else {
    return null;
  }
}

export async function reverseGeocodeCountry({ lat, lng }) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse.php?` +
      new URLSearchParams({ lat: lat, lon: lng, format: 'jsonv2' })
  );
  const result = await response.json();

  return (
    result &&
    result.address &&
    result.address.country_code &&
    result.address.country_code.toUpperCase()
  );
}
