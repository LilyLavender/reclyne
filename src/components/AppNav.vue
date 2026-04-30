<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useCalendarStore } from '../stores/calendar'
import { usePreferencesStore } from '../stores/preferences'

const emit = defineEmits(['nav-height'])

const calendarStore = useCalendarStore()
const prefsStore = usePreferencesStore()

const navEl = ref(null)

onMounted(() => {
    emit('nav-height', navEl.value.offsetHeight)
})

// Toggle button icon classes
const elapsedIcon     = computed(() => prefsStore.hideElapsed       ? 'bi-calendar2-check-fill'      : 'bi-calendar2-check')
const autoscrollIcon  = computed(() => prefsStore.autoscrollToArrow ? 'bi-arrow-right-circle-fill'   : 'bi-arrow-right-circle')
const allColumnsIcon  = computed(() => prefsStore.allColumns        ? 'bi-pen-fill'                  : 'bi-pen')

// Toggle button tooltip text
const elapsedTooltip    = computed(() => prefsStore.hideElapsed       ? 'Show elapsed months'                    : 'Hide elapsed months')
const autoscrollTooltip = computed(() => prefsStore.autoscrollToArrow ? 'Do not automatically scroll to today'  : 'Automatically scroll to today')
const allColumnsTooltip = computed(() => prefsStore.allColumns        ? "Edit each month's columns separately"   : "Edit every month's columns at once")

// Favicon + page title react to unsaved changes
watch(() => calendarStore.unsavedChanges, (hasChanges) => {
    document.title = hasChanges ? 'reclyne - Unsaved Changes' : 'reclyne'
    const fav16 = document.getElementById('favicon-16x16')
    const fav32 = document.getElementById('favicon-32x32')
    if (fav16) fav16.href = hasChanges ? '/favicon/favicon-16x16-red.png' : '/favicon/favicon-16x16.png'
    if (fav32) fav32.href = hasChanges ? '/favicon/favicon-32x32-red.png' : '/favicon/favicon-32x32.png'
})
</script>

<template>
  <nav ref="navEl">
    <div class="left-icons">
      <a class="logostyle">reclyne</a>
    </div>
    <div class="middle-icons">
      <div class="year-select">
        <button class="tooltip" @click="calendarStore.updateYear(-1)">&lt;<div class="tooltiptext">Go back one year</div></button><p id="output-date">{{ calendarStore.currentYear }}</p><button class="tooltip" @click="calendarStore.updateYear(1)">&gt;<div class="tooltiptext">Go forward one year</div></button>
      </div>
      <i class="bi bi-floppy tooltip"
         :class="{ 'btn-active': calendarStore.unsavedChanges }"
         @click="calendarStore.saveCalendar()">
        <div class="tooltiptext">Save</div>
      </i>
      <i class="bi tooltip"
         :class="[autoscrollIcon, { 'btn-light': prefsStore.autoscrollToArrow }]"
         @click="prefsStore.autoscrollToArrow = !prefsStore.autoscrollToArrow">
        <div class="tooltiptext">{{ autoscrollTooltip }}</div>
      </i>
      <i class="bi tooltip"
         :class="[elapsedIcon, { 'btn-light': prefsStore.hideElapsed }]"
         @click="prefsStore.hideElapsed = !prefsStore.hideElapsed">
        <div class="tooltiptext">{{ elapsedTooltip }}</div>
      </i>
      <i class="bi tooltip"
         :class="[allColumnsIcon, { 'btn-light': prefsStore.allColumns }]"
         @click="prefsStore.allColumns = !prefsStore.allColumns">
        <div class="tooltiptext">{{ allColumnsTooltip }}</div>
      </i>
      <i class="bi bi-box-arrow-in-down tooltip" @click="calendarStore.setActiveDialog('import')">
        <div class="tooltiptext">Import data<div class="tooltipextra">• Double-click to quick import</div></div>
      </i>
      <i class="bi bi-box-arrow-down tooltip" @click="calendarStore.setActiveDialog('export')">
        <div class="tooltiptext">Export data<div class="tooltipextra">• Double-click to quick export</div></div>
      </i>
    </div>
    <div class="right-icons">
      <div class="tooltip" @click="calendarStore.setActiveDialog('about')">
        <a class="logostyle" id="about-button">About</a>
        <div class="tooltiptext">Credits &amp; Shortcuts</div>
      </div>
    </div>
  </nav>
</template>
