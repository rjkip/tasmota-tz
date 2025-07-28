<script>
  import { reportEventOnce } from '$lib/plausible.js';
  import reinier from './reinier.png';
</script>

<h2>💖 Support the project</h2>

<div class="support-options">
  <div class="section">
    <h3>☕ Ko-fi</h3>
    <p>
      <a
        href="https://ko-fi.com/D1D8K5VHY/?hidefeed=true"
        on:click={() => reportEventOnce('donate')}
        target="_blank"
      >
        Buy me a coffee!<span />
      </a>
    </p>
  </div>

  <div class="section reinier">
    <img src={reinier} alt="Reinier, software engineer and architect" />
    <div>
      <h3>Build your web app or website? Automate your business?</h3>
      <p>
        I&rsquo;ve got 17+ years of experience.
        <a
          href="https://reinier.nz/?utm_source=tasmotatimezone.com&utm_medium=referral&utm_content=support"
          on:click={() => reportEventOnce('reinier.nz')}
          target="_blank"
        >
          Drop me a line.<span />
        </a>
      </p>
    </div>
  </div>
</div>

<style>
  .support-options {
    display: flex;
    flex-direction: row;
    gap: 1em;
  }
  .section {
    border-radius: var(--box-border-radius);
    border: 1px solid silver;
    padding: 1em;

    & > :first-child {
      margin-block-start: 0;
    }
    & > :last-child {
      margin-block-end: 0;
    }
  }

  .section {
    position: relative;
  }
  .section a span {
    position: absolute;
    inset: 0;
  }
  .section h3 {
    margin: 0;
  }
  .section p {
    margin: 0.5em 0 0 0;
  }

  .reinier {
    display: flex;
    gap: 1em;
    align-items: start;
  }
  .reinier img {
    width: 60px;
    aspect-ratio: 1 / 1;
    flex-shrink: 0;
  }
</style>
