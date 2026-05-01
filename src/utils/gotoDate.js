import { monthsShort, monthsLongUpper, allMonthsNames } from './dates.js'

export function dateIsExist(date, year) {
    const formattedDate = date.toLowerCase().replace(' 0', ' ')
    const dateObj = new Date(`${year} ${date}`)
    const formattedDateObj = `${monthsShort[dateObj.getMonth()]} ${dateObj.getDate()}`
    return formattedDate === formattedDateObj
}

export function getPrettyDate(date, isMonth, isDay) {
    const suffixes = ['st', 'nd', 'rd', 'th']
    const day = date.getDate()
    const suffix = (day >= 11 && day <= 13) ? 'th' : (suffixes[(day - 1) % 10] || 'th')
    let ret = ''
    if (isMonth) ret += monthsLongUpper[date.getMonth()] + ' '
    if (isDay) ret += day + suffix + ', '
    ret += date.getFullYear()
    return ret
}

export function getGotoDate(input, currentYear, monthFirst) {
    if (!input) return [false, false, false]

    const delimiterIndices = [...input.matchAll(/[\s\-/.,]/g)].map(m => m.index)

    if (delimiterIndices.length === 0) {
        const foundByName = allMonthsNames.find(n => input.toLowerCase() === n)
        if (foundByName) return [new Date(`${currentYear} ${foundByName}`), true, false]

        if (/^(0?[1-9]|[1][0-2])$/.test(input))
            return [new Date(`${currentYear} ${input}`), true, false]

        if (/^\d{4}$/.test(input) && parseInt(input) > 99)
            return [new Date(`${input} 1 1`), false, false]

        const im = input.substring(0, 3)
        const id = input.substring(3)
        const found4 = allMonthsNames.find(n => im.toLowerCase() === n && /^(0?[1-9]|[12][0-9]|3[01])$/.test(id))
        if (found4 && dateIsExist(`${im} ${id}`, currentYear))
            return [new Date(`${currentYear} ${im} ${id}`), true, true]

    } else if (delimiterIndices.length === 1) {
        let p1 = input.substring(0, delimiterIndices[0])
        let p2 = input.substring(delimiterIndices[0] + 1)

        const found5 = allMonthsNames.find(n => p1.toLowerCase() === n && /^(0?[1-9]|[12][0-9]|3[01])$/.test(p2))
        if (found5 && dateIsExist(`${p1.substring(0, 3)} ${p2}`, currentYear))
            return [new Date(`${currentYear} ${p1} ${p2}`), true, true]

        const found6 = allMonthsNames.find(n => p1.toLowerCase() === n && /^\d{4}$/.test(p2))
        if (found6) return [new Date(`${p2} ${p1} 1`), true, false]

        if (/^0?[1-9]|[1][0-2]$/.test(p1) && /^\d{4}$/.test(p2) && parseInt(p1) <= 12)
            return [new Date(`${p2} ${p1} 1`), true, false]

        if (!monthFirst) [p1, p2] = [p2, p1]
        if (/^0?[1-9]|[1][0-2]$/.test(p1) && /^0?[1-9]|[12][0-9]|3[01]$/.test(p2) &&
            dateIsExist(`${monthsShort[parseInt(p1) - 1]} ${p2}`, currentYear))
            return [new Date(`${currentYear} ${p1} ${p2}`), true, true]

    } else if (delimiterIndices.length === 2) {
        let p1 = input.substring(0, delimiterIndices[0])
        let p2 = input.substring(delimiterIndices[0] + 1, delimiterIndices[1])
        let p3 = input.substring(delimiterIndices[1] + 1)

        const found9 = allMonthsNames.find(n =>
            p1.toLowerCase() === n && /^(0?[1-9]|[12][0-9]|3[01])$/.test(p2) && /^\d{4}$/.test(p3))
        if (found9 && dateIsExist(`${p1.substring(0, 3)} ${p2}`, p3))
            return [new Date(`${p3} ${p1} ${p2}`), true, true]

        if (!monthFirst) [p1, p2] = [p2, p1]
        if (/^0?[1-9]|[1][0-2]$/.test(p1) && /^0?[1-9]|[12][0-9]|3[01]$/.test(p2) && /^\d{4}$/.test(p3) &&
            dateIsExist(`${monthsShort[parseInt(p1) - 1]} ${p2}`, p3))
            return [new Date(`${p3} ${p1} ${p2}`), true, true]
    }

    return [false, false, false]
}
