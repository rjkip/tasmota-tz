import { sortBy, unique } from '$lib/arrays';
import { Timezone } from '@tubular/time';

export const countriesAndTimezones = Timezone.getAvailableTimezones().flatMap((tzName) =>
  [...Timezone.getCountries(tzName)].map((countryIso2) => ({
    countryIso: countryIso2,
    countryTimeZone: tzName
  }))
);

export const countries = unique(countriesAndTimezones.map((it) => it.countryIso))
  .map((countryIso) => ({
    countryIso,
    countryDisplayName:
      typeof Intl !== 'undefined' && Intl.DisplayNames
        ? new Intl.DisplayNames(undefined, { type: 'region' }).of(countryIso)
        : countryIso
  }))
  .sort(sortBy('countryDisplayName'));

export function getTimeZonesForCountryIso(iso) {
  return unique(
    countriesAndTimezones.filter((it) => it.countryIso === iso).map((it) => it.countryTimeZone)
  ).sort();
}

export function getSuggestedTimeZonesForCountry(iso) {
  const suggested = getTimeZonesForCountryIso(iso);
  const rest = getAllTimeZones()
    .filter((it) => !suggested.includes(it))
    .sort();
  return [...suggested, null, ...rest];
}

function getAllTimeZones() {
  return unique(countriesAndTimezones.map((it) => it.countryTimeZone));
}

export function countryDisplayNameByIso(iso) {
  return countries.filter((it) => it.countryIso === iso).map((it) => it.countryDisplayName);
}

export function weekFromDayOfMonth(dayOfMonth) {
  // 1 = 1
  // 7 = 1
  // 8 = 2
  return Math.ceil(dayOfMonth / 7);
}
