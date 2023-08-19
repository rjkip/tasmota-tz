import { expect, test } from 'vitest';
import { weekFromDayOfMonth } from './timezones.js';

test('weekFromDayOfMonth should return the correct week number for a given day of the month', () => {
  expect(weekFromDayOfMonth(1)).toBe(1);
  expect(weekFromDayOfMonth(7)).toBe(1);
  expect(weekFromDayOfMonth(8)).toBe(2);
  expect(weekFromDayOfMonth(6)).toBe(1);
  expect(weekFromDayOfMonth(15)).toBe(3);
  expect(weekFromDayOfMonth(20)).toBe(3);
  expect(weekFromDayOfMonth(28)).toBe(4);
});
