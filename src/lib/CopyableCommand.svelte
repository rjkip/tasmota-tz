<script>
  import { createBubbler, preventDefault, once } from 'svelte/legacy';

  const bubble = createBubbler();
  import { reportEventOnce } from '$lib/plausible.js';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  /**
   * @typedef {Object} Props
   * @property {string} [command]
   * @property {boolean} [disabled]
   */

  /** @type {Props} */
  let { command = '', disabled = false } = $props();
  let input = $state(),
    copyAttempted = $state(false),
    informCommandCopied = $state(false);

  function copy() {
    copyAttempted = true;

    input.focus();
    input.select();
    navigator.clipboard.writeText(command).then(() => {
      informCommandCopied = true;
      setTimeout(() => {
        informCommandCopied = false;
      }, 3000);
      reportEventOnce('copy');
      dispatch('copied');
    });
  }
</script>

{#if copyAttempted}
  <p class="success">✅ Command copied!</p>
{/if}

<form onsubmit={preventDefault(bubble('submit'))}>
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
      onfocus={once(copy)}
      data-testid="copy"
    />
  </div>
  <p>
    To execute the command, visit your device&rsquo;s <em>Console</em> by visiting its IP address in
    your browser, and pasting the command.
  </p>
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

    margin-block: 1em;
  }
</style>
