// For debug use only
function clearReclyneData() {
    let keys = Object.keys(localStorage);
    let i = keys.length;
    while (i--) {
        if (/^[a-z]{3}-\d{4}$/.test(keys[i].toString())
        || keys[i].includes("reclyne")) {
            removeFromLocalStorage(keys[i]);
        }
    }
}