// Toggles between staging (t3-www.imaibo.net) and production (www.imaibo.net)
var PRODUCTION = false;

// IE8 indicator
var IE8 = !!$('.lt-ie9').length;
var IE9 = !!$('.ie9').length;
var LteIE9 = IE8 || IE9;

if (IE8) {
  //overriding console.log to an empty function on IE8 so it doesnt cause any issue
  var console = {};
  console.log = function (){};
}

var doc = document.documentElement;
doc.setAttribute('data-useragent', navigator.userAgent);
doc.setAttribute('data-platform', navigator.platform);

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
