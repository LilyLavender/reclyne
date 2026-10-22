<script setup>
import { nextTick, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useCalendarStore } from '../stores/calendar'
import { usePreferencesStore } from '../stores/preferences'
import { saveMonthData } from '../composables/useCalendarData'
import { scrollToEl } from '../utils/scroll'
import MonthTable from './MonthTable.vue'

const calendarStore = useCalendarStore()
const prefsStore    = usePreferencesStore()
const { saveRequested, scrollRequested } = storeToRefs(calendarStore)

const todayYear      = new Date().getFullYear()
const monthTableRefs = ref([])

// ─── Scroll ───────────────────────────────────────────────────────────────────
function scrollToArrow(smooth = false) {
    const arrow = document.querySelector('.arrow-container')
    if (!arrow) return
    scrollToEl(arrow, smooth)
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

        const colCount   = mt.colCount
        const colNames   = prefsStore.allColumns ? calendarStore.sharedColumnNames : mt.localColNames
        const colWidths  = mt.colWidths
        const rows       = mt.rows
        const monthShort = mt.monthShort

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

    calendarStore.markSaved()
}

// Trigger save whenever the store signals it
watch(saveRequested, () => saveAllMonths())

// Trigger scroll-to-arrow whenever the store signals it
watch(scrollRequested, async () => {
    calendarStore.setYearTo(new Date().getFullYear())
    await nextTick()
    scrollToArrow(true)
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
      :key="i"
      :ref="el => { if (el) monthTableRefs[i - 1] = el }"
      :monthIndex="i - 1"
      :year="calendarStore.currentYear"
    />
  </div>
</template>
