<script setup>
defineProps({
    visible: { type: Boolean, default: false },
})

defineEmits(['close'])
</script>

<template>
  <div
    id="goto-syntax-box"
    class="display-box"
    :class="{ 'hidden-trans': !visible }"
  >
    <div class="display-box-header">
      <h3 id="syntax-header">Syntax</h3>
      <i id="goto-syntax-close" class="bi bi-x-lg" @click="$emit('close')"></i>
    </div>
    <div class="display-box-content">
      <div class="syntax-section">
        <h4>Month</h4>
        <p><code>jan</code> <code>february</code> <code>3</code></p>
      </div>
      <div class="syntax-section">
        <h4>Month &amp; Day</h4>
        <p><code>jan23</code> <code>jun 9</code> <code>april 6</code> <code>5 13</code></p>
      </div>
      <div class="syntax-section">
        <h4>Year</h4>
        <p><code>2024</code> <code>10 1 2004</code></p>
      </div>
      <div class="syntax-section">
        <h4>Extra</h4>
        <p><code>JUNE</code> <code>04-08-2006</code> <code>10/05</code> <code>Nov.8</code> <code>11,11</code></p>
      </div>
    </div>
  </div>
</template>
