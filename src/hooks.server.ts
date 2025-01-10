import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async function handle({ event, resolve }) {
  if (
    event.url.origin !== 'https://tasmotatimezone.com' &&
    !event.url.origin.startsWith('http://localhost:') &&
    !event.url.origin.endsWith('--tasmota-tz.netlify.app')
  ) {
    const oldLocation = event.url;
    const newLocation = `https://tasmotatimezone.com${event.url.pathname}`;

    console.log(`Redirecting from ${oldLocation} to ${newLocation}`);

    return new Response('', {
      status: 301,
      headers: {
        location: newLocation,
      },
    });
  }

  const response = await resolve(event);

  if (!response.headers.has('cache-control')) {
    const minuteInSeconds = 60;
    const hourInMinutes = 60;
    const dayInHours = 24;
    const dayInSeconds = dayInHours * hourInMinutes * minuteInSeconds;
    response.headers.set(
      'cache-control',
      [
        `s-maxage=${minuteInSeconds}`,
        `stale-while-revalidate=${dayInSeconds}`,
        `stale-if-error=${dayInSeconds}`,
      ].join(', '),
    );
  }

  return response;
};
