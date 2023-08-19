/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
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
        location: newLocation
      }
    });
  }

  const response = await resolve(event);

  if (!response.headers.has('cache-control')) {
    const secondsInMinute = 60;
    const minutesInHour = 60;
    const hoursInDay = 24;
    const dayInSeconds = hoursInDay * minutesInHour * secondsInMinute;
    response.headers.set(
      'cache-control',
      `max-age=${dayInSeconds}, s-maxage=60, stale-while-revalidate=10`
    );
  }

  return response;
}
