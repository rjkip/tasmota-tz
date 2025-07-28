<script>
  import GeolocatingMap from './map/GeolocatingMap.svelte';
  import SupportProject from './SupportProject.svelte';
  import TimeZoneCommand from './TimeZoneCommand.svelte';
  import TimeZoneSelector from './TimeZoneSelector.svelte';

  let latLng;
  let latLngSelectedOnce = false;
  let countryIso;
  let selectedTimeZone;

  let sectionCommand;

  function onLocating() {
    latLng = null;
    countryIso = null;
  }
  function onLocated(event) {
    latLng = event.detail.latLng;
    countryIso = event.detail.countryIso;

    latLngSelectedOnce = true;
  }

  let copied = false;
  function onCopy() {
    copied = true;
    sectionCommand.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
</script>

<div class="sections">
  <section class:enabled={true}>
    <h2>📌 Pick the location of your Tasmota device</h2>
    <GeolocatingMap on:locating={onLocating} on:located={onLocated} tall={!latLngSelectedOnce} />
  </section>

  <section class:enabled={latLng}>
    <h2>🕙 Select a time zone for that location</h2>
    {#if latLng}
      <TimeZoneSelector bind:timeZone={selectedTimeZone} filterByCountryIso={countryIso} />
    {/if}
  </section>

  <section class:enabled={latLng && selectedTimeZone} bind:this={sectionCommand}>
    <h2>🚀 Execute commands on your Tasmota device</h2>
    {#if latLng && selectedTimeZone}
      <TimeZoneCommand bind:timeZone={selectedTimeZone} {latLng} on:copied={onCopy} />
    {/if}
  </section>

  {#if copied}
    <section class="enabled">
      <SupportProject />
    </section>
  {/if}
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
