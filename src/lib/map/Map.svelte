<script>
  import { browser } from '$app/environment';
  import { createEventDispatcher, onMount } from 'svelte';
  import { reportEventOnce } from '$lib/plausible.js';

  export let marker,
    markerThrobbing = false;
  let mountPoint, map, markerObj;

  let dispatch = createEventDispatcher();

  onMount(async () => {
    if (!browser) return;

    const L = await import('leaflet');

    map = L.map(mountPoint, { zoomControl: false, doubleClickZoom: false });
    L.control
      .zoom({
        position: 'topright',
      })
      .addTo(map);

    // Get most of the world's land mass into view
    map.setView([30, 20], 2);

    L.tileLayer(`https://tile.osm.ch/switzerland/{z}/{x}/{y}.png`, {
      attribution: `© <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors`,
    }).addTo(map);

    map.on('click', (event) => {
      if (event.originalEvent.detail === 1) {
        reportEventOnce('geolocation/map-select');
        dispatch('click', { latLng: event.latlng });
      }
    });

    let observer;
    if ('ResizeObserver' in window) {
      observer = new ResizeObserver(() => map.invalidateSize());
      observer.observe(mountPoint);
    }

    return () => {
      if (observer) {
        observer.unobserve(mountPoint);
      }
      map.remove();
    };
  });

  $: if (map && marker) {
    if (markerObj) markerObj.remove();
    markerObj = L.marker(marker).addTo(map);
    markerObj._icon.classList.toggle('map-marker-throbbing', markerThrobbing);
    map.flyTo(marker, Math.max(map.getZoom(), 5));
  }
</script>

<div class="map" bind:this={mountPoint} />

<style>
  .map {
    width: 100%;
    height: 100%;
    border-radius: var(--box-border-radius);
  }

  :global(.map-marker-throbbing) {
    animation: opacity-throb 500ms infinite;
  }
</style>
