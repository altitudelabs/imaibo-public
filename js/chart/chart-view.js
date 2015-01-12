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
    self.buildChartElements();

    if(!IE8){ //app.js
      setInterval(function(){
        self.updateChartElements();
      }, this.properties.refreshFrequency);
    }
  },
  /* Initial build of chart elements */
  buildChartElements: function() {
    var self = this,
        d = new Date(),
        today = d.yyyymmdd(),
        initial = true;

    $.when(ChartModel.getIndexDataAsync(today, initial), ChartModel.getSentimentDataAsync())
    .done(function(index, sentiment){
      self.data = ChartModel.model;

      // Draw index
      if (!index.isError) {
        IndexChart.init();
        Toolbar.render(self.data.daily);
        if(!HIDE) {
          RsiChart.init();
          MacdChart.init();
        }
        Dashboard.render(self.data.info);
      } else {
        Dashboard.renderWithError();
        IndexChart.initWithError();
      }

      // Draw sentiment
      if (!sentiment.isError) {
        SentimentChart.init();
      } else {
        SentimentChart.initWithError();
      }

      // Make charts visible
      $('#price').css('visibility', 'visible');
      $('#macd').css('visibility', 'visible');
      $('#rsi').css('visibility', 'visible');
      $('#sentiment').css('visibility', 'visible');

      // Remove loaders
      $('.loader').remove();
      $('.dashboard-loader').remove();

      // Refresh sticky columns and scroll position
      StickyColumns.start();
    });
  },
  /* Updates chart elements */
  updateChartElements: function(){
    var self = this,
        d = new Date(),
        today = d.yyyymmdd();

    $.when(ChartModel.getIndexDataAsync(today, false), ChartModel.updateSentimentDataAsync(today))
    .done(function(index, sentiment){
      self.data = ChartModel.model;

      // Update index
      if (!index.isError) {
        IndexChart.init();
        if(!HIDE) {
          RsiChart.init();
          MacdChart.init();
        }
        Dashboard.render(self.data.info);
      } else {
        Dashboard.renderWithError();
        IndexChart.initWithError();
      }

      // Draw sentiment
      if (!sentiment.isError) {
        SentimentChart.update(true);
      } else {
        SentimentChart.initWithError();
      }

      // Refresh sticky columns and scroll position
      StickyColumns.start();
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
        $('#chart-container .scroller__bar').stop().fadeTo('slow', 0.5);
      },
      function() {
        $('#chart-container .scroller__bar').stop().fadeTo('slow', 0);
    });

    $('#rsi-chart').hover(
      function() {
        $('#rsi-chart-container .scroller__bar').stop().fadeTo('slow', 0.5);
      },
      function() {
        $('#rsi-chart-container .scroller__bar').stop().fadeTo('slow', 0);
    });

    $('#macd-chart').hover(
      function() {
        $('#macd-chart-container .scroller__bar').stop().fadeTo('slow', 0.5);
      },
      function() {
        $('#macd-chart-container .scroller__bar').stop().fadeTo('slow', 0);
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

