import { browser } from '$app/environment';

if (browser) {
  window.plausible =
    window.plausible ||
    function () {
      (window.plausible.q = window.plausible.q || []).push(arguments);
    };
}

const eventsReported = new Set();

export function reportEventOnce(event: string) {
  try {
    if (eventsReported.has(event)) return;

    window.plausible(event);
    if (location.hostname === 'localhost') {
      console.log('Reported event once', event);
    }
    eventsReported.add(event);
  } catch (e) {
    console.warn('Error occurred while trying to report event once', event, e);
  }
}
