import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCalendarStore = defineStore('calendar', () => {
    const currentYear    = ref(new Date().getFullYear())
    const unsavedChanges = ref(false)
    const activeDialog   = ref(null) // null | 'goto' | 'syntax' | 'import' | 'export' | 'about' | 'changes'

    function setActiveDialog(name) {
        activeDialog.value = name
    }

    function closeAllDialogs() {
        activeDialog.value = null
    }

    return { currentYear, unsavedChanges, activeDialog, setActiveDialog, closeAllDialogs }
})
