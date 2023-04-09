export function clampLatLng(latLng) {
  if (latLng.lat < -90) latLng.lat = Math.ceil(-latLng.lat / 180) * 180 + latLng.lat;
  if (latLng.lng < -180) latLng.lng = Math.ceil(-latLng.lng / 360) * 360 + latLng.lng;
  if (latLng.lat > 90) latLng.lat = ((latLng.lat + 90) % 180) - 90;
  if (latLng.lng > 180) latLng.lng = ((latLng.lng + 180) % 360) - 180;

  return {
    lat: latLng.lat < -90 ? Math.ceil(-latLng.lat / 180) * 180 + latLng.lat : latLng.lat,
    lng:
      latLng.lng < -180
        ? (latLng.lng = Math.ceil(-latLng.lng / 360) * 360 + latLng.lng)
        : latLng.lng
  };
}
