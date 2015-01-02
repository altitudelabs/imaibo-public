// Hide Phase II features
var HIDE = false;
var IE8 = !!$('.lt-ie9').length;

$(function(){
  //  if(!IE8) { injectScript();}
  // Sets up routing logic for left content panel
  ContentView.init();

  // Gets data from API and plots graph
  ChartView.init();

  // Sets up routing logic for right content panel
  RightPanel.init();

  // Sets up sticky left and right columns
  $('#right-panel, #content').stick_in_parent({ recalc_every: 1 });

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

function injectScript(){
	var sources = ['//www.google-analytics.com/analytics.js',
				   'http://t3-www.imaibo.net/public/themes/Maibo/common_v1/js/combine.min.js?v=20141120001',
				   'http://t3-www.imaibo.net/public/front-modules/ueditor/1.3.5/lang/zh-cn/zh-cn.js',
				   'http://t3-www.imaibo.net/public/front-modules/ueditor/1.3.5/third-party/codemirror/codemirror.js']
	for(var i in sources){
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = sources[i];
		document.getElementsByTagName('head')[0].appendChild(script);
	}

}
