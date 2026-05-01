import { onMounted, onUnmounted } from 'vue'
import { useCalendarStore } from '../stores/calendar'
import { usePreferencesStore } from '../stores/preferences'

export function useKeyboardShortcuts() {
    const calendarStore = useCalendarStore()
    const prefsStore    = usePreferencesStore()

    function onKeyDown(e) {
        if (e.key === 'Escape') {
            calendarStore.closeAllDialogs()
            return
        }
        if (!e.ctrlKey) return

        if (e.key === 's') {
            e.preventDefault()
            calendarStore.saveCalendar()
        } else if (e.key === 'g') {
            e.preventDefault()
            calendarStore.setActiveDialog('goto')
        } else if (e.key === 'ArrowRight') {
            // Only trigger scroll if no input is focused
            if (!document.querySelector('input:focus')) {
                e.preventDefault()
                calendarStore.requestScroll()
            }
        } else if (e.key === 'e') {
            e.preventDefault()
            prefsStore.allColumns = !prefsStore.allColumns
        }
    }

    onMounted(() => document.addEventListener('keydown', onKeyDown))
    onUnmounted(() => document.removeEventListener('keydown', onKeyDown))
}
