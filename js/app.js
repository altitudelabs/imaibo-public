var PRODUCTION = false;
// Hide Phase II features
var HIDE = false;
var IE8 = !!$('.lt-ie9').length;
// var _MID_ = 1;

$(function(){
  'use strict';

  // Sets up routing logic for left content panel
  ContentView.init();

  // Gets data from API and plots graph
  ChartView.init();

  // Sets up routing logic for right content panel
  RightPanel.init();

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
