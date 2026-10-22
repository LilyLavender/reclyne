/**
 * Scroll the window so that `el` sits a quarter of the way down the viewport.
 * @param {Element} el
 * @param {boolean} [smooth=false]
 */
export function scrollToEl(el, smooth = false) {
    const offset = el.getBoundingClientRect().top + window.scrollY - window.innerHeight / 4 + 3
    window.scrollTo({ top: offset, behavior: smooth ? 'smooth' : 'instant' })
}
