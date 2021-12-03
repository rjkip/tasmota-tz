<script>
  import { Timezone } from '@tubular/time';
  import '../skeleton-normalize.css';
  import '../skeleton.css';
  import '../app.css';
  import Map from '$lib/Map.svelte';
  import { browser } from '$app/env';
  import { geolocate, reverseGeocodeCountry } from '$lib/nominatim';
  import {
    countries,
    countryDisplayNameByIso,
    getTimeZonesForCountryIso,
    weekFromDayOfMonth
  } from '$lib/timezones';
  import TasmotaTzDocs from '$lib/TasmotaTzDocs.svelte';
  import Command from '$lib/Command.svelte';

  // Big blurp of code; don't feel like fixing until necessary

  let loading = false,
    latLng = { lat: -41.54147, lng: 172.96875 },
    reversedLatLng,
    selectedCountryIso,
    selectedTimeZone;

  // I'm sure there's something more clever than this, but it works
  $: if (latLng.lat < -90) latLng.lat = Math.ceil(-latLng.lat / 180) * 180 + latLng.lat;
  $: if (latLng.lng < -180) latLng.lng = Math.ceil(-latLng.lng / 360) * 360 + latLng.lng;
  $: if (latLng.lat > 90) latLng.lat = ((latLng.lat + 90) % 180) - 90;
  $: if (latLng.lng > 180) latLng.lng = ((latLng.lng + 180) % 360) - 180;

  $: selectedCountryDisplayName = selectedCountryIso && countryDisplayNameByIso(selectedCountryIso);

  $: hemisphere = latLng.lat >= 0 ? '0' : '1'; // 0=North, 1=South

  $: timeZones = selectedCountryIso && getTimeZonesForCountryIso(selectedCountryIso);

  $: timeZoneInfo = selectedTimeZone && Timezone.getTimezone(selectedTimeZone, latLng.lng);
  $: timeZoneUtcOffsetMinutes = timeZoneInfo && timeZoneInfo.utcOffset / 60;
  $: timeZoneUtcDstOffsetMinutes =
    timeZoneInfo && timeZoneUtcOffsetMinutes + timeZoneInfo.dstOffset / 60;
  $: timeZoneUtcOffsetFormatted = timeZoneInfo && Timezone.formatUtcOffset(timeZoneInfo.utcOffset);
  $: daylightSavingStarts = timeZoneInfo && timeZoneInfo._dstRule;
  $: daylightSavingEnds = timeZoneInfo && timeZoneInfo._stdRule;

  $: commands = latLng.lat &&
    latLng.lng &&
    selectedCountryIso &&
    selectedTimeZone && [
      `Latitude ${latLng.lat}`,
      `Longitude ${latLng.lng}`,
      ...(daylightSavingStarts && daylightSavingEnds
        ? [
            `TimeDST ${hemisphere},` +
              `${weekFromDayOfMonth(daylightSavingStarts.dayOfMonth)},` +
              `${daylightSavingStarts.month},${daylightSavingStarts.dayOfWeek},` +
              `${daylightSavingStarts.atHour},${timeZoneUtcDstOffsetMinutes}`,
            `TimeSTD ${hemisphere},` +
              `${weekFromDayOfMonth(daylightSavingEnds.dayOfMonth)},` +
              `${daylightSavingEnds.month},${daylightSavingEnds.dayOfWeek},` +
              `${daylightSavingEnds.atHour},${timeZoneUtcOffsetMinutes}`,
            `TimeZone 99`
          ]
        : [`TimeZone ${timeZoneUtcOffsetFormatted}`])
    ];
  $: command = commands && `Backlog ${commands.join('; ')}`;

  $: if (browser && latLng && JSON.stringify(latLng) !== JSON.stringify(reversedLatLng)) {
    reverseGeolocateCountry();
  }

  async function reverseGeolocateCountry() {
    try {
      loading = true;
      reversedLatLng = latLng;
      const countryCode = await reverseGeocodeCountry(latLng);
      selectedCountryIso = countryCode;
      const timeZonesForCountryIso = getTimeZonesForCountryIso(selectedCountryIso);
      if (!timeZonesForCountryIso.includes(selectedTimeZone)) {
        selectedTimeZone = timeZonesForCountryIso[0];
      }
    } finally {
      loading = false;
    }
  }

  async function geolocateCountry(e) {
    try {
      loading = true;
      const newCountryIso = e.target.value;
      const newCountryDisplayName = countryDisplayNameByIso(newCountryIso);

      selectedTimeZone = getTimeZonesForCountryIso(newCountryIso)[0];

      const newLatLng = await geolocate(newCountryDisplayName);
      if (newLatLng) {
        latLng = newLatLng;
      }
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Tasmota time zone command helper</title>
</svelte:head>

<div class="container">
  <div class="row">
    <div class="twelve columns">
      <h1>Tasmota time zone command helper</h1>
      <p>For accurate sunrise and sunset timers.</p>

      <h2>Device location</h2>
      <p>
        For accurate sunrise and sunset information, click on a location on the map near where the
        device is located, select the correct time zone, and execute the command in your Tasmota
        device's console.
      </p>

      <div class="map">
        <Map bind:latLng />
      </div>

      <form on:submit|preventDefault>
        <div class="row">
          <div class="three columns">
            <label for="lat">Latitude</label>
            <input
              class="u-full-width"
              type="text"
              id="lat"
              bind:value={latLng.lat}
              disabled={loading}
            />
          </div>
          <div class="three columns">
            <label for="lng">Longitude</label>
            <input
              class="u-full-width"
              type="text"
              id="lng"
              bind:value={latLng.lng}
              disabled={loading}
            />
          </div>
        </div>

        <label>Country</label>
        <select
          id="country"
          bind:value={selectedCountryIso}
          on:change={geolocateCountry}
          disabled={loading}
        >
          <option value="" />
          {#each countries as { countryIso, countryDisplayName } (countryIso)}
            <option value={countryIso}>{countryDisplayName}</option>
          {/each}
        </select>

        {#if timeZones && timeZones.length}
          <label for="timezone">Time zone (select manually)</label>
          <select id="timezone" bind:value={selectedTimeZone} disabled={loading}>
            {#each timeZones as timeZone}
              <option value={timeZone}>{timeZone}</option>
            {/each}
          </select>
        {/if}
      </form>

      {#if command}
        <h2>Command</h2>
        <Command {command} disabled={loading} />

        <h3>Daylight saving information looked up</h3>
        <p>
          {#if timeZoneInfo.dstRule && timeZoneInfo.stdRule}
            Daylight saving starts {timeZoneInfo.dstRule}.<br />
            Daylight saving ends {timeZoneInfo.stdRule}.
          {:else}
            No daylight saving.
          {/if}
        </p>
        <h3>Tasmota documentation on <code>TimeDST</code>/<code>TimeSTD</code> commands</h3>
        <TasmotaTzDocs />
      {/if}
    </div>
  </div>
  <div class="row">
    <footer class="twelve columns">
      <hr />
      <p>
        Hastily created by<br />
        <a href="https://www.linkedin.com/in/rjkip/">💼 in/rjkip</a>
        • <a href="https://twitter.com/rjkip">🐦 @rjkip</a>
      </p>
    </footer>
  </div>
</div>

<style>
  .map {
    width: 100%;
    height: 50vh;
    min-height: 300px;
    padding-bottom: 1rem;
  }
  .help {
    font-size: 0.9rem;
    color: #444;
    margin-top: 0;
  }

  .container {
    margin-bottom: 10rem;
    margin-top: 5rem;
  }

  a {
    font-weight: bold;
    text-decoration: none;
    color: #07234f;
  }

  footer {
    text-align: center;
  }

  /* Larger than mobile */
  @media (min-width: 400px) {
  }

  /* Larger than phablet */
  @media (min-width: 550px) {
  }

  /* Larger than tablet */
  @media (min-width: 750px) {
  }

  /* Larger than desktop */
  @media (min-width: 1000px) {
  }

  /* Larger than Desktop HD */
  @media (min-width: 1200px) {
  }
</style>
