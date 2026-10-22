<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { useCalendarStore } from '../../stores/calendar'
import { usePreferencesStore } from '../../stores/preferences'
import { getGotoDate, getPrettyDate } from '../../utils/gotoDate'
import DialogBase from './DialogBase.vue'
import SyntaxBox from './SyntaxBox.vue'

const calendarStore = useCalendarStore()
const prefsStore    = usePreferencesStore()

const inputVal   = ref('')
const showSyntax = ref(false)
const previewHelperText = ref('Preview will show up here')
const previewText       = ref('')
const previewValid      = ref(false)

const arrowClass = computed(() =>
    prefsStore.monthFirst ? 'rotate90right' : 'rotate90left'
)

const isVisible = computed(() => calendarStore.activeDialog === 'goto')

watch(isVisible, (visible) => {
    if (visible) {
        nextTick(() => document.getElementById('goto-input')?.focus())
    } else {
        inputVal.value = ''
        previewValid.value = false
        previewHelperText.value = 'Preview will show up here'
        previewText.value = ''
        showSyntax.value = false
    }
})

function updatePreview() {
    const result = getGotoDate(inputVal.value, calendarStore.currentYear, prefsStore.monthFirst)
    if (!result[0]) {
        previewValid.value = false
        previewHelperText.value = 'Preview will show up here'
        previewText.value = ''
    } else {
        previewValid.value = true
        previewHelperText.value = 'Going to:'
        previewText.value = getPrettyDate(result[0], result[1], result[2])
    }
}

async function handleSubmit() {
    const result = getGotoDate(inputVal.value, calendarStore.currentYear, prefsStore.monthFirst)
    if (!result[0]) return

    const [date, hasMonth, hasDay] = result
    const targetYear = date.getFullYear()

    calendarStore.closeAllDialogs()
    await calendarStore.setYearTo(targetYear)
    // Year change was cancelled in the unsaved-changes dialog
    if (calendarStore.currentYear !== targetYear) return

    const type = hasMonth && hasDay ? 'day' : hasMonth ? 'month' : 'top'
    calendarStore.setScrollTarget({
        type,
        month: hasMonth ? date.getMonth() : null,
        day:   hasDay ? date.getDate() : null,
    })
}

function setFormat(monthFirst) {
    prefsStore.monthFirst = monthFirst
    updatePreview()
}

function toggleFormat() {
    setFormat(!prefsStore.monthFirst)
}
</script>

<template>
  <DialogBase dialogName="goto" title="Go To...">
    <template #header-extra>
      <div id="syntax-container" @click="showSyntax = !showSyntax">
        <p>Syntax</p>
      </div>
    </template>

    <form id="goto-form" @submit.prevent="handleSubmit">
      <div id="goto-line-1">
        <span id="goto-input-label">Date:</span>
        <input
          id="goto-input"
          v-model="inputVal"
          @input="updatePreview"
          autocomplete="off"
        />
        <button id="goto-submit-button" type="submit">Goto!</button>
      </div>

      <div id="goto-line-2">
        <p id="goto-preview-helper" :class="{ inactive: !previewValid }">{{ previewHelperText }}</p>
        <p id="goto-preview">{{ previewText }}</p>
      </div>

      <div id="goto-line-3" @click="updatePreview">
        <p :class="{ inactive: prefsStore.monthFirst }" @click.stop="setFormat(false)">Day first</p>
        <i id="date-format-arrow" class="bi bi-arrow-up" :class="arrowClass" @click.stop="toggleFormat"></i>
        <p :class="{ inactive: !prefsStore.monthFirst }" @click.stop="setFormat(true)">Month first</p>
      </div>
    </form>
  </DialogBase>

  <SyntaxBox :visible="showSyntax" @close="showSyntax = false" />
</template>
