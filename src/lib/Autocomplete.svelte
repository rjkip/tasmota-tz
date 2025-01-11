<script lang="ts">
  import { goto } from '$app/navigation';
  import { geolocate } from '$lib/nominatim';
  import { debounced } from '$lib/utils.svelte';
  import maplibre from 'maplibre-gl';

  let { onselect }: { onselect(lngLat: maplibre.LngLat): void } = $props();

  let search = $state('');
  let debouncedSearch = $derived.by(debounced(() => search, 1000));
  let autocomplete = $derived.by(() => geolocate(debouncedSearch));
  $effect(() => {
    autocomplete.then(() => {
      focussedItem = 0;
      autocompleteOpen = true;
    });
  });

  let focussedItem = $state(0);
  let autocompleteOpen = $state(false);

  let onKeyDown = $derived(
    autocomplete.then(
      (autocomplete) =>
        function onKeyDown(event: KeyboardEvent) {
          if (event.key === 'ArrowDown') {
            event.preventDefault();
            focussedItem = Math.min(focussedItem + 1, autocomplete.length - 1);
          } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            focussedItem = Math.max(focussedItem - 1, 0);
          } else if (event.key === 'Enter') {
            event.preventDefault();
            goto(`/${autocomplete[focussedItem].lon},${autocomplete[focussedItem].lat}`, {
              replaceState: true,
              noScroll: true,
            });
            autocompleteOpen = false;
          }
        },
    ),
  );

  function onAutocompleteClick(e: MouseEvent, lngLat: maplibre.LngLat) {
    e.preventDefault();

    onselect(lngLat);
    autocompleteOpen = false;
  }

  function onSearchFocus() {
    focussedItem = 0;
    autocompleteOpen = true;
  }
</script>

<div class="autocomplete">
  <label class="input input-bordered">
    {#if search !== debouncedSearch}
      <span class="loading loading-spinner loading-xs"></span>
    {:else}
      {#await autocomplete}
        <span class="loading loading-spinner loading-xs"></span>
      {/await}
    {/if}
    {#await onKeyDown}
      <input
        type="search"
        placeholder="Search location&hellip;"
        onfocus={onSearchFocus}
        bind:value={search}
      />
    {:then onKeyDown}
      <input
        type="search"
        placeholder="Search location&hellip;"
        onfocus={onSearchFocus}
        bind:value={search}
        onkeydown={onKeyDown}
      />
    {:catch}
      <input
        type="search"
        placeholder="Search location&hellip;"
        onfocus={onSearchFocus}
        bind:value={search}
      />
    {/await}
  </label>
  {#await autocomplete}
    <!---->
  {:then autocomplete}
    {#if autocomplete.length > 0 && autocompleteOpen}
      <ul class="options menu rounded-box bg-base-200">
        {#each autocomplete.slice(0, 5) as { display_name, lat, lon }, index}
          <li class:focussed={focussedItem === index}>
            <a href={`/${lon},${lat}`} onclick={(e) => onAutocompleteClick(e, { lng: lon, lat })}>
              {display_name}
            </a>
          </li>
        {/each}
      </ul>
    {/if}
  {:catch}
    <ul class="options menu rounded-box bg-base-200">
      <li>❌ Error while autocompleting</li>
    </ul>
  {/await}
</div>

<style>
  .input {
    display: flex;
    align-items: center;
    gap: 0.25em;
  }

  .autocomplete {
    position: relative;
  }

  .options {
    position: absolute;

    a {
      max-width: 450px;
      overflow-x: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .focussed {
    background-color: var(--fallback-bc, oklch(var(--bc) / 0.1));
  }
</style>
