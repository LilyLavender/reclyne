<script setup>
import { ref } from 'vue'
import { useCalendarStore } from '../stores/calendar'

const calendarStore = useCalendarStore()

const message = ref('')

function setLoadingMessage(msg) {
    message.value = msg
}

defineExpose({ setLoadingMessage })
</script>

<template>
  <div id="loading-screen" :class="{ 'hidden-trans': calendarStore.calendarReady }">
    <div id="loading-anim-cont">
      <a class="logostyle">reclyne</a>
    </div>
    <div id="loading-disp-cont">
      <div id="loading-helper">Loading...</div>
      <div id="loading-message">{{ message }}</div>
    </div>
  </div>
</template>
