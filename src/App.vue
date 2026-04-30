<script setup>
import { onMounted, onUnmounted, watch } from 'vue'
import { useCalendarStore } from './stores/calendar'
import { usePreferencesStore } from './stores/preferences'
import LoadingScreen from './components/LoadingScreen.vue'
import AppNav from './components/AppNav.vue'
import CalendarDisplay from './components/CalendarDisplay.vue'

const calendarStore = useCalendarStore()
const prefsStore = usePreferencesStore()

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
    // TODO: replace with CalendarDisplay 'ready' emit in section 6
    setTimeout(() => calendarStore.markCalendarReady(), 20)
})

onUnmounted(() => {
    window.removeEventListener('beforeunload', beforeUnload)
})
</script>

<template>
  <LoadingScreen />
  <AppNav />
  <div class="phantom-nav"></div>
  <div class="overlay" :class="{ hidden: !calendarStore.activeDialog }" @click="calendarStore.closeAllDialogs()"></div>
  <CalendarDisplay />
  <footer></footer>
</template>
