import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { updateLocalStorage, retrieveFromLocalStorage } from '../composables/useLocalStorage'

const PREFS_KEY = 'reclyne-preferences'

const DEFAULT_PREFERENCES = [false, true, true, true, 0]

function loadAndValidatePrefs() {
    let stored = retrieveFromLocalStorage(PREFS_KEY)
    if (!stored) {
        updateLocalStorage(PREFS_KEY, DEFAULT_PREFERENCES)
        return [...DEFAULT_PREFERENCES]
    }
    // If length is short and types match the existing entries, fill in missing
    if (stored.length < DEFAULT_PREFERENCES.length
        && stored.every((p, i) => typeof p === typeof DEFAULT_PREFERENCES[i])) {
        for (let i = stored.length; i < DEFAULT_PREFERENCES.length; i++) {
            stored.push(DEFAULT_PREFERENCES[i])
        }
        updateLocalStorage(PREFS_KEY, stored)
    } else if (stored.length !== DEFAULT_PREFERENCES.length) {
        updateLocalStorage(PREFS_KEY, DEFAULT_PREFERENCES)
        return [...DEFAULT_PREFERENCES]
    }
    // Restore any individual invalid entries
    DEFAULT_PREFERENCES.forEach((def, i) => {
        if (typeof stored[i] !== typeof def) stored[i] = def
    })
    return stored
}

export const usePreferencesStore = defineStore('preferences', () => {
    const prefs = loadAndValidatePrefs()

    const hideElapsed        = ref(prefs[0])
    const autoscrollToArrow  = ref(prefs[1])
    const allColumns         = ref(prefs[2])
    const monthFirst         = ref(prefs[3])
    const themeNumber        = ref(prefs[4])

    // Debounced so rapid toggles only hit localStorage once
    let debounceTimer = null
    watch([hideElapsed, autoscrollToArrow, allColumns, monthFirst, themeNumber], () => {
        clearTimeout(debounceTimer)
        debounceTimer = setTimeout(() => {
            updateLocalStorage(PREFS_KEY, [
                hideElapsed.value,
                autoscrollToArrow.value,
                allColumns.value,
                monthFirst.value,
                themeNumber.value,
            ])
        }, 300)
    })

    return { hideElapsed, autoscrollToArrow, allColumns, monthFirst, themeNumber }
})
