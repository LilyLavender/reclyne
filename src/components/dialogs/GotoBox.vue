<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { useCalendarStore } from '../../stores/calendar'
import { usePreferencesStore } from '../../stores/preferences'
import { getGotoDate, getPrettyDate } from '../../utils/gotoDate'
import { monthsLong } from '../../utils/dates'
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

function handleSubmit() {
    const result = getGotoDate(inputVal.value, calendarStore.currentYear, prefsStore.monthFirst)
    if (!result[0]) return

    const [date, hasMonth, hasDay] = result
    const targetYear = date.getFullYear()

    calendarStore.closeAllDialogs()
    calendarStore.setYearTo(targetYear)

    setTimeout(() => scrollToDate(date, hasMonth, hasDay), 400)
}

function scrollToDate(date, hasMonth, hasDay) {
    let el
    if (hasMonth && hasDay) {
        const short = date.toLocaleString('default', { month: 'short' })
        const day   = date.getDate()
        const text  = `${short} ${day}`
        el = Array.from(document.querySelectorAll('td')).find(td => td.textContent.trim() === text)
        if (el) {
            const table = el.closest('table')
            if (table && table.classList.contains('hidden')) {
                table.previousElementSibling?.click()
                setTimeout(() => doScroll(el), 100)
                return
            }
        }
    } else if (hasMonth) {
        const monthLong = monthsLong[date.getMonth()]
        el = document.querySelector(`h2.${monthLong}-header`)
        if (el && !el.classList.contains('open')) el.click()
    } else {
        el = document.querySelector('.phantom-nav')
    }

    if (!el) return
    doScroll(el)
}

function doScroll(el) {
    const offset = el.getBoundingClientRect().top + window.scrollY - window.innerHeight / 4 + 3
    window.scrollTo({ top: offset, behavior: 'smooth' })
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
