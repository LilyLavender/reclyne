<script setup>
import { useCalendarStore } from '../../stores/calendar'
import DialogBase from './DialogBase.vue'

const calendarStore = useCalendarStore()
</script>

<template>
  <DialogBase dialogName="changes" title="Unsaved Changes">
    <p id="display-p1">You have unsaved changes.</p>
    <div id="changes-buttons">
      <button @click="calendarStore.saveCalendar()">
        <i class="bi bi-floppy"></i>Save
      </button>
      <button class="cancel-button" @click="calendarStore.resolvePendingSave(false)">
        <i class="bi bi-x-lg"></i>Cancel
      </button>
    </div>
  </DialogBase>
</template>
