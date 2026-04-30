export function updateLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data))
}

export function retrieveFromLocalStorage(key) {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
}

export function removeFromLocalStorage(key) {
    localStorage.removeItem(key)
}
