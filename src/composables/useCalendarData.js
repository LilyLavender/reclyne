import { retrieveFromLocalStorage, updateLocalStorage, removeFromLocalStorage } from './useLocalStorage'

export function getMonthData(monthShort, year) {
    return retrieveFromLocalStorage(`${monthShort}-${year}`)
}

export function saveMonthData(monthShort, year, rda) {
    const isEmpty = rda.slice(2).every(arr => !arr.length)
    if (!isEmpty) {
        updateLocalStorage(`${monthShort}-${year}`, rda)
    } else {
        removeFromLocalStorage(`${monthShort}-${year}`)
    }
}
