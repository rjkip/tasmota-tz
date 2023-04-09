import { Timezone } from '@tubular/time';
import { browser } from '$app/environment';

export const countriesAndTimezones = Timezone.getAvailableTimezones().flatMap((tzName) => {
  try {
    return [...Timezone.getCountries(tzName)].map((countryIso2) => ({
      countryIso: countryIso2,
      countryDisplayName:
        typeof Intl !== 'undefined' && Intl.DisplayNames
          ? new Intl.DisplayNames(undefined, { type: 'region' }).of(countryIso2)
          : countryIso2,
      countryTimeZone: tzName
    }));
  } catch (e) {
    if (!browser || location.hostname === 'localhost') {
      console.warn(`'${tzName}' is likely not associated with a country; ignoring...`, e);
    }
    return [];
  }
});

export function weekFromDayOfMonth(dayOfMonth) {
  // 1 = 1
  // 7 = 1
  // 8 = 2
  return Math.ceil(dayOfMonth / 7);
}
