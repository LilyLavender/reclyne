<script setup>
import { nextTick, onMounted, watch } from 'vue'
import { useCalendarStore } from '../stores/calendar'
import { usePreferencesStore } from '../stores/preferences'
import MonthTable from './MonthTable.vue'

const calendarStore = useCalendarStore()
const prefsStore = usePreferencesStore()

const todayYear = new Date().getFullYear()

function scrollToArrow() {
    const arrow = document.querySelector('.arrow-container')
    if (!arrow) return
    const offset = arrow.getBoundingClientRect().top + window.scrollY - window.innerHeight / 4 + 3
    window.scrollTo({ top: offset, behavior: 'instant' })
}

watch(() => calendarStore.currentYear, async (newYear) => {
    await nextTick()
    if (newYear === todayYear && prefsStore.autoscrollToArrow) {
        scrollToArrow()
    } else {
        window.scrollTo({ top: 0, behavior: 'instant' })
    }
})

onMounted(async () => {
    await nextTick()
    calendarStore.markCalendarReady()
    if (prefsStore.autoscrollToArrow && calendarStore.currentYear === todayYear) {
        scrollToArrow()
    }
})
</script>

<template>
  <div class="calendar-display">
    <MonthTable
      v-for="i in 12"
      :key="i"
      :monthIndex="i - 1"
      :year="calendarStore.currentYear"
    />
  </div>
</template>
