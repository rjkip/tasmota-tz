<script>
  import { reportEventOnce } from '$lib/plausible.js';

  export let countryIso;

  const linkByStore = {
    CA: 'https://amazon.ca/s?k=tasmota&tag=tmtz-20',
    DE: 'https://amazon.de/s?k=tasmota&tag=tmtz-20',
    NL: 'https://amazon.nl/s?k=tasmota&tag=tmtz-20',
    UK: 'https://amazon.co.uk/s?k=tasmota&tag=tmtz-20',
    US: 'https://www.amazon.com/s?k=tasmota&tag=tmtz-20',
  };
  const linkByCountry = {
    CA: linkByStore['US'],
    DE: linkByStore['DE'],
    NL: linkByStore['NL'],
    NZ: linkByStore['AU'],
    GB: linkByStore['UK'],
    US: linkByStore['US'],
  };

  $: link = linkByCountry[countryIso];
</script>

<h2>💖 Support the project</h2>

<div class="support-options">
  <div>
    <h3>☕ Ko-fi</h3>
    <p>
      <a
        href="https://ko-fi.com/D1D8K5VHY/?hidefeed=true"
        on:click={() => reportEventOnce('donate')}
        target="_blank">Buy me a coffee!</a
      >
    </p>
  </div>
  {#if link}
    <div>
      <h3>🧑‍💻 Affiliate products</h3>
      <p>
        <a href={link} target="_blank" on:click={() => reportEventOnce('affiliate')}
          >View Tasmota products on Amazon</a
        ><br />
        <small
          >As an Amazon Associate I earn from qualifying purchases to support this project.</small
        >
      </p>
    </div>
  {/if}
</div>

<style>
  .support-options {
    display: flex;
    flex-direction: row;
    gap: 1em;
    justify-content: stretch;

    & > div {
      border-radius: var(--box-border-radius);
      border: 1px solid silver;
      padding: 1em;
      max-width: 25em;

      & > :first-child {
        margin-block-start: 0;
      }
      & > :last-child {
        margin-block-end: 0;
      }
    }
  }

  small {
    color: #525252;
    font-size: 70%;
    line-height: 1.4;
    display: block;
  }
</style>
