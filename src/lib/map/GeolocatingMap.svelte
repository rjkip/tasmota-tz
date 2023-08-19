<script>
  import SearchControl from './SearchControl.svelte';
  import Map from './Map.svelte';
  import { createEventDispatcher } from 'svelte';
  import { reverseGeocodeCountry } from '../nominatim.js';

  const dispatch = createEventDispatcher();

  export let tall = true;

  let marker,
    geolocating = false,
    searchQuery;

  async function resolveAndDispatch(latLng) {
    marker = latLng;

    let countryIso = null;
    try {
      geolocating = true;
      dispatch('locating');
      const result = await reverseGeocodeCountry(latLng);
      countryIso = result.countryIso;
      searchQuery = result.displayName;
    } catch (e) {
      console.warn('Error while reverse geolocating; continuing without country ISO code...', e);
    } finally {
      geolocating = false;
    }

    dispatch('located', { latLng, countryIso });
  }
</script>

<div class="layers" class:tall>
  <div class="controls-layer">
    <div class="search-control">
      <SearchControl
        bind:query={searchQuery}
        on:location={(event) => resolveAndDispatch(event.detail.latLng)}
      />
    </div>
  </div>
  <div class="map-layer">
    <Map
      {marker}
      markerThrobbing={geolocating}
      on:click={(event) => resolveAndDispatch(event.detail.latLng)}
    />
  </div>
</div>

<style>
  .layers {
    display: grid;
    height: 20rem;
    transition: height 500ms;
  }
  .layers.tall {
    height: 30rem;
  }
  .layers > * {
    grid-column: 1;
    grid-row: 1;
  }

  .controls-layer {
    z-index: 100;
    pointer-events: none;
  }
  .map-layer {
    z-index: 0;
  }

  .search-control {
    margin: 1em;
  }
</style>
