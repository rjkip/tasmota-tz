<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import Autocomplete from '$lib/Autocomplete.svelte';
  import { reportEventOnce } from '$lib/plausible';
  import Steps from '$lib/Steps.svelte';
  import maplibre, { type LngLatLike, type MapMouseEvent } from 'maplibre-gl';
  import {
    Control,
    DefaultMarker,
    FullscreenControl,
    GeolocateControl,
    MapLibre,
    NavigationControl,
    ScaleControl,
    type MapMoveEvent,
  } from 'svelte-maplibre';

  let mapLocation: LatLngLike = [-76.00657875182223, 40.71890782088397];
  let deviceLocation = $derived.by<LngLatLike | null>(() => {
    const lngLat = page.params.lngLat?.split(',').map(Number);

    if (lngLat?.length !== 2 || !lngLat.every(Number.isFinite)) {
      return null;
    }

    return lngLat as [number, number];
  });

  function pickLocation(e: MapMouseEvent) {
    goto(`/${e.lngLat.lng},${e.lngLat.lat}`, { noScroll: true });
    reportEventOnce('geolocation/search');
  }

  function onGeolocate(e: MapMoveEvent) {
    if ('geolocateSource' in e && e.geolocateSource) {
      const lngLat = e.target.getCenter();
      goto(`/${lngLat.lng},${lngLat.lat}`, { noScroll: true });
      reportEventOnce('geolocation/browser');
    }
  }

  function onAutocompleteSelect(lngLat: maplibre.LngLat) {
    goto(`/${lngLat.lng},${lngLat.lat}`, { noScroll: true });
    reportEventOnce('geolocation/search');
  }
</script>

<div class="steps">
  <Steps progress={1} />
</div>

<div class="step-1 prose">
  <h2>Pick the location of your Tasmota device</h2>
  <p>You can use the <span class="geolocate"></span> button to find your location.</p>
</div>

<div class="container">
  <div class="loadingMap">
    <span class="loading loading-spinner loading-xs"></span> Loading map
  </div>

  <MapLibre
    center={deviceLocation ?? mapLocation}
    zoom={deviceLocation ? 10 : 5}
    class="map"
    style="https://tiles.openfreemap.org/styles/bright"
    onclick={pickLocation}
    onmoveend={onGeolocate}
  >
    {#snippet children({ map })}
      <Control position="top-left" class="position-control">
        <Autocomplete onselect={onAutocompleteSelect} />
      </Control>
      <GeolocateControl
        position="top-left"
        fitBoundsOptions={{ maxZoom: 10 }}
        showUserLocation={false}
      />
      <NavigationControl position="top-right" showCompass={false} />
      <FullscreenControl position="top-right" />
      <ScaleControl />

      {#if deviceLocation}
        <DefaultMarker lngLat={deviceLocation} />
      {/if}
    {/snippet}
  </MapLibre>
</div>

<div class="buttons">
  <a
    href={`/${deviceLocation?.lng},${deviceLocation?.lat}/timezone`}
    class="next btn btn-primary"
    disabled={!deviceLocation}>Choose time zone &rarr;</a
  >
</div>

<style>
  .steps {
    width: 100%;
    margin: 2rem 0;
  }

  .container {
    display: grid;
    width: 100%;
    aspect-ratio: 16 / 9;
    place-items: center;

    margin-block: 1rem;
  }
  .loadingMap,
  :global(.map) {
    grid-column: 1;
    grid-row: 1;
    width: 100%;
    height: 100%;
    border-radius: 3px;
  }

  .loadingMap {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5em;

    background-color: oklch(var(--b2));
  }

  .geolocate {
    background: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='29' height='29' fill='%23333' viewBox='0 0 20 20'%3E%3Cpath d='M10 4C9 4 9 5 9 5v.1A5 5 0 0 0 5.1 9H5s-1 0-1 1 1 1 1 1h.1A5 5 0 0 0 9 14.9v.1s0 1 1 1 1-1 1-1v-.1a5 5 0 0 0 3.9-3.9h.1s1 0 1-1-1-1-1-1h-.1A5 5 0 0 0 11 5.1V5s0-1-1-1m0 2.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 1 1 0-7'/%3E%3Ccircle cx='10' cy='10' r='2'/%3E%3C/svg%3E");
    display: inline-block;
    width: 1lh;
    height: 1lh;
    vertical-align: middle;

    @media (prefers-color-scheme: dark) {
      filter: invert(1);
    }
  }

  .buttons {
    margin-block: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;

    .next {
      margin-inline-start: auto;
    }
  }

  :global(.position-control) {
    position: relative;
    z-index: 1;
  }
</style>
