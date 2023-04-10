<script>
  import { geolocate } from '../nominatim.js';
  import { debounce } from 'lodash/function.js';
  import { createEventDispatcher } from 'svelte';
  import { onClickOutside } from './actions.js';
  import { reportEventOnce } from '$lib/plausible.js';

  const dispatch = createEventDispatcher();

  export let query = '';
  let geolocationResults = null,
    geolocatingQuery = false,
    geolocatingButton = false;

  async function initiateGeolocation() {
    if (query.length < 3) return;

    reportEventOnce('geolocation/search');

    geolocationResults = null;

    let queriedFor = query;
    geolocatingQuery = true;
    const res = await geolocate(query);
    if (query === queriedFor) {
      geolocationResults = res;
      geolocatingQuery = false;
    }
  }

  function onGeolocationResultSelect(location) {
    const { lat, lon } = location;
    const detail = { latLng: { lat, lng: lon } };
    dispatch('location', detail);

    query = location.display_name;
    geolocationResults = null;
  }

  function initiateBrowserGeolocation() {
    reportEventOnce('geolocation/browser');

    geolocatingButton = true;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        const detail = { latLng: { lat: latitude, lng: longitude } };
        dispatch('location', detail);

        // query = `${latitude}, ${longitude} (<${accuracy}m)`;
        geolocatingButton = false;
      },
      (positionError) => {
        geolocatingButton = false;
        console.warn('Failed to geolocate', positionError);
      }
    );
  }
</script>

<svelte:body />

<div class="search-control">
  <button
    class="geolocate-navigator"
    on:click={initiateBrowserGeolocation}
    class:geolocating={geolocatingButton}>🛰️</button
  >
  <div class="autocomplete" use:onClickOutside={() => (geolocationResults = null)}>
    <input
      type="search"
      bind:value={query}
      on:focus={initiateGeolocation}
      on:input={debounce(initiateGeolocation, 500)}
      placeholder="Search for a location..."
      class:geolocating={geolocatingQuery}
    />
    {#if geolocationResults}
      <ul class="autocomplete-results">
        {#each geolocationResults.slice(0, 5) as location}
          <li on:click={() => onGeolocationResultSelect(location)}>
            {location.display_name}
          </li>
        {:else}
          <li class="no-results">No results</li>
        {/each}
      </ul>
    {/if}
  </div>
</div>

<style>
  .search-control {
    pointer-events: initial;

    display: flex;
    flex-direction: row;
    align-content: start;
    align-items: start;
    gap: 0.5em;
  }

  .autocomplete {
    width: 100%;
    max-width: 30em;
    margin-right: 40px;
  }
  input[type='search'] {
    width: 100%;
  }

  .autocomplete {
    position: relative;
  }
  .autocomplete-results {
    position: absolute;
    top: 100%;
    width: 100%;

    list-style: none;
    padding: 0;
    margin: 0;

    background: white;
    border-radius: var(--box-border-radius);
    border: 1px solid silver;

    overflow-x: auto;
  }

  .autocomplete-results li {
    min-height: var(--input-min-size);

    display: flex;
    align-items: center;
    padding: 0 1em;

    cursor: default;

    white-space: nowrap;
  }
  .autocomplete-results li:not(.no-results):hover {
    background: #f1f4f6;
  }
  .autocomplete-results li.no-results {
    font-style: italic;
    color: #606060;
  }
  .autocomplete-results li img {
    font-size: 30%;
  }

  @keyframes bg-throb {
    0% {
    }
    50% {
      background-color: #e8e8fc;
    }
    100% {
    }
  }
  input[type='search'].geolocating {
    animation: bg-throb 1s infinite;
  }

  .geolocate-navigator {
    background: white;
    font-size: 130%;
  }

  @keyframes border-throb {
    0% {
    }
    50% {
      border-color: #24246e;
    }
    100% {
    }
  }
  .geolocate-navigator.geolocating {
    animation: border-throb 1s infinite;
  }
</style>
