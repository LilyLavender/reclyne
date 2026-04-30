import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { updateLocalStorage, retrieveFromLocalStorage } from '../composables/useLocalStorage'
import { averageColors } from '../utils/colors'

const PREFS_KEY = 'reclyne-preferences'
const THEME_KEY = 'reclyne-theme'

const DEFAULT_PREFERENCES = [false, true, true, true, 0]
const DEFAULT_THEME_COLORS = [
    ["Winter Reclyne", "#110b1d", "#d5d9f2", "#9da8ec"],
    ["Spring Reclyne", "#0c1c0b", "#c9efce", "#53c763"],
    ["Summer Reclyne", "#1d130b", "#fbf1b1", "#dbd150"],
    ["Fall Reclyne", "#1d0f0b", "#f9cfb6", "#f97b39"],
]

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

    watch([hideElapsed, autoscrollToArrow, allColumns, monthFirst, themeNumber], () => {
        updateLocalStorage(PREFS_KEY, [
            hideElapsed.value,
            autoscrollToArrow.value,
            allColumns.value,
            monthFirst.value,
            themeNumber.value,
        ])
    })

    function initializeTheme() {
        let themeColors = retrieveFromLocalStorage(THEME_KEY)
        if (!themeColors) {
            themeColors = DEFAULT_THEME_COLORS.map(t => [...t])
            updateLocalStorage(THEME_KEY, themeColors)
        }
        const t = themeNumber.value
        if (themeColors[t][4] == null) {
            const light  = themeColors[t][2]
            const accent = themeColors[t][3]
            const accent50 = averageColors(light, accent)
            const accent25 = averageColors(accent50, light)
            const accent75 = averageColors(accent50, accent)
            themeColors[t][4] = accent25
            themeColors[t][5] = accent50
            themeColors[t][6] = accent75
            updateLocalStorage(THEME_KEY, themeColors)
        }
        const theme = themeColors[t]
        const root = document.documentElement
        root.style.setProperty('--dark',      theme[1])
        root.style.setProperty('--light',     theme[2])
        root.style.setProperty('--accent',    theme[3])
        root.style.setProperty('--accent-25', theme[4])
        root.style.setProperty('--accent-50', theme[5])
        root.style.setProperty('--accent-75', theme[6])
    }

    return { hideElapsed, autoscrollToArrow, allColumns, monthFirst, themeNumber, initializeTheme }
})
