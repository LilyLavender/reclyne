<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useCalendarStore } from '../stores/calendar'
import { usePreferencesStore } from '../stores/preferences'
import { getMonthData } from '../composables/useCalendarData'
import DayRow from './DayRow.vue'

const props = defineProps({
    monthIndex: { type: Number, required: true },
    year:       { type: Number, required: true },
})

const calendarStore = useCalendarStore()
const prefsStore    = usePreferencesStore()

// ─── Month metadata ───────────────────────────────────────────────────────────
const monthDate      = computed(() => new Date(props.year, props.monthIndex + 1, 0))
const numDays        = computed(() => monthDate.value.getDate())
const monthShort     = computed(() => monthDate.value.toLocaleString('default', { month: 'short' }).toLowerCase())
const monthLong      = computed(() => monthDate.value.toLocaleString('default', { month: 'long' }))
const monthLongLower = computed(() => monthLong.value.toLowerCase())

// ─── Storage ─────────────────────────────────────────────────────────────────
function loadFromStorage() {
    const rda      = getMonthData(monthShort.value, props.year)
    const colCount = rda ? rda[0].length : 4
    const names    = rda ? [...rda[0]] : Array(colCount).fill('Column')
    const widths   = rda ? rda[1].map(w => w || 0) : Array(colCount).fill(0)
    const rows     = []
    for (let i = 0; i < numDays.value; i++) {
        const row = []
        for (let j = 0; j < colCount; j++) {
            row.push(rda && rda[j + 2] && rda[j + 2][i] ? rda[j + 2][i] : '')
        }
        rows.push(row)
    }
    return { colCount, names, widths, rows }
}

const colCount      = ref(4)
const localColNames = ref([])
const colWidths     = ref([])
const rows          = ref([])

function applyStorageLoad() {
    const s        = loadFromStorage()
    colCount.value      = s.colCount
    localColNames.value = s.names
    colWidths.value     = s.widths
    rows.value          = s.rows
}

applyStorageLoad()

watch(() => props.year, applyStorageLoad)
watch(() => calendarStore.reloadRequested, applyStorageLoad)

// ─── Column names (shared vs per-month) ──────────────────────────────────────
const displayColNames = computed(() =>
    prefsStore.allColumns ? calendarStore.sharedColumnNames : localColNames.value
)

// Seed shared names from first month that has non-default names
onMounted(() => {
    const allDefault = calendarStore.sharedColumnNames.every(n => n === 'Column')
    const hasCustom  = localColNames.value.some(n => n !== 'Column')
    if (allDefault && hasCustom) {
        calendarStore.sharedColumnNames = [...localColNames.value]
    }
})

// ─── Collapse / expand ───────────────────────────────────────────────────────
const collapsed = ref(false)

function expand() {
    collapsed.value = false
}

function isElapsedMonth() {
    return props.year === new Date().getFullYear() && props.monthIndex < new Date().getMonth()
}

onMounted(() => {
    if (prefsStore.hideElapsed && isElapsedMonth()) collapsed.value = true
})

watch(() => prefsStore.hideElapsed, (hide) => {
    if (isElapsedMonth()) collapsed.value = hide
})

// ─── Header editing ───────────────────────────────────────────────────────────
const editingHeaderIdx = ref(null)
const editHeaderValue  = ref('')
const headerInputEls   = ref([])

function startEditHeader(i) {
    editingHeaderIdx.value = i
    editHeaderValue.value  = displayColNames.value[i]
    nextTick(() => headerInputEls.value[i]?.focus())
}

function finishEditHeader(i) {
    if (editingHeaderIdx.value !== i) return
    const name = editHeaderValue.value.trim() || 'Column'
    if (prefsStore.allColumns) {
        const updated = [...calendarStore.sharedColumnNames]
        updated[i] = name
        calendarStore.sharedColumnNames = updated
    } else {
        localColNames.value[i] = name
    }
    editingHeaderIdx.value = null
    calendarStore.unsavedChanges = true
}

// ─── Drag-to-resize ───────────────────────────────────────────────────────────
function startDrag(e, i) {
    const startX     = e.clientX
    const startRight = colWidths.value[i] || 0

    function onMove(ev) {
        colWidths.value[i] = startRight - (ev.clientX - startX)
    }
    function onUp() {
        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('mouseup', onUp)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
}

// ─── Today arrow ─────────────────────────────────────────────────────────────
const today = new Date()

const todayIdx = computed(() => {
    if (props.year !== today.getFullYear() || props.monthIndex !== today.getMonth()) return -1
    return today.getDate() - 1
})

// Whether today is the last day of its month (for border-radius fix)
const todayIsLastDay = computed(() =>
    todayIdx.value !== -1 && todayIdx.value === numDays.value - 1
)

// ─── Row updates ─────────────────────────────────────────────────────────────
function handleRowUpdate(i, newRow) {
    rows.value[i] = newRow
    calendarStore.unsavedChanges = true
}

// ─── Element refs for goto scrolling ─────────────────────────────────────────
const headerEl = ref(null)
const rowRefs  = ref([])

/** Returns the row for a 1-based day of the month, or null. */
function getRowEl(day) {
    return rowRefs.value[day - 1]?.el ?? null
}

// Expose for save (CalendarDisplay) and goto scrolling
defineExpose({ monthShort, monthLong, colCount, localColNames, colWidths, rows, expand, headerEl, getRowEl })
</script>

<template>
  <h2
    ref="headerEl"
    :class="[`${monthLongLower}-header`, { open: !collapsed }]"
    @click="collapsed = !collapsed"
  >{{ monthLong }}<i class="bi bi-caret-down"></i></h2>

  <table :class="[`${monthLongLower}-table`, { hidden: collapsed }]">
    <tr>
      <th class="non-editable-header">Date</th>
      <th
        v-for="(name, i) in displayColNames"
        :key="i"
        class="editable-header"
        :header-num="i + 1"
      >
        <p v-show="editingHeaderIdx !== i" @click="startEditHeader(i)">{{ name }}</p>
        <input
          v-show="editingHeaderIdx === i"
          :ref="el => { if (el) headerInputEls[i] = el }"
          type="text"
          :value="editHeaderValue"
          @input="editHeaderValue = $event.target.value"
          @blur="finishEditHeader(i)"
          @keydown.enter="$event.target.blur()"
          autocomplete="off"
          spellcheck="false"
        />
        <div
          class="drag-header"
          :style="colWidths[i] ? { right: colWidths[i] + 'px' } : {}"
          @mousedown.prevent="startDrag($event, i)"
        ></div>
      </th>
    </tr>

    <DayRow
      v-for="(row, i) in rows"
      :key="i"
      :ref="el => { if (el) rowRefs[i] = el }"
      :date="new Date(year, monthIndex, i + 1)"
      :rowData="row"
      :isToday="todayIdx === i"
      :isTodayLastDay="todayIsLastDay && todayIdx === i"
      @update="handleRowUpdate(i, $event)"
    />
  </table>
</template>
