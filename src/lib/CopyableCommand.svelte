<script>
  import { slide } from 'svelte/transition';
  import { reportEventOnce } from '$lib/plausible.js';

  export let command = '',
    disabled = false;
  let input,
    copyAttempted = false,
    informCommandCopied = false;

  function copy() {
    copyAttempted = true;

    input.focus();
    input.select();
    document.execCommand('copy');
    informCommandCopied = true;
    setTimeout(() => {
      informCommandCopied = false;
    }, 3000);
    reportEventOnce('copy');
  }
</script>

<form on:submit|preventDefault>
  <div class="side-by-side">
    <input
      bind:this={input}
      class="copy"
      class:inform-not-copied={!informCommandCopied}
      class:inform-copied={informCommandCopied}
      class:copied={copyAttempted}
      type="text"
      {disabled}
      value={command}
      on:focus|once={copy}
      data-testid="copy"
    />
  </div>
  <p class="help">
    To execute the command, visit the console in your device's <a
      href="https://tasmota.github.io/docs/WebUI/"
      target="_blank">web UI</a
    >.
  </p>
</form>

{#if copyAttempted}
  <div class="success" transition:slide>
    <p>
      ✅ Command copied! If you thought this was useful, you can <a
        href="https://ko-fi.com/D1D8K5VHY/?hidefeed=true&widget=true&embed=true"
        on:click={() => reportEventOnce('donate')}
        target="_blank">buy me a coffee!</a
      >
    </p>
  </div>
{/if}

<style>
  .side-by-side {
    display: flex;
    flex-direction: column;
  }
  .side-by-side input {
    flex-grow: 1;
  }
  @media (min-width: 750px) {
    .side-by-side {
      flex-direction: row;
      gap: 1rem;
    }
  }

  .copy {
    cursor: default;
  }
  .inform-not-copied {
    transition: background-color 750ms ease, border-color 750ms ease;
  }
  .inform-copied {
    border-color: green;
    color: green;
    background-color: #eef8ee;
  }
  .copied {
    cursor: text;
  }

  input {
    font-family: monospace;

    display: flex;
    align-items: stretch;
    width: 100%;
  }

  .help {
    color: #4b4b4b;
    border-left: 1px solid #ccc;
    padding: 0.5em 0 0.5em 1em;
    margin-left: 0.5em;
  }

  .success {
    border: 1px solid green;
    border-radius: var(--box-border-radius);
    background: #eef8ee;
    padding: 0.5em;

    margin-top: 2em;
  }
</style>
