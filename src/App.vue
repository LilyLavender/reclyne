<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useCalendarStore } from './stores/calendar'
import { usePreferencesStore } from './stores/preferences'
import LoadingScreen from './components/LoadingScreen.vue'
import AppNav from './components/AppNav.vue'
import CalendarDisplay from './components/CalendarDisplay.vue'

const calendarStore = useCalendarStore()
const prefsStore = usePreferencesStore()

const phantomNavHeight = ref(0)

function beforeUnload(e) {
    e.preventDefault()
}

function onKeyDown(e) {
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault()
        calendarStore.saveCalendar()
    }
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
    document.addEventListener('keydown', onKeyDown)
})

onUnmounted(() => {
    window.removeEventListener('beforeunload', beforeUnload)
    document.removeEventListener('keydown', onKeyDown)
})
</script>

<template>
  <LoadingScreen />
  <AppNav @nav-height="h => phantomNavHeight = h" />
  <div class="phantom-nav" :style="{ height: phantomNavHeight + 'px' }"></div>
  <div class="overlay" :class="{ hidden: !calendarStore.activeDialog }" @click="calendarStore.closeAllDialogs()"></div>
  <CalendarDisplay />
  <footer></footer>
</template>
