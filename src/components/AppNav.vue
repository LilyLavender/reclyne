<template>
  <nav>
    <div class="left-icons">
      <a class="logostyle">reclyne</a>
    </div>
    <div class="middle-icons">
      <div class="year-select">
        <button id="prev-date-box" class="tooltip">&lt;<div class="tooltiptext">Go back one year</div></button><p id="output-date">Year</p><button id="next-date-box" class="tooltip">&gt;<div class="tooltiptext">Go forward one year</div></button>
      </div>
      <i class="bi bi-floppy tooltip" id="save-button"><div class="tooltiptext">Save</div></i>
      <i class="bi bi-arrow-right-circle tooltip" id="autoscroll-button"><div class="tooltiptext">If you see this text, this is a bug.</div></i>
      <i class="bi bi-calendar2-check tooltip" id="elapsed-months-button"><div class="tooltiptext">If you see this text, this is a bug.</div></i>
      <i class="bi bi-pen tooltip" id="all-columns-button"><div class="tooltiptext">If you see this text, this is a bug.</div></i>
      <i class="bi bi-box-arrow-in-down tooltip" id="import-data-button"><div class="tooltiptext">Import data<div class="tooltipextra">• Double-click to quick import</div></div></i>
      <i class="bi bi-box-arrow-down tooltip" id="export-data-button"><div class="tooltiptext">Export data<div class="tooltipextra">• Double-click to quick export</div></div></i>
    </div>
    <div class="right-icons">
      <div id="about-button-cont" class="tooltip">
        <a class="logostyle" id="about-button">About</a>
        <div class="tooltiptext">Credits &amp; Shortcuts</div>
      </div>
    </div>
  </nav>
</template>
