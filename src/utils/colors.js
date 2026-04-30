function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
    } : null
}

function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('')
}

export function averageColors(hex1, hex2) {
    const c1 = hexToRgb(hex1)
    const c2 = hexToRgb(hex2)
    if (!c1 || !c2) return hex1
    return rgbToHex((c1.r + c2.r) / 2, (c1.g + c2.g) / 2, (c1.b + c2.b) / 2)
}
