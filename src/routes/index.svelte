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

  $: if (browser && latLng && JSON.stringify(latLng) !== JSON.stringify(reversedLatLng)) {
    (async () => {
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
    })();
  }

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
        device is located. This will also determine the corresponding time zone.
      </p>

      <div class="map">
        <Map bind:latLng />
      </div>

      <form>
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
        <textarea class="u-full-width" disabled={loading}>{command}</textarea>

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
        <p>
          Set policies for the beginning of daylight saving time (Dst) and return back to standard
          time (Std)  <br /><code>0</code> = reset parameters to firmware defaults<br /><code
            >H</code
          >,<code>W</code>,<code>M</code>,<code>D</code>,<code>h</code>,<code>T</code><br />
          <code>H</code>
          = hemisphere (<code>0</code> = northern hemisphere / <code>1</code> = southern hemisphere)<br
          /> <code>W</code> = week (<code>0</code> = last week of month, <code>1..4</code> = first
          .. fourth)<br /> <code>M</code> = month (<code>1..12</code>)<br /> <code>D</code> = day of
          week (<code>1..7</code> <code>1</code> = sunday <code>7</code> = saturday)<br />
          <code>h</code>
          = hour (<code>0..23</code>)<br /> <code>T</code> = timezone (<code>-780..780</code>)
          (offset from UTC in <strong>MINUTES</strong> - 780min / 60min=13hrs)<br /><em>Example:</em
          > <code>TIMEDST 1,1,10,1,2,660</code><br /><em
            >If timezone is <strong>NOT</strong> 99, DST is not used (even if displayed)</em
          >
          <a href="https://github.com/arendst/Tasmota/issues/8528#issuecomment-633247984">see</a>
        </p>
      {/if}
    </div>
  </div>
</div>

<style>
  .map {
    width: 100%;
    height: 50vh;
    padding-bottom: 1rem;
  }
  .help {
    font-size: 0.9rem;
    color: #444;
    margin-top: 0;
  }

  .container {
    margin-bottom: 10rem;
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
