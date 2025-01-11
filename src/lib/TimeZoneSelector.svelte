<script>
  import Select from 'svelte-select';
  import { countriesAndTimezones } from './timezones.js';
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';

  const usersTimeZone =
    (browser && new Intl.DateTimeFormat('default').resolvedOptions().timeZone) || null;

  let timeZones = updatedTimeZones();
  onMount(() => {
    const interval = setInterval(() => {
      timeZones = updatedTimeZones();
    }, 60 * 1000);
    return () => clearInterval(interval);
  });
  function updatedTimeZones() {
    function timeIn(timeZone) {
      try {
        return new Intl.DateTimeFormat([], { timeZone, timeStyle: 'short' }).format(new Date());
      } catch (e) {
        return 'N/A';
      }
    }

    return countriesAndTimezones.map(({ countryIso, countryDisplayName, countryTimeZone }) => ({
      value: countryTimeZone,
      label: `${countryTimeZone} (${timeIn(countryTimeZone)})`,
      group: countryDisplayName,
      details: {
        countryIso,
        countryDisplayName,
        countryTimeZone,
      },
    }));
  }

  const itemGroupBy = (it) => it.group;
  const itemFilter = (label, filterText, option) =>
    `${option.value}`.toLowerCase().includes(filterText.toLowerCase()) ||
    `${option.group}`.toLowerCase().includes(filterText.toLowerCase());

  export let timeZone, filterByCountryIso;
  let value = null;

  $: effectiveTimeZones = filterByCountryIso
    ? timeZones.filter((tz) => tz.details.countryIso === filterByCountryIso)
    : timeZones;
</script>

<Select
  inputAttributes={{ 'data-testid': 'select-timezone' }}
  bind:justValue={timeZone}
  bind:value
  items={effectiveTimeZones}
  groupBy={itemGroupBy}
  {itemFilter}
  showChevron
  placeholder="Please select your time zone..."
/>
