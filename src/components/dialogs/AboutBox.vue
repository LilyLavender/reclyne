<script setup>
import DialogBase from './DialogBase.vue'
</script>

<template>
  <DialogBase dialogName="about" title="About">
    <div class="about-section">
      <h5>Keyboard shortcuts</h5>
      <p><b>Ctrl+S</b> Save</p>
      <p><b>Ctrl+G</b> Open Go To Date</p>
      <p><b>Ctrl+→</b> Scroll to today</p>
      <p><b>Ctrl+E</b> Toggle all-columns mode</p>
      <p><b>Escape</b> Close dialog</p>
    </div>
    <div class="about-section">
      <h5>Navigation</h5>
      <p>Click month headers to collapse / expand</p>
      <p>Drag column headers to resize</p>
      <p>Click column headers to rename</p>
    </div>
    <div class="about-section">
      <h5>reclyne</h5>
      <p>A calendar by Lily</p>
    </div>
  </DialogBase>
</template>
