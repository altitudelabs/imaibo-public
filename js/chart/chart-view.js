var ChartView = {
  data: {
    daily: {},
    sentiment: {}
  },
  properties: {
    refreshFrequency: 60000,
    scrollDistance: 0
  },
  earliestDate: 0,
  setLastIndexOnViewPort:function(index){
    //get scorllleft + chartWidth, use xInverse to get the stockLine index.
    var prevScrollLeft = $('.scroller').scrollLeft();
    var endOfViewPort = prevScrollLeft + this.getChartWidth();
    this.properties.lastIndexOnViewPort = index || this.xInverse(endOfViewPort, this.x(this.data.daily.stockLine, 'rdate'));
  },
  repositionIndexChart: function(){
    var scrollLeft = this.getLastIndexOnViewPort();
    var stockLine  = this.getStockLine();
    var rightMost  = this.x(stockLine, 'rdate')(stockLine[scrollLeft].rdate);
    var leftValue  = rightMost - this.getChartWidth();
    console.log(Math.floor(leftValue));

    $('.scroller').scrollLeft(Math.floor(leftValue));

    console.log($('.scroller').scrollLeft());

    return $('.scroller').scrollLeft();
  },
  setProperties: function (options) {
    var self = this;
    //review
    var properties = {
      width: $('#content').width(), // width of left panel
      margin: { top: 2, right: 45, bottom: 25, left: 45 }, // chart margins
      volumeHeight: 50,
      zoomFactor: self.properties.zoomFactor || 1,
    };
    properties.chartWidth = properties.width - properties.margin.right - properties.margin.left;
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
  getXLabels: function(){
    // if the data has not changed, return old. if there is new data, recalculate
    
    // if (this.data.xlabels) {
    //   return this.data.xlabels;
    // } else {
      var timeObjArray = {};
      this.data.xlabels = this.data.daily.stockLine.filter(function (e, i) {
        var date = new Date(e.timestamp*1000);
        var month = date.getMonth();
        var year = date.getYear();

        var yearsArray = Object.keys(timeObjArray);
        if (yearsArray === undefined || timeObjArray[year] === undefined) {
          timeObjArray[year] = [];
        }
        if (timeObjArray[year].indexOf(month) === -1) {
          timeObjArray[year].push(month);
          return true;
        }
        return false;
      });

      return this.data.xlabels;
    // }
  },
  //data.daily.stockLine
  //return moodindex
  y1: function(data, height, returnProp, volumeHeight){
    var min = d3.min(data.map(function(x) { return +x[returnProp]; }));
    var max = d3.max(data.map(function(x) { return +x[returnProp]; }));

    min = min - ((max-min)/height)*volumeHeight;

    return this.buildY(min, max, height);
  },
  //return lowpx, highpx
  y2: function(data, height, returnPropMax, returnPropMin, volumeHeight){
    var min = d3.min(data.map(function(x) { return +x[returnPropMin]; }));
    var max = d3.max(data.map(function(x) { return +x[returnPropMax]; }));

    min = min - ((max-min)/height)*volumeHeight;

    return this.buildY(min, max, height);
  },
  buildY: function(min, max, height) {
    var props = this.properties;

    return d3.scale.linear()
    .domain([min, max])
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
    this.initInfoButtons();
    this.setProperties();
    var self = this;
    self.build();

    var resizeEnd;
    if(!IE8){ //app.js
      $(window).on('resize', function() {
        clearTimeout(resizeEnd);
        resizeEnd = setTimeout(function() {
          self.rebuild();
        }, 500);
      });

      $('#chart-view').on('resize', function(){
        clearTimeout(resizeEnd);
        resizeEnd = setTimeout(function() {
          self.rebuild();
        }, 500);
      });
    }
  },
  initInfoButtons: function(){
    $('#index-info-button').leanModal({ closeButton: '.modal-close', modalId: '#index-info-modal' });
    $('#sentiment-info-button').leanModal({ closeButton: '.modal-close', modalId: '#sentiment-info-modal' });
  },
  build: function(){
    var self = this;
    $('.loader').css('width', this.properties.width);
    self.buildChartElements();


    if(!IE8) {
      setInterval(self.updateChartElements, this.properties.refreshFrequency);
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
      
      try { SentimentChart.init(); } catch (error) { SentimentChart.initWithError(); }

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
  updateChartElements: function() {
    var self = this,
        d = new Date(),
        today = d.yyyymmdd();

    $.when(ChartModel.getIndexDataAsync(today, false), ChartModel.updateSentimentDataAsync(today))
    .done(function(index, sentiment){

      self.data = ChartModel.model;


      // Update index
      if (!index.isError) {
        IndexChart.update(false);
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
        // SentimentChart.setProperties();
        SentimentChart.update();
      } else {
        SentimentChart.initWithError();
      }

      // Refresh sticky columns and scroll position
      StickyColumns.start();
    });
  },
  updateIndexChartElements: function() {
    $.when(ChartModel.getIndexDataAsync(today, false))
      .done(function(index){
      });
  },
  calcZoom: function(zoomFactor) {
    zoomFactor = zoomFactor || 1;
    this.properties.zoomFactor = this.properties.zoomFactor * zoomFactor < 1 ? 1 : this.properties.zoomFactor * zoomFactor;

    //make our zoom level dependent on the length of data.
    var zoomRatio = this.data.daily.stockLine.length /100;
    if(this.properties.zoomFactor > zoomRatio) {
      this.properties.zoomFactor = zoomRatio;
    }
  },
  redraw: function (zoomFactor) {
    ChartView.calcZoom(zoomFactor);
    // if(zoomFactor === 1) return;
    $('.zoomable-chart-container').css('width', '100%');
    IndexChart.update();
    RsiChart.drawGraph();
    MacdChart.drawGraph();
    this.repositionIndexChart();
  },
  rebuild: function() {
    this.setProperties();
    $('.zoomable-chart-container').css('width', '100%');
    RsiChart.init();
    MacdChart.init();
    IndexChart.update();
    SentimentChart.update();
    SentimentChart.update();
    this.repositionIndexChart();
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
      var val = self.properties.scrollDistance - event.originalEvent.deltaY;
      var diff = (event.originalEvent.deltaY > 0? Math.ceil(val):Math.floor(val));
      $('.scroller').scrollLeft(diff);

      ChartView.leftValue = $('.scroller').scrollLeft();
      self.setLastIndexOnViewPort();
    });

    $('.scroller').on('DOMMouseScroll', function (event){
      event.preventDefault();
      var original = $('.scroller').scrollLeft();
      self.properties.scrollDistance = original;
      $('.scroller').scrollLeft(self.properties.scrollDistance - event.originalEvent.detail * 20);
      self.setLastIndexOnViewPort();
    });
  },
  // ============= PUBLIC GETTERS/SETTERS ======================
  getLastIndexOnViewPort: function() {
    return this.properties.lastIndexOnViewPort;
  },
  getStockLine: function() {
    return this.data.daily.stockLine;
  },
  setChartWidth: function(chartWidth) {
    this.properties.chartWidth = chartWidth;
  },
  getChartWidth: function() {
    return this.properties.chartWidth;
  },
  getContainerWidth: function() {
    return this.properties.width;
  },
  getMargin: function() {
    return this.properties.margin;
  },
  getLeftMargin: function() {
    return this.properties.margin.left;
  },
  getRightMargin: function() {
    return this.properties.margin.right;
  },
  getTopMargin: function() {
    return this.properties.margin.top;
  },
  getBottomMargin: function() {
    return this.properties.margin.bottom;
  },
  getZoomFactor: function() {
    return this.properties.zoomFactor;
  },
  getGraphWidth: function() {
    return this.getChartWidth() * this.getZoomFactor();
  },
  getVolumeHeight: function() {
    return this.properties.volumeHeight;
  },
};

