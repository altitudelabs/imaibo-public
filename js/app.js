// Toggles between staging (t3-www.imaibo.net) and production (www.imaibo.net)
var PRODUCTION = false;

// IE8 indicator
var IE8 = !!$('.lt-ie9').length;
var IE9 = !!$('.ie9').length;
var LteIE9 = IE8 || IE9;
Array.prototype.toString = function(d){
  return this.join(',');
};

// var _MID_ = 1;

$(function(){
  'use strict';

  // Start double scrolling capability
  DoubleScrollbars.start();

  // Sets up routing logic for left content panel
  ContentView.init();

  // Gets data from API and plots graph
  ChartView.init();

  // // Sets up routing logic for right content panel
  RightPanel.init();

  // Show contents only after DOM loads
  $('.outer').css('visibility', 'visible');
});
