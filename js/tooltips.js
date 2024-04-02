var tooltipTimer;

$('.tooltip').mouseenter(function() {

    var tooltipText = $(this).find('.tooltiptext');
    tooltipTimer = setTimeout(function(){
        tooltipText.stop().animate({ opacity: '0.75' }, 200);
    }, 800);

}).mouseleave(function() {

    clearTimeout(tooltipTimer);
    var tooltipText = $(this).find('.tooltiptext');
    tooltipText.stop().animate({ opacity: '0' }, 200);
    
});    