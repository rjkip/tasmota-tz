/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  if (
    event.url.origin !== 'https://tasmotatimezone.com' &&
    !event.url.origin.startsWith('http://localhost:') &&
    !event.url.origin.endsWith('--tasmota-tz.netlify.app')
  ) {
    return new Response('', {
      status: 301,
      headers: {
        location: `https://tasmotatimezone.com${event.url.pathname}`
      }
    });
  }

  return await resolve(event);
}
