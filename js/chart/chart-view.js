var ChartView = {
  data: {
    daily: {},
    sentiment: {}
  },
  properties: {
    refreshFrequency: 60000,
    scrollDistance: 0
  },
  setProperties: function (options) {
    var self = this;
    //review
    var properties = {
      width: $('#content').width(), // width of left panel
      margin: { top: 8, right: 45, bottom: 25, left: 45 }, // chart margins
      volumeHeight: 50,
      zoomFactor: self.properties.zoomFactor || 1,
    };

    if (options) {
      for (var key in options) {
        properties[key] = options[key];
      }
    }
    this.properties = $.extend(true, this.properties, properties);
  },

  //data.daily.stockLine
  x: function(data, returnProp){
    var self = this;
    var props = self.properties;
    var graphWidth = (props.width - props.margin.left - props.margin.right)*props.zoomFactor;
    return d3.scale.ordinal()
    .domain(data.map(function(x) {
      return x[returnProp]; }))
    .rangeBands([0, graphWidth]); //inversed the x axis because api came in descending order
  },

  //data.daily.stockLine
  //return moodindex
  y1: function(data, height, returnProp){
    var self = this;
    var props = self.properties;

    return d3.scale.linear()
    .domain([d3.min(data.map(function(x) { return +x[returnProp]; })), d3.max(data.map(function(x){return +x[returnProp]; }))])
    .range([height-props.margin.bottom, props.margin.top])
  },
  //return lowpx, highpx
  y2: function(data, height, returnPropMax, returnPropMin){
    var self = this;
    var props = self.properties;

    return d3.scale.linear()
    .domain([d3.min(data.map(function(x) { return +x[returnPropMin]; })), d3.max(data.map(function(x){return +x[returnPropMax]; }))])
    .range([height-props.margin.bottom, props.margin.top]);
  },
  //return .volumn
  // range -> volumeHeight
  v: function(data, returnProp) {
    var self = this;
    var props = self.properties;

    return d3.scale.linear()
    .domain([0, d3.max(data.map(function(d){ return +d[returnProp];}))])
    .range([0, props.volumeHeight]);
  },
  /*
   * xInverse
   * =================
   * - gets the data based on cursor position
   * Arguments:
   * - xPos: Position of cursor
   * - x: x range, domain object of d3
   */
   xInverse: function(xPos, x){
    var leftEdges = x.range(), // starting position of each column bar
    width = x.rangeBand(), //rangeBand = width of each column bar
    j;

    //while mouse's x position is greater than the right most edge of the column
    //increment j

    //if mouse is in the first column, return 0
    //if mouse is in the last column,

    for (j = 0; xPos > (leftEdges[j] + width); j++) {}
      return j;
  },
  init: function(){
    // set up toolbar
    this.horizontalScroll();
    Toolbar.init();
    this.setProperties();
    var self = this;
    self.build();

    if(!IE8){ //app.js
      $(window).on('resize', function() {
        self.rebuild();
      });

      $('#chart-view').on('resize', function(){
        self.rebuild();
      });
    }
  },
  build: function(){
    var self = this;
    $('.loader').css('width', this.properties.width);
    self.buildChartElements(true);
    if(!PRODUCTION) {
      console.log('%c Developer Mode Enabled. ', 'background: #222; color: #bada55;  font-size: 4em;');
      console.log('%c 如看见这信息，请与我们的团队联络。If you see this message, please contact our technical team.', 'color: red;  font-size: 2em;');
    }

    StickyColumns.start();

    // potential problem: initially empty data, display empty chart.
    // fetches new data, not empty. what do

    if(!IE8){ //app.js
      setInterval(function(){
        self.buildChartElements(false);
      }, this.properties.refreshFrequency);
    }
  },
  tryRenderToolbar: function(hasError, data) {
    if(hasError){
      $('#toolbar').remove();
    }else{
      Toolbar.render(data);
    }
  },
  buildChartElements: function(initial) {
    var self  = this;
    var today = new Date();
    var year = today.getFullYear().toString();
    var month = (today.getMonth()+1).toString();
        month = month.length<2? '0' + month: month;
    var day = today.getDate().toString();
        day = day.length < 2? '0'+day:day;
        today = year + month + day;

    ChartModel.getIndexData(today, initial, function() {
      ChartModel.getSentimentData(today, initial, function(hasNewSentimentData){
        self.data = ChartModel.model;

        var stockLine = self.data.indexError? 0: self.data.daily.stockLine;
        // if (hasNewSentimentData) {
        if (initial) {
          SentimentChart.init();
          self.tryRenderToolbar(self.data.indexError, self.data.daily);
        } else {
          SentimentChart.update(hasNewSentimentData);
        }

        IndexChart.init();
        if(!HIDE) {
          RsiChart.init();
          MacdChart.init();
        }
        if(!self.data.indexError) Dashboard.render(self.data.info);

        // Refresh sticky columns and scroll position
        StickyColumns.start();
      });
    });
  },
  redraw: function (zoomFactor) {
    zoomFactor = zoomFactor || 1;
    this.properties.zoomFactor = this.properties.zoomFactor * zoomFactor < 1 ? 1 : this.properties.zoomFactor * zoomFactor;
    $('.zoomable-chart-container').css('width', '100%');
    if(!this.data.indexError){
      IndexChart.drawGraph(false);
      RsiChart.drawGraph(false);
      MacdChart.drawGraph(false);
    }
    $('#chart-container').scrollLeft(this.properties.scrollDistance);

  },
  rebuild: function() {
    this.setProperties();
    $('.zoomable-chart-container').css('width', '100%');
    IndexChart.init();
    RsiChart.init();
    MacdChart.init();
    SentimentChart.update();
    // this.redraw(true);
  },
  horizontalScroll: function () {
    'use strict';

    var self = this;

    var params = {
      scroller: '.scroller',
      bar: '.scroller__bar',
      barOnCls: 'baron',
      direction: 'h',
    };
    var scroll = baron(params);

    $('#price').hover(
      function() {
        $('.scroller__bar').stop().fadeTo('slow', 0.5);
      },
      function() {
        $('.scroller__bar').stop().fadeTo('slow', 0);
    });

    //should optimize should not
    // scrollDistance is stored to prevent bouncing back of zoomed chart during data update
    $('.scroller').on('mousewheel', function (event){
      event.preventDefault();
      var original = $('.scroller').scrollLeft();
      self.properties.scrollDistance = original;
      if (!event.originalEvent.deltaY)
        event.originalEvent.deltaY = -event.originalEvent.wheelDelta; // reverse scrolling direction for ie
      $('.scroller').scrollLeft(self.properties.scrollDistance - event.originalEvent.deltaY);
    });

    $('.scroller').on('DOMMouseScroll', function (event){
      event.preventDefault();
      var original = $('.scroller').scrollLeft();
      self.properties.scrollDistance = original;
      $('.scroller').scrollLeft(self.properties.scrollDistance - event.originalEvent.detail * 20);
    });
  },
};

