const toolTipFadeDuration = 200;
const toolTipFadeTotal = 800;
const toolTipOpacity = '0.75';

var tooltipTimer;

$('.tooltip').mouseenter(function() {

    var tooltipText = $(this).find('.tooltiptext');
    tooltipTimer = setTimeout(function(){
        tooltipText.stop().animate({ opacity: toolTipOpacity }, toolTipFadeDuration);
    }, toolTipFadeTotal);

}).mouseleave(function() {

    clearTimeout(tooltipTimer);
    var tooltipText = $(this).find('.tooltiptext');
    tooltipText.stop().animate({ opacity: '0' }, toolTipFadeDuration);
    
});    