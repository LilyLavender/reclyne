<script setup>
import { computed, ref, watch } from 'vue'
import { useCalendarStore } from '../../stores/calendar'
import { monthsShort } from '../../utils/dates'
import DialogBase from './DialogBase.vue'

const calendarStore = useCalendarStore()

const isVisible = computed(() => calendarStore.activeDialog === 'export')

const keys    = ref([])   // sorted month-year keys from localStorage
const selected = ref({})  // key → boolean

watch(isVisible, (visible) => {
    if (visible) populate()
    else selected.value = {}
})

function getReclyneKeys() {
    return Object.keys(localStorage)
        .filter(k => /^[a-z]{3}-\d{4}$/.test(k))
        .sort((a, b) => {
            const [ma, ya] = a.split('-')
            const [mb, yb] = b.split('-')
            return ya !== yb ? parseInt(ya) - parseInt(yb) : monthsShort.indexOf(ma) - monthsShort.indexOf(mb)
        })
}

function populate() {
    keys.value = getReclyneKeys()
    const sel = {}
    keys.value.forEach(k => { sel[k] = true })
    selected.value = sel
}

function toggleKey(key) {
    selected.value[key] = !selected.value[key]
}

function selectAll() {
    keys.value.forEach(k => { selected.value[k] = true })
}

function selectNone() {
    keys.value.forEach(k => { selected.value[k] = false })
}

const hasSelection = computed(() => Object.values(selected.value).some(Boolean))

const gridCols = computed(() => {
    const n = keys.value.length
    return Math.min(Math.ceil(Math.sqrt(n)), 9)
})

function label(key) {
    const [month, year] = key.split('-')
    return `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`
}

function getVerboseDateTime() {
    const d = new Date()
    const pad = n => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}-${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}`
}

function doExport() {
    if (!hasSelection.value) return

    const lines = []
    keys.value
        .filter(k => selected.value[k])
        .forEach(k => {
            const val = localStorage.getItem(k)
            if (val !== null) lines.push(`${k} § ${val}`)
        })

    if (lines.length === 0) return

    const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url
    a.download = `reclyne-data-${getVerboseDateTime()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    calendarStore.closeAllDialogs()
}

function quickExport() {
    const allKeys = getReclyneKeys()
    if (allKeys.length === 0) return

    const lines = allKeys.map(k => `${k} § ${localStorage.getItem(k)}`)
    const blob  = new Blob([lines.join('\n')], { type: 'text/plain' })
    const url   = URL.createObjectURL(blob)
    const a     = document.createElement('a')
    a.href = url
    a.download = `reclyne-data-${getVerboseDateTime()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
}

defineExpose({ quickExport })
</script>

<template>
  <DialogBase dialogName="export" title="Export Data">
    <div v-if="keys.length === 0" class="port-error">
      No data in reclyne! Try adding something first.
    </div>

    <div v-else id="export-form">
      <p class="port-line-header">Select months to export:</p>

      <div v-if="keys.length > 1" class="port-buttons port-line-1">
        <input type="button" value="All"  @click="selectAll" />
        <input type="button" value="None" @click="selectNone" />
      </div>

      <div
        class="port-line-2"
        :style="{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }"
      >
        <div
          v-for="key in keys"
          :key="key"
          :class="`export-cont-${key}`"
          @click="toggleKey(key)"
        >
          <p
            :class="[`export-p-${key}`, { inactive: !selected[key] }]"
            :data-key="key"
          >{{ label(key) }}</p>
        </div>
      </div>

      <div class="port-line-3">
        <input
          type="button"
          value="Export data"
          :class="{ inactive: !hasSelection }"
          @click="doExport"
        />
        <input
          type="button"
          class="cancel-button"
          value="Cancel"
          @click="calendarStore.closeAllDialogs()"
        />
      </div>
    </div>
  </DialogBase>
</template>
