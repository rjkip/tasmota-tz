<script>
  import { slide } from 'svelte/transition';

  export let command = '',
    disabled = false;
  let input,
    copyAttempted = false,
    informCommandCopied = false,
    reportedCopy = false;

  function copy() {
    copyAttempted = true;

    input.focus();
    input.select();
    document.execCommand('copy');
    informCommandCopied = true;
    setTimeout(() => {
      informCommandCopied = false;
    }, 3000);
    if (window.plausible && !reportedCopy) {
      reportedCopy = true;
      window.plausible('copy');
    }
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
    />
  </div>
</form>

<svelte:head>
  <link rel="preload" as="image" href="https://storage.ko-fi.com/cdn/kofi2.png?v=3" />
</svelte:head>
{#if copyAttempted}
  <div class="success" transition:slide>
    <p>
      ✅ Command copied! If you thought this was useful, you can <a
        href="https://ko-fi.com/D1D8K5VHY/?hidefeed=true&widget=true&embed=true"
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

  .success {
    border: 1px solid green;
    border-radius: var(--box-border-radius);
    background: #eef8ee;
    padding: 0.5em;

    margin-top: 2em;
  }
</style>
