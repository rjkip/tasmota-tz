<script lang="ts">
  import '../app.css';
  let { children } = $props();
</script>

<svelte:head>
  <title>Tasmota time zone command helper</title>
  <meta
    name="description"
    content="Set up accurate sunrise and sunset timers on your Tasmota device. Just select your device’s geographic location and time zone and execute the command on your device."
  />
  <meta
    name="ahrefs-site-verification"
    content="3721d5967c20f931ded5d8ef650a890b14c7da13dea8df42950acf658c6e5f2e"
  />
  <meta name="google-site-verification" content="9joMzsKR3tNou-jzbuZxtLXa4btHbxkMokRvgm5NYnM" />
</svelte:head>

<div class="layout">
  <main>
    <div class="head">
      <h1>Tasmota time zone helper</h1>
      <p>
        Set up accurate sunrise and sunset timers on your Tasmota device. Just select your device’s
        geographic location and time zone and execute the command on your device.
      </p>
    </div>

    {@render children()}
  </main>
  <aside>
    <div class="prose">
      <p>The affiliate links below help support this project.</p>
    </div>
  </aside>
</div>

<style>
  .layout {
    display: grid;
    grid-template-columns: 7fr 3fr;
    max-width: 1180px;
    padding: 1em;
    margin: 0 auto;
    gap: 1em;
  }

  .head {
    text-align: center;
    text-wrap: balance;

    h1 {
      font-weight: 800;
      font-size: 2.25em;
      line-height: 1.1111;
      margin: 2rem 0 1rem 0;
    }
  }
</style>
