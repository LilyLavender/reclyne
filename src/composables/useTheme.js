import { watch } from 'vue'
import { usePreferencesStore } from '../stores/preferences'
import { updateLocalStorage, retrieveFromLocalStorage } from './useLocalStorage'
import { averageColors } from '../utils/colors'

const THEME_KEY = 'reclyne-theme'

export const DEFAULT_THEME_COLORS = [
    ["Winter Reclyne", "#110b1d", "#d5d9f2", "#9da8ec"],
    ["Spring Reclyne", "#0c1c0b", "#c9efce", "#53c763"],
    ["Summer Reclyne", "#1d130b", "#fbf1b1", "#dbd150"],
    ["Fall Reclyne",   "#1d0f0b", "#f9cfb6", "#f97b39"],
]

function ensureMiddleColors(themeColors, t) {
    if (themeColors[t][4] != null) return themeColors
    const light     = themeColors[t][2]
    const accent    = themeColors[t][3]
    const accent50  = averageColors(light, accent)
    const accent25  = averageColors(accent50, light)
    const accent75  = averageColors(accent50, accent)
    themeColors[t][4] = accent25
    themeColors[t][5] = accent50
    themeColors[t][6] = accent75
    updateLocalStorage(THEME_KEY, themeColors)
    return themeColors
}

function applyTheme(t) {
    let themeColors = retrieveFromLocalStorage(THEME_KEY)
    if (!themeColors) {
        themeColors = DEFAULT_THEME_COLORS.map(theme => [...theme])
        updateLocalStorage(THEME_KEY, themeColors)
    }
    themeColors = ensureMiddleColors(themeColors, t)
    const theme = themeColors[t]
    const root = document.documentElement
    root.style.setProperty('--dark',      theme[1])
    root.style.setProperty('--light',     theme[2])
    root.style.setProperty('--accent',    theme[3])
    root.style.setProperty('--accent-25', theme[4])
    root.style.setProperty('--accent-50', theme[5])
    root.style.setProperty('--accent-75', theme[6])
}

export function useTheme() {
    const prefsStore = usePreferencesStore()

    applyTheme(prefsStore.themeNumber)

    watch(() => prefsStore.themeNumber, (t) => applyTheme(t))
}
