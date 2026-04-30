import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCalendarStore = defineStore('calendar', () => {
    const currentYear       = ref(new Date().getFullYear())
    const unsavedChanges    = ref(false)
    const activeDialog      = ref(null) // null | 'goto' | 'syntax' | 'import' | 'export' | 'about' | 'changes'
    const calendarReady     = ref(false)
    const sharedColumnNames = ref(['Column', 'Column', 'Column', 'Column'])

    function setActiveDialog(name) {
        activeDialog.value = name
    }

    function closeAllDialogs() {
        activeDialog.value = null
    }

    function markCalendarReady() {
        calendarReady.value = true
    }

    function updateYear(delta) {
        currentYear.value += delta
        closeAllDialogs()
    }

    function setYearTo(year) {
        if (currentYear.value !== year) {
            updateYear(year - currentYear.value)
        }
    }

    function saveCalendar() {
        // Implemented in section 9
    }

    return {
        currentYear, unsavedChanges, activeDialog, calendarReady, sharedColumnNames,
        setActiveDialog, closeAllDialogs, markCalendarReady,
        updateYear, setYearTo, saveCalendar,
    }
})
