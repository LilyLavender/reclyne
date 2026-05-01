<script setup>
import { nextTick, onMounted, ref, watch } from 'vue'
import { useCalendarStore } from '../stores/calendar'
import { usePreferencesStore } from '../stores/preferences'
import { saveMonthData } from '../composables/useCalendarData'
import MonthTable from './MonthTable.vue'

const calendarStore = useCalendarStore()
const prefsStore    = usePreferencesStore()

const todayYear      = new Date().getFullYear()
const monthTableRefs = ref([])

// ─── Scroll ───────────────────────────────────────────────────────────────────
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

// ─── Save ─────────────────────────────────────────────────────────────────────
function saveAllMonths() {
    const year = calendarStore.currentYear

    for (let i = 0; i < 12; i++) {
        const mt = monthTableRefs.value[i]
        if (!mt) continue

        const colCount   = mt.colCount.value
        const colNames   = prefsStore.allColumns ? calendarStore.sharedColumnNames : mt.localColNames.value
        const colWidths  = mt.colWidths.value
        const rows       = mt.rows.value
        const monthShort = mt.monthShort.value

        // Build RDA: [0]=names [1]=widths [j+2]=sparse column data
        const rda = Array.from({ length: colCount + 2 }, () => [])

        for (let j = 0; j < colCount; j++) {
            rda[0][j] = colNames[j] ?? 'Column'
            rda[1][j] = colWidths[j] ?? 0
        }
        for (let day = 0; day < rows.length; day++) {
            for (let j = 0; j < colCount; j++) {
                const val = rows[day]?.[j] ?? ''
                if (val !== '') rda[j + 2][day] = val
            }
        }

        saveMonthData(monthShort, year, rda)
    }

    calendarStore.unsavedChanges = false
    console.log('Saved!')
}

// Trigger save whenever the store signals it
watch(() => calendarStore.saveRequested, () => saveAllMonths())

// Trigger scroll-to-arrow whenever the store signals it
watch(() => calendarStore.scrollRequested, async () => {
    calendarStore.setYearTo(new Date().getFullYear())
    await nextTick()
    scrollToArrow()
})

// ─── Mount ───────────────────────────────────────────────────────────────────
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
      :key="`${i}-${calendarStore.dataVersion}`"
      :ref="el => { if (el) monthTableRefs[i - 1] = el }"
      :monthIndex="i - 1"
      :year="calendarStore.currentYear"
    />
  </div>
</template>
