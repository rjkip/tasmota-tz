<script>
  import { browser } from '$app/environment';
  import { createEventDispatcher, onMount } from 'svelte';

  export let latLng;
  let mountPoint, map, marker;

  let dispatch = createEventDispatcher();

  onMount(async () => {
    if (!browser) return;

    const L = await import('leaflet');
    map = L.map(mountPoint);
    mountPoint.focus({ preventScroll: true });
    map.setView([30, 20], 2);

    L.tileLayer(`https://tile.osm.ch/switzerland/{z}/{x}/{y}.png`, {
      attribution: `© <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors`
    }).addTo(map);

    map.on('click', (event) => {
      latLng = event.latlng;
      if (latLng.lat < -90) latLng.lat = Math.ceil(-latLng.lat / 180) * 180 + latLng.lat;
      if (latLng.lng < -180) latLng.lng = Math.ceil(-latLng.lng / 360) * 360 + latLng.lng;
      latLng.lat = ((latLng.lat + 90) % 180) - 90;
      latLng.lng = ((latLng.lng + 180) % 360) - 180;
      dispatch('latLngSelected');
    });

    return () => {
      map.remove();
      map = null;
    };
  });

  $: if (map && latLng) {
    if (marker) {
      marker.remove();
    }
    try {
      marker = L.marker(latLng).addTo(map);
      map.panInside(latLng, { padding: [150, 150] });
    } catch (e) {
      console.warn(e);
    }
  }
</script>

<div class="map" bind:this={mountPoint} />

<style>
  .map {
    width: 100%;
    height: 100%;
  }
</style>
