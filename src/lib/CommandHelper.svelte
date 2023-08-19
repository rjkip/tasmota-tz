<script>
  import TimeZoneSelector from './TimeZoneSelector.svelte';
  import TimeZoneCommand from './TimeZoneCommand.svelte';
  import GeolocatingMap from './map/GeolocatingMap.svelte';

  let latLng;
  let countryIso;
  let selectedTimeZone;

  function onLocating() {
    latLng = null;
    countryIso = null;
  }
  function onLocated(event) {
    latLng = event.detail.latLng;
    countryIso = event.detail.countryIso;
  }
</script>

<div class="sections">
  <section class:enabled={true}>
    <h2>📌 Pick the location of your Tasmota device</h2>
    <GeolocatingMap on:locating={onLocating} on:located={onLocated} />
  </section>

  <section class:enabled={latLng}>
    <h2>🕙 Select a time zone for that location</h2>
    {#if latLng}
      <TimeZoneSelector bind:timeZone={selectedTimeZone} filterByCountryIso={countryIso} />
    {/if}
  </section>

  <section class:enabled={latLng && selectedTimeZone}>
    <h2>🚀 Execute commands on your Tasmota device</h2>
    {#if latLng && selectedTimeZone}
      <TimeZoneCommand bind:timeZone={selectedTimeZone} {latLng} />
    {/if}
  </section>
</div>

<style>
  section {
    transition: all 200ms;
  }
  section:not(.enabled) {
    background: #cccccc;
    opacity: 0.5;
    pointer-events: none;
    user-select: none;
    filter: grayscale();
  }
</style>
