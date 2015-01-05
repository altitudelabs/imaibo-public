var PRODUCTION = false;
// Hide Phase II features
var HIDE = true;
var IE8 = !!$('.lt-ie9').length;

$(function(){
  'use strict';
  // Sets up routing logic for left content panel
  ContentView.init();

  // Gets data from API and plots graph
  ChartView.init();

  // Sets up routing logic for right content panel
  RightPanel.init();

  // Sets up sticky left and right columns
  $('#right-panel, #content').stick_in_parent();
  setInterval(function() {
    $('#right-panel, #content').trigger('sticky_kit:recalc');
    $('.container').scrollLeft(ChartView.properties.scrollDistance);
  }, 1000);

  // Hides certain features
  if(HIDE){
    $('#frequency').remove();
    $('#rsi-icon').remove();
    $('.link-stockpicker-view').remove();
    $('.link-news-view').remove();
    $('.vertical-collapse').remove();
    $('.vertical-uncollapse').remove();
  }

  // Show contents only after DOM loads
  $('.outer').css('visibility', 'visible');
});

