import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCalendarStore = defineStore('calendar', () => {
    const currentYear       = ref(new Date().getFullYear())
    const unsavedChanges    = ref(false)
    const activeDialog      = ref(null) // null | 'goto' | 'import' | 'export' | 'about' | 'changes'
    const calendarReady     = ref(false)
    const sharedColumnNames = ref(['Column', 'Column', 'Column', 'Column'])
    const saveRequested     = ref(0)
    const scrollRequested   = ref(0)
    const reloadRequested   = ref(0)
    const scrollTarget      = ref(null) // null | { type: 'top' | 'month' | 'day', month: number|null, day: number|null }

    function setActiveDialog(name) {
        activeDialog.value = activeDialog.value === name ? null : name
    }

    function closeAllDialogs() {
        activeDialog.value = null
    }

    function markCalendarReady() {
        calendarReady.value = true
    }

    // Non-reactive — holds the resolve fn for the pending unsaved-changes confirmation
    let pendingSaveResolve = null

    function saveCalendar() {
        if (activeDialog.value === 'changes') {
            // ChangesBox is open; user explicitly clicked Save inside it — save first, then let caller proceed
            saveRequested.value++
            resolvePendingSave(true)
        } else if (unsavedChanges.value) {
            saveRequested.value++
        }
    }

    function markSaved() {
        unsavedChanges.value = false
    }

    function requestScroll() {
        scrollRequested.value++
    }

    function requestReload() {
        reloadRequested.value++
    }

    function setScrollTarget(target) {
        scrollTarget.value = target
    }

    function clearScrollTarget() {
        scrollTarget.value = null
    }

    async function trySaveCalendar() {
        setActiveDialog('changes')
        return new Promise(resolve => {
            pendingSaveResolve = resolve
        })
    }

    function resolvePendingSave(shouldSave) {
        if (pendingSaveResolve) {
            pendingSaveResolve(shouldSave)
            pendingSaveResolve = null
        }
        closeAllDialogs()
    }

    async function updateYear(delta) {
        if (unsavedChanges.value) {
            const proceed = await trySaveCalendar()
            if (!proceed) return
        }
        currentYear.value += delta
        closeAllDialogs()
    }

    // Resolves once the year change has gone through or been cancelled
    async function setYearTo(year) {
        if (currentYear.value !== year) await updateYear(year - currentYear.value)
    }

    return {
        currentYear, unsavedChanges, activeDialog, calendarReady, sharedColumnNames, saveRequested, scrollRequested, reloadRequested, scrollTarget,
        setActiveDialog, closeAllDialogs, markCalendarReady,
        saveCalendar, trySaveCalendar, resolvePendingSave, markSaved, requestScroll, requestReload, setScrollTarget, clearScrollTarget,
        updateYear, setYearTo,
    }
})
