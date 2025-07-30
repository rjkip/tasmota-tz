<script>
  import { Timezone } from '@tubular/time';
  import CopyableCommand from './CopyableCommand.svelte';
  import { weekFromDayOfMonth } from './timezones.js';

  let { latLng, timeZone } = $props();

  let hemisphere = $derived(latLng.lat >= 0 ? '0' : '1');
  let timeZoneInfo = $derived(timeZone && Timezone.getTimezone(timeZone));
  let timeZoneUtcOffsetMinutes = $derived(timeZoneInfo && timeZoneInfo.utcOffset / 60);
  let timeZoneUtcDstOffsetMinutes = $derived(
    timeZoneInfo && timeZoneUtcOffsetMinutes + timeZoneInfo.dstOffset / 60,
  );
  let timeZoneUtcOffsetFormatted = $derived(
    timeZoneInfo && Timezone.formatUtcOffset(timeZoneInfo.utcOffset),
  );
  let daylightSavingStarts = $derived(timeZoneInfo && timeZoneInfo._dstRule);
  let daylightSavingEnds = $derived(timeZoneInfo && timeZoneInfo._stdRule);

  let commands = $derived(
    latLng.lat === undefined ||
      latLng.lng === undefined ||
      latLng.lat === null ||
      latLng.lng === null
      ? null
      : [
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
                `TimeZone 99`,
              ]
            : [`TimeZone ${timeZoneUtcOffsetFormatted}`]),
        ],
  );
  // @wc-ignore
  let command = $derived(commands && `Backlog ${commands.join('; ')}`);
</script>

<CopyableCommand {command} on:copied />
