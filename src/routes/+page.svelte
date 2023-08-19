<script>
  import '../app.css';
  import CommandHelper from '$lib/CommandHelper.svelte';
</script>

<svelte:head>
  <title>Tasmota time zone command helper</title>
</svelte:head>

<main>
  <h1>🌅 Tasmota time zone command helper</h1>
  <p>
    Set up accurate sunrise and sunset timers on your Tasmota device. Just select your
    device&rsquo;s geographic location and time zone and execute the command on your device.
  </p>

  <CommandHelper />

  <footer>
    <p>
      Created by<br />
      <a href="https://www.linkedin.com/in/rjkip/">💼 in/rjkip</a>
      • <a href="https://twitter.com/rjkip">🐦 @rjkip</a>
    </p>
  </footer>
</main>

<style>
  main {
    max-width: 70rem;
    margin: 1rem auto;
  }

  footer {
    margin-top: 4rem;
    border-top: 1px solid silver;
    text-align: center;
    line-height: 1.6;
  }
  footer a {
    color: black;
    font-weight: 700;
    text-decoration: none;
  }
</style>
