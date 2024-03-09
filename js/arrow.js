// Add arrow to correct row
function addArrow() {
    const currDate = new Date();
    const currDay = currDate.getDate();
    const currMonth = currDate.toLocaleString('en-US', { month: 'short' });
    const rows = document.querySelectorAll('.day');
    rows.forEach(row => {
        if (row.textContent == `${currMonth} ${currDay}`) {
            const arrowContainer = document.createElement('div');
            arrowContainer.className = 'arrow-container';
            row.appendChild(arrowContainer);
            row.closest('tr').classList.add('current-day');
        }
    });
}