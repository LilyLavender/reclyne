// Elements
const doc = $(document);
const overlay = $('.overlay');
const calendarDisplay = $('.calendar-display');
// Data Arrays
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
const ALL_COLUMNS = 2;
const MONTH_FIRST = 3;
const THEME_NUMBER = 4;
// Current Year String
let currentYear = "";