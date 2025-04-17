const squares = document.querySelector(".squares");
const yearLabel = document.querySelector("#year-label");
const form = document.querySelector("#year-form");
const months = document.querySelector(".months");

const YEAR = 365;
const MONTH = 12;
const WEEK = 7;

year = new Date().getFullYear();

if (form) {
    for (var i = 0; i < 10; i++) {
        const option = document.createElement("option");
        option.value = year-i;
        option.textContent = year-i;
        yearLabel.appendChild(option);
    }
}

updateYear(year);

/**
 * Function to update what year should be displayed
 * @param {*} year the year to display
 */
function updateYear(year) {
    // Reset
    squares.innerHTML = "";

    yearLabel.value = year;

    let days = YEAR;
    let isLeapYear = (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)); 
    if (isLeapYear) days += 1;

    const yearStart = new Date(`${year}-01-01T00:00:00`);
    const offset = yearStart.getDay();

    function formatDate(date) {
        return new Intl.DateTimeFormat('en-US', {
        month: 'short',   // e.g. Feb
        day: 'numeric',   // e.g. 14
        year: 'numeric',  // e.g. 2025
        }).format(date);
    }

    // Set grid layout dynamically
    const monthLengths = [];
    for (let month = 0; month < MONTH; month++) {
        const firstOfMonth = new Date(year, month, 1);
        const startDay = firstOfMonth.getDay();

        // Day 0 of next month = last day of current month
        const nextMonth = new Date(year, month + 1, 0); 
        const daysInMonth = nextMonth.getDate();

        const weeks = Math.floor((startDay + daysInMonth) / WEEK);
        monthLengths.push(weeks);
    }

    months.style.gridTemplateColumns = monthLengths.map(weeks => `calc(var(--week-width) * ${weeks})`).join(' ');

    let currentDate = new Date(yearStart);
    currentDate.setDate(currentDate.getDate() - offset);

    let remainingInCol = WEEK - (days+offset) % WEEK;
    if (remainingInCol == WEEK) remainingInCol = 0;

    for (var i = -offset; i < days + remainingInCol; i++) {
        let level = Math.floor(Math.random() * 3);  
        let date = currentDate.toISOString().split('T')[0];
        date = formatDate(currentDate);

        if (i < 0 || i >= days) {
            level = "empty";
        }

        let square = document.createElement("li");
        square.dataset.level = level;
        square.dataset.date = date;

        let commitInfo = "No activity on ";
        if (level !== "empty" && level > 0) {
            commitInfo = "Activity on ";
        }

        square.innerHTML = `<span class="tooltip">${commitInfo}${date}</span>`;

        squares.appendChild(square);

        // Go to next day
        currentDate.setDate(currentDate.getDate() + 1);
    }
}

yearLabel.addEventListener("change", (e) => {
    e.preventDefault();
    const data = e.target;
    updateYear(data.value);
});