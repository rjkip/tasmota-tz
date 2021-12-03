<script>
  import { fade, slide } from 'svelte/transition';

  export let command = '',
    disabled = false;
  let input,
    informCommandCopied = false;

  function copy() {
    input.focus();
    input.select();
    document.execCommand('copy');
    informCommandCopied = true;
    if (window.plausible) {
      window.plausible('copy');
    }
    setTimeout(() => {
      informCommandCopied = false;
    }, 5000);
  }
  function onSelect(e) {
    if (
      e.target.value.length > 0 &&
      e.target.selectionStart === 0 &&
      e.target.selectionEnd === e.target.value.length
    ) {
      copy();
    }
  }
</script>

<form on:submit|preventDefault>
  <div class="side-by-side">
    <input bind:this={input} type="text" {disabled} value={command} on:select={onSelect} />
    <button on:click={copy}>Copy</button>
  </div>
  {#if informCommandCopied}
    <p class="inform-command-copied" in:slide out:fade>🖖 Command copied to your clipboard</p>
  {/if}
</form>

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

  .inform-command-copied {
    font-weight: bold;
    color: green;
  }

  input {
    font-family: monospace;
  }
</style>
