<script>
  import { Timezone } from '@tubular/time';
  import CopyableCommand from './CopyableCommand.svelte';
  import { weekFromDayOfMonth } from './timezones.js';

  export let latLng, timeZone;

  $: hemisphere = latLng.lat >= 0 ? '0' : '1';
  $: timeZoneInfo = timeZone && Timezone.getTimezone(timeZone);
  $: timeZoneUtcOffsetMinutes = timeZoneInfo && timeZoneInfo.utcOffset / 60;
  $: timeZoneUtcDstOffsetMinutes =
    timeZoneInfo && timeZoneUtcOffsetMinutes + timeZoneInfo.dstOffset / 60;
  $: timeZoneUtcOffsetFormatted = timeZoneInfo && Timezone.formatUtcOffset(timeZoneInfo.utcOffset);
  $: daylightSavingStarts = timeZoneInfo && timeZoneInfo._dstRule;
  $: daylightSavingEnds = timeZoneInfo && timeZoneInfo._stdRule;

  $: commands =
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
                `TimeZone 99`
              ]
            : [`TimeZone ${timeZoneUtcOffsetFormatted}`])
        ];
  $: command = commands && `Backlog ${commands.join('; ')}`;
</script>

<CopyableCommand {command} on:copied />
