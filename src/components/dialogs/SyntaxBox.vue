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
      <h4>Syntaxes</h4>
      <i id="goto-syntax-close" class="bi bi-x-lg" @click="$emit('close')"></i>
    </div>
    <div class="display-box-content">
      <div class="syntax-section">
        <h3>One word</h3>
        <p><code>jan</code> / <code>February</code> / <code>MARCH</code></p>
        <p><code>1</code> / <code>06</code> / <code>12</code></p>
        <p><code>2024</code> / <code>2025</code></p>
        <p><code>jan23</code> / <code>apr06</code></p>
      </div>
      <div class="syntax-section">
        <h3>Two words</h3>
        <p><code>jan 23</code> / <code>April 6</code></p>
        <p><code>jan 2024</code> / <code>March 2025</code></p>
        <p><code>04 2026</code> / <code>12 2028</code></p>
        <p><code>1 23</code> / <code>4 06</code> <i>(locale)</i></p>
      </div>
      <div class="syntax-section">
        <h3>Three words</h3>
        <p><code>apr 08 2024</code> / <code>October 5 2025</code></p>
        <p><code>11 11 2026</code> / <code>06 03 2027</code> <i>(locale)</i></p>
      </div>
      <div class="syntax-section">
        <h3>Delimiters</h3>
        <p><code>space</code> / <code>-</code> / <code>/</code> / <code>.</code> / <code>,</code></p>
      </div>
    </div>
  </div>
</template>
