<script setup>
import DialogBase from './DialogBase.vue'
</script>

<template>
  <DialogBase dialogName="about" title="About reclyne...">
    <div class="about-section">
      <h5>About</h5>
      <p><em>reclyne</em> is a lightweight calendar by Lily built to showcase the utility of a line-by-line layout.</p>
      <p><em>reclyne</em> is currently in alpha. Check out the <a href="https://github.com/LilyLavender/reclyne" target="_blank">GitHub<i class="bi bi-box-arrow-up-right"></i></a> page for more information!</p>
    </div>
    <div class="about-section">
      <h5>Shortcuts</h5>
      <h6><em>reclyne</em>-specific shortcuts:</h6>
      <p>Save - <b>Ctrl+S</b></p>
      <p>Scroll to arrow - <b>Ctrl+&gt;</b></p>
      <p>Goto date - <b>Ctrl+G</b></p>
      <p>Toggle edit all months mode - <b>Ctrl+E</b></p>
      <p>Quick import/export - <b>Double-click</b></p>
      <p>Movement on the grid - <b>Coming in beta!</b></p>
      <p>Mark/unmark as complete - <b>Coming in beta!</b></p>
      <h6>Other helpful shortcuts:</h6>
      <p>Find on page - <b>Ctrl+F</b></p>
      <p>Down/up one page - <b>Space/Shift+Space</b></p>
      <p>Top/bottom of page - <b>Home/End</b></p>
    </div>
  </DialogBase>
</template>
