// Elements
const outputDate = $('#outputDate');
const gotobox = $('#gotobox');
const gotosyntaxbox = $('#gotosyntaxbox');
const gotoinput = $('#gotoinput');
const gotopreview = $('#gotopreview');
const gotopreviewhelper = $('#gotopreviewhelper');
const exportbox = $('#exportdatabox'); //todo move specific consts to their respective files
const importbox = $('#importdatabox');
const overlay = $('.overlay');
const dateFormatArrow = $('#dateFormatArrow');
const dateFormatLeft = $('p:has(+ #dateFormatArrow)');
const dateFormatRight = $('#dateFormatArrow + p');
// Data Arrays
const buttonData = [
    ['#elapsedMonthsButton', 'bi-calendar2-check', 'bi-calendar2-check-fill', 'Show elapsed months', 'Hide elapsed months'], // hide-elapsed
    ['#autoscrollButton', 'bi-arrow-right-circle', 'bi-arrow-right-circle-fill', 'Do not automatically scroll to today', 'Automatically scroll to today'], // autoscroll-to-arrow
    false // month-first
];
const weekdaysLong = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const weekdaysShort = ["sun","mon","tue","wed","thu","fri","sat"];
const monthsLong = ["january","february","march","april","may","june","july","august","september","october","november","december"];
const monthsLongUpper = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const monthsShort = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
const monthsShortUpper = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const allMonthsNames = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec","january","february","march","april","june","july","august","september","october","november","december"];
// Consts
const HIDE_ELAPSED = 0;
const AUTOSCROLL_TO_ARROW = 1;
const MONTH_FIRST = 2;
// Current Year String
let currentYear = "";