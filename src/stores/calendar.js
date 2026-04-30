import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCalendarStore = defineStore('calendar', () => {
    const currentYear    = ref(new Date().getFullYear())
    const unsavedChanges = ref(false)
    const activeDialog   = ref(null) // null | 'goto' | 'syntax' | 'import' | 'export' | 'about' | 'changes'
    const calendarReady  = ref(false)

    function setActiveDialog(name) {
        activeDialog.value = name
    }

    function closeAllDialogs() {
        activeDialog.value = null
    }

    function markCalendarReady() {
        calendarReady.value = true
    }

    return { currentYear, unsavedChanges, activeDialog, calendarReady, setActiveDialog, closeAllDialogs, markCalendarReady }
})
