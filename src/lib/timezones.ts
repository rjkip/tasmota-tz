import { browser } from '$app/environment';
import { Timezone } from '@tubular/time';

export const countriesAndTimezones = Timezone.getAvailableTimezones()
  .filter((tzName) => !tzName.startsWith('SystemV/'))
  .flatMap((tzName) => {
    try {
      return [...Timezone.getCountries(tzName)].map((countryIso2) => ({
        countryIso: countryIso2,
        countryDisplayName:
          typeof Intl !== 'undefined' && Intl.DisplayNames
            ? (new Intl.DisplayNames(undefined, { type: 'region' }).of(countryIso2) ?? countryIso2)
            : countryIso2,
        countryTimeZone: tzName,
      }));
    } catch (e) {
      if (!browser || location.hostname === 'localhost') {
        console.warn(`'${tzName}' is likely not associated with a country; ignoring...`, e);
      }
      return [];
    }
  });

export function weekFromDayOfMonth(dayOfMonth: number) {
  // 1 = 1
  // 7 = 1
  // 8 = 2
  return Math.ceil(dayOfMonth / 7);
}

export function compareTimeZones(
  a: (typeof countriesAndTimezones)[0],
  z: (typeof countriesAndTimezones)[0],
) {
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
}
