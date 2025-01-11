<script lang="ts">
  import { page } from '$app/state';
  import { reverseGeocodeCountry } from '$lib/nominatim';
  import Steps from '$lib/Steps.svelte';
  import { countriesAndTimezones } from '$lib/timezones';

  const { lngLat: lngLatParam } = $derived(page.params);

  const lngLat = $derived(lngLatParam?.split(',').map(Number));
  const reverseLocation = $derived(reverseGeocodeCountry({ lat: lngLat[1], lng: lngLat[0] }));
  const timeZones = $derived(
    reverseLocation.then((reverseLocation) =>
      (
        countriesAndTimezones as {
          countryIso: string;
          countryDisplayName: string;
          countryTimeZone: string;
        }[]
      )
        .filter((tz) => tz.countryIso === reverseLocation.countryIso)
        .sort((a, z) => {
          try {
            const now = new Date();
            const hereTime = new Intl.DateTimeFormat([], { timeStyle: 'short' }).format(now);
            const aTime = new Intl.DateTimeFormat([], {
              timeZone: a.countryTimeZone,
              timeStyle: 'short',
            }).format(now);
            const zTime = new Intl.DateTimeFormat([], {
              timeZone: z.countryTimeZone,
              timeStyle: 'short',
            }).format(now);

            if (aTime === hereTime && zTime !== hereTime) return -1;
            if (zTime === hereTime && aTime !== hereTime) return 1;
            return (
              aTime.localeCompare(zTime, undefined, { numeric: true, sensitivity: 'base' }) ||
              a.countryTimeZone.localeCompare(z.countryTimeZone)
            );
          } catch (error) {
            console.warn(error);
            return a.countryTimeZone.localeCompare(z.countryTimeZone);
          }
        }),
    ),
  );

  let timeZone = $state<string | null>(null);
</script>

<Steps progress={2} />

<div class="prose">
  <h2>Select a time zone</h2>

  {#await Promise.all([reverseLocation, timeZones])}
    <p>
      Your Tasmota device is located in <span class="loading loading-spinner loading-sm"></span>.
    </p>
    <p>Select the time zone that best matches your device&rsquo;s location.</p>

    <select class="select select-disabled">
      <option>Loading&hellip;</option>
    </select>
  {:then [reverseLocation, timeZones]}
    <p>
      Your Tasmota device is located in <abbr title={reverseLocation.displayName}
        >{reverseLocation.country}</abbr
      >.
    </p>
    <p>Select the time zone that best matches your device&rsquo;s location.</p>

    <select
      class="select"
      class:select-primary={!timeZone}
      class:select-success={timeZone}
      bind:value={timeZone}
    >
      <option></option>
      {#each timeZones as timeZone}
        <option value={timeZone.countryTimeZone}>
          {timeZone.countryTimeZone}
          {@render time(timeZone.countryTimeZone)}
        </option>
      {/each}
    </select>
  {:catch}
    <div role="alert" class="alert alert-error">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>
        Error while reverse geocoding country. Please notify <a
          href="mailto:tasmota@reinier.nz"
          class="link">tasmota@reinier.nz</a
        >.
      </span>
    </div>
  {/await}

  <p>
    <a href="/" class="btn btn-link">&larr; Different location</a>
    {#if timeZone}
      <a
        href={`/${encodeURIComponent(lngLat[0])},${encodeURIComponent(lngLat[1])}/${encodeURIComponent(timeZone)}`}
        class="next btn btn-primary"
      >
        Enter commands &rarr;
      </a>
    {:else}
      <span class="next btn btn-disabled"> Enter commands &rarr; </span>
    {/if}
  </p>
</div>

{#snippet time(timeZone: string)}
  <svelte:boundary>
    ({new Intl.DateTimeFormat([], { timeZone, timeStyle: 'short' }).format(new Date())})

    {#snippet failed(error, reset)}{/snippet}
  </svelte:boundary>
{/snippet}

<style>
  .prose {
    max-width: 100%;
    text-align: center;
  }
</style>
