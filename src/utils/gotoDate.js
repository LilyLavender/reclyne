import { monthsShort, allMonthsNames } from './dates.js'

export function dateIsExist(monthShort3, day, year) {
    const monthIdx = monthsShort.indexOf(monthShort3.toLowerCase())
    if (monthIdx === -1) return false
    const d = new Date(parseInt(year), monthIdx, parseInt(day))
    return d.getFullYear() === parseInt(year) && d.getMonth() === monthIdx && d.getDate() === parseInt(day)
}

export function getPrettyDate(date, isMonth, isDay) {
    const suffixes = ['st', 'nd', 'rd', 'th']
    const day = date.getDate()
    const suffix = (day >= 11 && day <= 13) ? 'th' : (suffixes[(day - 1) % 10] || 'th')
    const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"]
    let ret = ''
    if (isMonth) ret += monthNames[date.getMonth()] + ' '
    if (isDay) ret += day + suffix + ', '
    ret += date.getFullYear()
    return ret
}

function monthIdxFromName(name) {
    return monthsShort.indexOf(name.substring(0, 3).toLowerCase())
}

export function getGotoDate(input, currentYear, monthFirst) {
    if (!input) return [false, false, false]

    const delimiterIndices = [...input.matchAll(/[\s\-/.,]/g)].map(m => m.index)

    if (delimiterIndices.length === 0) {
        // Month by name: "jan", "february", "MARCH"
        const foundByName = allMonthsNames.find(n => input.toLowerCase() === n)
        if (foundByName) {
            const monthIdx = monthIdxFromName(foundByName)
            return [new Date(currentYear, monthIdx, 1), true, false]
        }

        // Month by number: "3", "11"
        if (/^(0?[1-9]|[1][0-2])$/.test(input))
            return [new Date(currentYear, parseInt(input) - 1, 1), true, false]

        // Year only: "2024"
        if (/^\d{4}$/.test(input) && parseInt(input) > 99)
            return [new Date(parseInt(input), 0, 1), false, false]

        // Compact month+day: "jan23", "apr06"
        const im = input.substring(0, 3)
        const id = input.substring(3)
        const found4 = allMonthsNames.find(n => im.toLowerCase() === n.substring(0, 3) && /^(0?[1-9]|[12][0-9]|3[01])$/.test(id))
        if (found4 && dateIsExist(im, id, currentYear)) {
            const monthIdx = monthIdxFromName(im)
            return [new Date(currentYear, monthIdx, parseInt(id)), true, true]
        }

    } else if (delimiterIndices.length === 1) {
        let p1 = input.substring(0, delimiterIndices[0])
        let p2 = input.substring(delimiterIndices[0] + 1)

        // Month name + day: "jan 23", "April 6"
        const found5 = allMonthsNames.find(n => p1.toLowerCase() === n && /^(0?[1-9]|[12][0-9]|3[01])$/.test(p2))
        if (found5 && dateIsExist(p1.substring(0, 3), p2, currentYear)) {
            const monthIdx = monthIdxFromName(p1)
            return [new Date(currentYear, monthIdx, parseInt(p2)), true, true]
        }

        // Month name + year: "jan 2024", "March 2025"
        const found6 = allMonthsNames.find(n => p1.toLowerCase() === n && /^\d{4}$/.test(p2))
        if (found6) {
            const monthIdx = monthIdxFromName(p1)
            return [new Date(parseInt(p2), monthIdx, 1), true, false]
        }

        // Numeric month + year: "04 2026", "12 2028"
        if (/^(0?[1-9]|[1][0-2])$/.test(p1) && /^\d{4}$/.test(p2) && parseInt(p1) <= 12)
            return [new Date(parseInt(p2), parseInt(p1) - 1, 1), true, false]

        // Numeric month + day (locale): "1 23", "4 06"
        let m = p1, d = p2
        if (!monthFirst) [m, d] = [d, m]
        if (/^(0?[1-9]|[1][0-2])$/.test(m) && /^(0?[1-9]|[12][0-9]|3[01])$/.test(d) &&
            dateIsExist(monthsShort[parseInt(m) - 1], d, currentYear))
            return [new Date(currentYear, parseInt(m) - 1, parseInt(d)), true, true]

    } else if (delimiterIndices.length === 2) {
        let p1 = input.substring(0, delimiterIndices[0])
        let p2 = input.substring(delimiterIndices[0] + 1, delimiterIndices[1])
        let p3 = input.substring(delimiterIndices[1] + 1)

        // Month name + day + year: "apr 08 2024", "October 5 2025"
        const found9 = allMonthsNames.find(n =>
            p1.toLowerCase() === n && /^(0?[1-9]|[12][0-9]|3[01])$/.test(p2) && /^\d{4}$/.test(p3))
        if (found9 && dateIsExist(p1.substring(0, 3), p2, p3)) {
            const monthIdx = monthIdxFromName(p1)
            return [new Date(parseInt(p3), monthIdx, parseInt(p2)), true, true]
        }

        // Numeric month + day + year (locale): "11 11 2026", "06 03 2027"
        let m = p1, d = p2
        if (!monthFirst) [m, d] = [d, m]
        if (/^(0?[1-9]|[1][0-2])$/.test(m) && /^(0?[1-9]|[12][0-9]|3[01])$/.test(d) && /^\d{4}$/.test(p3) &&
            dateIsExist(monthsShort[parseInt(m) - 1], d, p3))
            return [new Date(parseInt(p3), parseInt(m) - 1, parseInt(d)), true, true]
    }

    return [false, false, false]
}
