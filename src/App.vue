<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useCalendarStore } from './stores/calendar'
import { usePreferencesStore } from './stores/preferences'
import { useKeyboardShortcuts } from './composables/useKeyboardShortcuts'
import LoadingScreen from './components/LoadingScreen.vue'
import AppNav from './components/AppNav.vue'
import CalendarDisplay from './components/CalendarDisplay.vue'
import GotoBox from './components/dialogs/GotoBox.vue'
import AboutBox from './components/dialogs/AboutBox.vue'
import UnsavedChangesBox from './components/dialogs/UnsavedChangesBox.vue'
import ExportBox from './components/dialogs/ExportBox.vue'
import ImportBox from './components/dialogs/ImportBox.vue'

const calendarStore = useCalendarStore()
const prefsStore = usePreferencesStore()

const phantomNavHeight = ref(0)
const importBoxRef  = ref(null)
const exportBoxRef  = ref(null)

useKeyboardShortcuts()

function beforeUnload(e) {
    e.preventDefault()
}

watch(() => calendarStore.unsavedChanges, (hasChanges) => {
    if (hasChanges) {
        window.addEventListener('beforeunload', beforeUnload)
    } else {
        window.removeEventListener('beforeunload', beforeUnload)
    }
})

onMounted(() => {
    prefsStore.initializeTheme()
})

onUnmounted(() => {
    window.removeEventListener('beforeunload', beforeUnload)
})
</script>

<template>
  <LoadingScreen />
  <AppNav
    @nav-height="h => phantomNavHeight = h"
    @import-click="importBoxRef?.openFilePicker(false)"
    @quick-import="importBoxRef?.openFilePicker(true)"
    @export-click="calendarStore.setActiveDialog('export')"
    @quick-export="exportBoxRef?.quickExport()"
  />
  <div class="phantom-nav" :style="{ height: phantomNavHeight + 'px' }"></div>
  <div class="overlay" :class="{ hidden: !calendarStore.activeDialog }" @click="calendarStore.closeAllDialogs()"></div>
  <CalendarDisplay />
  <footer></footer>

  <GotoBox />
  <AboutBox />
  <UnsavedChangesBox />
  <ExportBox ref="exportBoxRef" />
  <ImportBox ref="importBoxRef" />
</template>
