<script lang="ts">
  import Autocomplete from '$lib/Autocomplete.svelte';
  import { reportEventOnce } from '$lib/plausible';
  import Steps from '$lib/Steps.svelte';
  import { delay } from '$lib/utils.svelte';
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

  let mapLocation: LngLatLike = [-76.00657875182223, 40.71890782088397];
  let deviceLocation = $state<maplibre.LngLat | null>(null);

  function pickLocation(e: MapMouseEvent) {
    deviceLocation = e.lngLat;
    reportEventOnce('geolocation/search');
  }

  function onGeolocate(e: MapMoveEvent) {
    if ('geolocateSource' in e && e.geolocateSource) {
      const lngLat = e.target.getCenter();
      deviceLocation = lngLat;
      reportEventOnce('geolocation/browser');
    }
  }

  function onAutocompleteSelect(lngLat: maplibre.LngLat) {
    deviceLocation = lngLat;
    reportEventOnce('geolocation/search');
  }
</script>

<Steps progress={1} />

<div class="prose">
  <h2>Pick the location of your Tasmota device</h2>
  <p>You can use the <span class="geolocate"></span> button to find your location.</p>
</div>

<div class="container">
  <div class="loadingMap">
    {#await delay(5000)}
      <div class="loadingText">
        <span class="loading loading-spinner loading-xs"></span> Loading map
      </div>
    {:then}
      <div class="notLoadingText">
        Not loading? Let me know:
        <a href="mailto:tasmota@reinier.nz" class="link">tasmota@reinier.nz</a>
      </div>
    {/await}
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
        fitBoundsOptions={{ maxZoom: 10, speed: 4 }}
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

<div class="prose">
  {#if deviceLocation}
    <a
      href={`/${encodeURIComponent(deviceLocation.lng)},${encodeURIComponent(deviceLocation.lat)}`}
      class="next btn btn-primary">Choose time zone &rarr;</a
    >
  {:else}
    <span class="next btn btn-disabled">Choose time zone &rarr;</span>
  {/if}
</div>

<style>
  .prose {
    max-width: 100%;
    text-align: center;
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
    background-color: oklch(var(--b2));

    display: flex;
    flex-direction: column;
    gap: 0.5em;
    justify-content: center;

    .loadingText {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5em;
    }

    .notLoadingText {
      color: color-mix(in oklch, 70% oklch(var(--bc)), oklch(var(--b1)));
      text-align: center;
    }
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

  :global(.position-control) {
    position: relative;
    z-index: 1;
  }
</style>
