import { describe, expect, it } from 'vitest';
import { compareTimeZones } from './timezones';

const DE = { countryTimeZone: 'Europe/Berlin', countryIso: 'DE', countryDisplayName: 'Germany' };
const NL = {
  countryTimeZone: 'Europe/Amsterdam',
  countryIso: 'NL',
  countryDisplayName: 'Netherlands',
};
const FR = { countryTimeZone: 'Europe/Paris', countryIso: 'FR', countryDisplayName: 'France' };
const NZ = {
  countryTimeZone: 'Pacific/Auckland',
  countryIso: 'NZ',
  countryDisplayName: 'New Zealand',
};

describe('timezones', () => {
  describe('compareTimeZones', () => {
    it('should return -1 if the time matches the local time zone', () => {
      expect(compareTimeZones(DE, NZ)).toBe(1);
    });
    it('should return -1 if a is "earlier" than z', () => {
      expect(compareTimeZones(NL, DE)).toBe(-1);
    });
    it('should return 1 if a is "later" than z', () => {
      expect(
        compareTimeZones(DE, {
          countryTimeZone: 'Europe/Amsterdam',
          countryIso: 'NL',
          countryDisplayName: 'Netherlands',
        }),
      ).toBe(1);
    });
    it('should compare time zone name if time is the same', () => {
      expect(compareTimeZones(NL, FR)).toBe(-1);
    });
  });
});
