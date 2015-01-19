var ChartView = {
  data: {
    daily: {},
    sentiment: {},
    error: {}
  },
  properties: {
    refreshFrequency: 6000000,
    scrollSpeed: 2,
    scrollbarPos: 0,
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
  //data.visibleStockLine
  x: function(returnProp){
    var self = this;
    var props = self.properties;

    return d3.scale.ordinal()
    .domain(ChartView.getVisibleStockLine().map(function(x) {
      return x[returnProp]; }))
    .rangeBands([0, props.chartWidth]); //inversed the x axis because api came in descending order
  },
  // getXLabels: function(startI){
  getXLabels: function(){
    // if the data has not changed, return old. if there is new recalculate
    
    // if (this.data.xlabels) {
    //   return this.data.xlabels;
    // } else {
      var timeObjArray = {};
      this.data.xlabels = ChartView.getVisibleStockLine().filter(function (e, i) {
        // if (startI && i<startI) { return false; }
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
  y1: function(height, returnProp, volumeHeight){
    var self = this;
    var min = d3.min(ChartView.getVisibleStockLine().map(function(x) { return +x[returnProp]; }));
    var max = d3.max(ChartView.getVisibleStockLine().map(function(x) { return +x[returnProp]; }));

    min = min - ((max-min)/height)*volumeHeight;
    max = max + ((max - min)*0.1)
    return this.buildY(min, max, height);
  },
  //return lowpx, highpx
  y2: function(height, returnPropMax, returnPropMin, volumeHeight){
    var self = this;
    var min = d3.min(ChartView.getVisibleStockLine().map(function(x) { return +x[returnPropMin]; }));
    var max = d3.max(ChartView.getVisibleStockLine().map(function(x) { return +x[returnPropMax]; }));

    min = min - ((max-min)/height)*volumeHeight;
    max = max + ((max - min)*0.1)
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
  v: function(returnProp) {
    var self = this;
    var props = self.properties;

    return d3.scale.linear()
    .domain([0, d3.max(ChartView.getVisibleStockLine().map(function(d){ return +d[returnProp];}))])
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
    // this.horizontalScroll();
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
    
    self.getData(true, function () {
      self.buildChartElements();
      if(!IE8) {
        setInterval(function () {
          self.getData(false, function () {
            self.updateChartElements();
          });
        }, self.properties.refreshFrequency);
      }
    });
  },
  getData: function (initial, cb) {
    var self = this,
           d = new Date(),
           today = d.yyyymmdd();
    $.when(ChartModel.getIndexDataAsync(today, initial), ChartModel.getSentimentDataAsync())
    .done(function(index, sentiment){
      
      self.updateData(index, sentiment);
      // self.setLastIndexOnViewPort();
      cb();
    });
  },
  getPastData: function () {
    var self = this;
    var earliestDate = self.data.daily.stockLine[0].rdate;
    ChartModel.getIndexData(earliestDate-1, false, null, true, function () {
      self.updateData();
      self.redraw();
      var leftIndex = ChartModel.model.stockLineLengthDiff + ChartView.getLastIndexOnViewPort() - 10;
    });
  },
  updateData: function (indexError, sentimentError) {
    var self = this;
    self.data = ChartModel.model;
    self.data.error = {
      index: indexError,
      sentiment: sentimentError
    };
    self.data.lastDataIndex = self.data.lastDataIndex || self.data.daily.stockLine.length;
    self.data.dataSetLength = self.data.dataSetLength || self.data.daily.stockLine.length;
    self.data.visibleStockLine = self.data.daily.stockLine.slice(self.data.lastDataIndex - self.data.dataSetLength, self.data.lastDataIndex);
  },
  /* Initial build of chart elements */
  buildChartElements: function() {
    var self = this;
    // Draw index
    if (!self.data.error.index.isError) {
      IndexChart.init();
      Toolbar.render(self.data.daily);
      if(!HIDE) {
        RsiChart.init();
        MacdChart.init();
      }
      ChartView.setScrollbarWidth();
      Dashboard.render(self.data.info);
    } else {
      Dashboard.renderWithError();
      IndexChart.initWithError();
    }
    // Draw sentiment
    if (!self.data.error.sentiment.isError) {
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
  },
  /* Updates chart elements */
  updateChartElements: function() {
    var self = this;
    // Update index
    if (!self.data.indexError) {
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
    if (!self.data.sentimentError) {
      // SentimentChart.setProperties();
      SentimentChart.update();
    } else {
      SentimentChart.initWithError();
    }
    // Refresh sticky columns and scroll position
    StickyColumns.start();
  },
  zoom: function (zoomFactor) {
    var self = this;
    // ChartView.calcZoom(zoomFactor);
    var newLength = Math.floor(self.data.dataSetLength / zoomFactor);
    if (newLength < 20) { return; }
    if (newLength > 250) { return; }
    if (newLength > self.data.daily.stockLine.length) { 
      newLength = self.data.daily.stockLine.length;
    }
    if (ChartView.getLastDataIndex() - newLength < 0) {
      var index = ChartView.getLastDataIndex() - (ChartView.getLastDataIndex() - newLength);
      ChartView.setLastDataIndex(index);
    }
    ChartView.setDataSetLength(newLength);
    // ChartView.updateVisibleStockLine();
    // ChartView.setScrollbarWidth();
    ChartView.redraw();

    if(ChartView.isZoomed()){
       IndexChart.components.scrollBar.style('fill-opacity', 50);
    }else{
       IndexChart.components.scrollBar.transition().duration(1000).style('fill-opacity', 0);
    }
    self.data.dataSetLength = newLength;
    self.redraw();
  },
  zoomBehavior: function() {
    return d3.behavior.zoom()
                    .on("zoom", function(){
                      var deltaY = d3.event.sourceEvent.deltaY;
                      if(deltaY > 0){
                        ChartView.moveToLeft();
                      }else if(deltaY < 0){
                        ChartView.moveToRight();
                      }
                    });
  },
  moveToRight: function () {
    var self = this;
    var speed = Math.ceil(self.data.visibleStockLine.length * 0.075);
    if(self.data.lastDataIndex + speed > self.data.daily.stockLine.length) { return ;}
    self.data.lastDataIndex+=speed;
    self.data.visibleStockLine = self.data.daily.stockLine.slice(self.data.lastDataIndex - self.data.dataSetLength, self.data.lastDataIndex);
    self.redraw();
  }, 
  moveToLeft: function () {
    var self = this;
    var speed = Math.ceil(self.data.visibleStockLine.length * 0.075);
    if(self.data.lastDataIndex  - self.data.visibleStockLine.length - speed < 0) { return ;}
    self.data.lastDataIndex-=speed;
    self.data.visibleStockLine = self.data.daily.stockLine.slice(self.data.lastDataIndex - self.data.dataSetLength, self.data.lastDataIndex);
    self.redraw();
  },
  redraw: function () {
    ChartView.updateVisibleStockLine();
    $('.zoomable-chart-container').css('width', '100%');
    ChartView.setScrollbarWidth();
    // var prev = ChartView.getScrollbarPos();
    // var pos = ChartView.getChartWidth() - ChartView.getScrollbarWidth() - prev;
    // console.log(prev);
    // ChartView.setScrollbarPos(pos);
    // IndexChart.pseudoX = ChartView.getChartWidth() - ChartView.getScrollbarWidth();
    IndexChart.update();

    RsiChart.update();
    MacdChart.update();
  },
  rebuild: function() {
    ChartView.setProperties();
    $('.zoomable-chart-container').css('width', '100%');
    RsiChart.init();
    MacdChart.init();
    IndexChart.update();
    SentimentChart.update();
    SentimentChart.update();
  },
  // horizontalScroll: function () {
  //   'use strict';

  //   var self = this;

  //   var params = {
  //     scroller: '.scroller',
  //     bar: '.scroller__bar',
  //     barOnCls: 'baron',
  //     direction: 'h',
  //   };
  //   var scroll = baron(params);

  //   $('#price').hover(
  //     function() {
  //       $('#chart-container .scroller__bar').stop().fadeTo('slow', 0.5);
  //     },
  //     function() {
  //       $('#chart-container .scroller__bar').stop().fadeTo('slow', 0);
  //   });

  //   $('#rsi-chart').hover(
  //     function() {
  //       $('#rsi-chart-container .scroller__bar').stop().fadeTo('slow', 0.5);
  //     },
  //     function() {
  //       $('#rsi-chart-container .scroller__bar').stop().fadeTo('slow', 0);
  //   });

  //   $('#macd-chart').hover(
  //     function() {
  //       $('#macd-chart-container .scroller__bar').stop().fadeTo('slow', 0.5);
  //     },
  //     function() {
  //       $('#macd-chart-container .scroller__bar').stop().fadeTo('slow', 0);
  //   });

  //   //should optimize should not
  //   // scrollDistance is stored to prevent bouncing back of zoomed chart during data update
  //   $('.scroller').on('mousewheel', function (event){
  //     event.preventDefault();
  //     var original = $('.scroller').scrollLeft();
  //     self.properties.scrollDistance = original;
  //     if (!event.originalEvent.deltaY)
  //       event.originalEvent.deltaY = -event.originalEvent.wheelDelta; // reverse scrolling direction for ie
  //     var val = self.properties.scrollDistance - event.originalEvent.deltaY;
  //     var diff = (event.originalEvent.deltaY > 0? Math.ceil(val):Math.floor(val));
  //     $('.scroller').scrollLeft(diff);

  //     if (event.originalEvent.deltaY > 0 ) {
  //       self.moveToRight();
  //     } else if (event.originalEvent.deltaY < 0) {
  //       self.moveToLeft();
  //     }

  //     ChartView.leftValue = $('.scroller').scrollLeft();
  //     // self.setLastIndexOnViewPort();
  //   });

  //   $('.scroller').on('DOMMouseScroll', function (event){
  //     event.preventDefault();
  //     var original = $('.scroller').scrollLeft();
  //     self.properties.scrollDistance = original;
  //     $('.scroller').scrollLeft(self.properties.scrollDistance - event.originalEvent.detail * 20);
  //     // self.setLastIndexOnViewPort();
  //   });
  // },
  // scrollbarAnimation: function(){
  //   $('.scroll-bar, .scroller').on('mouseenter', function(){
  //     $('.handle').fadeIn(500);
  //   });
  //   $('.scroll-bar, .scroller').on('mouseout', function(){
  //     $('.handle').hide();
  //   });
  // },
  // updateScrollbar: function(){
  //   var ratio  = ChartView.data.visibleStockLine.length/ChartView.data.daily.stockLine.length;
  //   var length = ratio * ChartView.getChartWidth();
  //   var diff   = ChartView.data.lastDataIndex - ChartView.data.dataSetLength;
  //   var leftRatio = diff/ChartView.data.daily.stockLine.length;
  //   var left = leftRatio * ChartView.getChartWidth();
  //   $('.handle').css('width', length + 'px');
  //   $('.handle').css('left', left + 'px');
  // },
  // dragScrollbar: function() {
  //   var props = this.properties;
  //   $('.handle').on('mousedown', function(event) {
  //       props.isDragging = true;
  //       props.mouseXPosOnDrag = event.pageX;
  //       $('.handle').on('mousemove', function(event) {
  //       if (props.isDragging) {
  //         var el = $('.scroller'), scrolled = el.scrollLeft();
  //         IndexChart.currLeft = scrolled;
  //         props.pixelDiff     = event.clientX - props.mouseXPosOnDrag;
  //         var left = scrolled + (props.mouseXPosOnDrag - event.pageX);
  //         $('.handle').css('left', -left + 'px');
  //       }
  //     });
  //   });


  //   $('.handle').on('mouseup', function(event) {
  //     props.isDragging = false;
  //     $('.handle').unbind('mousemove');
  //   });
  //   $('.handle').on('mouseout', function(event) {
  //     props.isDragging = false;
  //     $('.handle').unbind('mousemove');
  //   });
  // },
  // ============= PUBLIC GETTERS/SETTERS ======================
  getLastIndexOnViewPort: function() {
    return this.properties.lastIndexOnViewPort;
  },
  getStockLine: function() {
    return this.data.daily.stockLine;
  },
  getVisibleStockLine: function() {
    return this.data.visibleStockLine || ChartView.getStockLine();
  },
  setVisibleStockLine: function(vsl){
    this.data.visibleStockLine = vsl;
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
  getZoomRatio: function(){
    return this.getVisibleStockLine().length / this.getStockLine().length;
  },
  isZoomed: function(){
    return this.getZoomRatio() !== 1;
  },
  getLastDataIndex: function() {
    return this.data.lastDataIndex;
  },
  setLastDataIndex: function(index) {
    this.data.lastDataIndex = index;
  },
  getDataSetLength: function() {
    return this.data.dataSetLength;
  },
  setDataSetLength: function(length){
    this.data.dataSetLength = length;
  },
  updateVisibleStockLine: function() {
    var vsl = ChartView.getStockLine().slice(ChartView.getLastDataIndex() - ChartView.getDataSetLength(), ChartView.getLastDataIndex())
    ChartView.setVisibleStockLine(vsl);
  },
  getScrollSpeed: function(){
    return this.properties.scrollSpeed;
  },
  isChartAtLeftMost: function(){
    var next = ChartView.getLastDataIndex() - ChartView.getScrollSpeed();
    return next < ChartView.getVisibleStockLine().length;
  },
  getScrollbarWidth: function() {
    return ChartView.properties.scrollBarWidth || ChartView.getChartWidth();
  },
  setScrollbarWidth: function(){
    ChartView.properties.scrollBarWidth = ChartView.getVisibleStockLine().length/ChartView.getStockLine().length*ChartView.getChartWidth();
  },
  getScrollbarPos: function(){
    return ChartView.properties.scrollbarPos;
  }, 
  setScrollbarPos: function(x){
    ChartView.properties.scrollbarPos = x;
  } 
};

