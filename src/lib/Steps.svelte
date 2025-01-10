<script lang="ts">
  const { progress }: { progress: number } = $props();
</script>

<ul class="steps">
  <li class="step" class:step-primary={progress >= 1}>Location</li>
  <li class="step" class:step-primary={progress >= 2}>Time zone</li>
  <li class="step" class:step-primary={progress >= 3}>Configure</li>
</ul>

<style>
  .steps {
    width: 100%;
  }
</style>
