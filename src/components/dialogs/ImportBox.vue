<script setup>
import { computed, ref, watch } from 'vue'
import { useCalendarStore } from '../../stores/calendar'
import { monthsShort } from '../../utils/dates'
import DialogBase from './DialogBase.vue'

const calendarStore = useCalendarStore()

const isVisible = computed(() => calendarStore.activeDialog === 'import')

const keys     = ref([])   // sorted month-year keys from file
const selected  = ref({})  // key → boolean
const allParsed = ref([])  // [{ key, data }] full parsed file contents
const errorMsg  = ref('')

watch(isVisible, (visible) => {
    if (!visible) {
        keys.value = []
        selected.value = {}
        allParsed.value = []
        errorMsg.value = ''
    }
})

function sortKeys(arr) {
    return [...arr].sort((a, b) => {
        const [ma, ya] = a.split('-')
        const [mb, yb] = b.split('-')
        return ya !== yb ? parseInt(ya) - parseInt(yb) : monthsShort.indexOf(ma) - monthsShort.indexOf(mb)
    })
}

function parseFile(text) {
    const parsed = []
    const lines  = text.split('\n')
    for (const line of lines) {
        const parts = line.split(' § ')
        if (parts.length >= 2) {
            try {
                parsed.push({ key: parts[0], data: JSON.parse(parts[1]) })
            } catch { /* skip malformed lines */ }
        }
    }
    return parsed
}

function openFilePicker(quickImport = false) {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.txt'
    document.body.appendChild(input)

    input.addEventListener('change', () => {
        const file = input.files[0]
        document.body.removeChild(input)
        if (!file) return

        const reader = new FileReader()
        reader.onload = () => {
            const parsed   = parseFile(reader.result)
            allParsed.value = parsed

            const validKeys = [...new Set(
                parsed
                    .filter(e => /^[a-z]{3}-\d{4}$/.test(e.key))
                    .map(e => e.key)
            )]
            const sorted = sortKeys(validKeys)

            if (quickImport) {
                doQuickImport(parsed)
            } else {
                keys.value = sorted
                const sel = {}
                sorted.forEach(k => { sel[k] = true })
                selected.value = sel
                errorMsg.value = sorted.length === 0 ? 'No data was found in file' : ''
                calendarStore.setActiveDialog('import')
            }
        }
        reader.readAsText(file)
    })

    input.click()
}

function doQuickImport(parsed) {
    parsed
        .filter(e => /^[a-z]{3}-\d{4}$/.test(e.key))
        .forEach(e => localStorage.setItem(e.key, JSON.stringify(e.data)))
    calendarStore.requestReload()
    calendarStore.closeAllDialogs()
}

function doImport() {
    if (!hasSelection.value) return

    allParsed.value
        .filter(e => selected.value[e.key])
        .forEach(e => localStorage.setItem(e.key, JSON.stringify(e.data)))

    calendarStore.requestReload()
    calendarStore.closeAllDialogs()
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

defineExpose({ openFilePicker })
</script>

<template>
  <DialogBase dialogName="import" title="Import Data">
    <div v-if="errorMsg" class="port-error">{{ errorMsg }}</div>

    <div v-else-if="keys.length === 0" class="port-error">
      No file loaded yet.<br />
      <input type="button" value="Choose file…" @click="openFilePicker(false)" style="margin-top:8px" />
    </div>

    <div v-else id="import-form">
      <p class="port-line-header">Select months to import:</p>

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
          :class="`import-cont-${key}`"
          @click="toggleKey(key)"
        >
          <p
            :class="[`import-p-${key}`, { inactive: !selected[key] }]"
            :data-key="key"
          >{{ label(key) }}</p>
        </div>
      </div>

      <div class="port-line-3">
        <input
          type="button"
          value="Import data"
          :class="{ inactive: !hasSelection }"
          @click="doImport"
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
