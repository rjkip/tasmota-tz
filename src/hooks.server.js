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

  return await resolve(event);
}
