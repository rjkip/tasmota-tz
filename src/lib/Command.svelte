<script>
  export let command = '',
    disabled = false;
  let input,
    informCommandCopied = false;

  function copy() {
    input.focus();
    input.select();
    document.execCommand('copy');
    informCommandCopied = true;
    setTimeout(() => {
      informCommandCopied = false;
    }, 3000);
    if (window.plausible) {
      window.plausible('copy');
    }
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
    <input
      bind:this={input}
      class:not-copied={!informCommandCopied}
      class:copied={informCommandCopied}
      type="text"
      {disabled}
      value={command}
      on:select={onSelect}
    />
    <button
      on:click={copy}
      class:not-copied={!informCommandCopied}
      class:copied={informCommandCopied}
      {disabled}
    >
      {#if informCommandCopied}✔️{:else}Copy{/if}
    </button>
  </div>
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

  .not-copied {
    transition: background-color 750ms ease, border-color 750ms ease;
  }
  .copied {
    border-color: green;
    color: green;
    background-color: #eef8ee;
  }

  input {
    font-family: monospace;
  }
</style>
