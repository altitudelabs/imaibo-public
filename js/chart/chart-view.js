/**
 * ChartView contains views for dashboard, index chart, sentiment chart, MACD chart and RSI chart
 */
var ChartView = {

  // Define models
  data: {
    daily: {},
    sentiment: {},
    error: {},
  },

  // Define properties
  properties: {
    refreshFrequency: 60000,
    scrollSpeed: 2,
    scrollbarPos: 0,
    mode: 'daily'
  },

  /**
   * setProperties() sets width, margin, zoom factor and other dimensions of chart
   */
  setProperties: function(options) {
    var self = this;
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

  /**
   * x() returns D3 domain function for x-axis
   */
  x: function(returnProp) {
    var self = this;
    var props = self.properties;

    return d3.scale.ordinal()
    .domain(ChartView.getVisibleStockLine().map(function(x) {
      return x[returnProp]; }))
    .rangeBands([0, props.chartWidth]); // inverse x-axis because api comes in descending order
  },

  /**
   * getXLabels() returns x-labels for chart
   */
  getXLabels: function() {
    var timeObjArray = {};
    this.data.xlabels = ChartView.getVisibleStockLine().filter(function (e, i) {
      var date = new Date(e.timestamp*1000);
      var month = date.getMonth();
      var year = date.getYear();
      if (ChartView.properties.mode === 'weekly' && (month % 3 !== 0)) {
        return false;
      }
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
  },

  /**
   * y1() returns D3 domain function for left y-axis
   */
  y1: function(height, returnProp, volumeHeight){
    var self = this;
    var min = d3.min(ChartView.getVisibleStockLine().map(function(x) { return +x[returnProp]; }));
    var max = d3.max(ChartView.getVisibleStockLine().map(function(x) { return +x[returnProp]; }));

    min = min - ((max-min)/height)*volumeHeight;
    max = max + ((max - min)*0.1);
    return this.buildY(min, max, height);
  },

  /**
   * y2() returns D3 domain function for right y-axis
   */
  y2: function(height, returnPropMax, returnPropMin, volumeHeight){
    var self = this;
    var min = d3.min(ChartView.getVisibleStockLine().map(function(x) { return +x[returnPropMin]; }));
    var max = d3.max(ChartView.getVisibleStockLine().map(function(x) { return +x[returnPropMax]; }));

    min = min - ((max-min)/height)*volumeHeight;
    max = max + ((max - min)*0.1);
    return this.buildY(min, max, height);
  },

  /**
   * buildY() is a helper function for creating y-axis domain
   */
  buildY: function(min, max, height) {
    var props = this.properties;
    return d3.scale.linear()
    .domain([min, max])
    .range([height-props.margin.bottom, props.margin.top]);
  },

  /**
   * v() returns D3 scaling function for volume columns
   */
  v: function(returnProp) {
    var self = this;
    var props = self.properties;

    return d3.scale.linear()
    .domain([0, d3.max(ChartView.getVisibleStockLine().map(function(d){ return +d[returnProp];}))])
    .range([0, props.volumeHeight]);
  },

  /*
   * xInverse() returns index of data at mouse cursor position
   *
   * @param xPos x-position of cursor
   * @param x x-range (d3 domain object)
   */
  xInverse: function(xPos, x) {
    var leftEdges = x.range(), // starting position of each column bar
        width = x.rangeBand(), // rangeBand is width of each column bar
        j;

    // while mouse x position is greater than the right most edge of the column, increment j; otherwise, return j
    for (j = 0; xPos > (leftEdges[j] + width); j++) {}
    return j;
  },

  /**
   * init() initializes chart view
   */
  init: function() {
    var self = this;
    Toolbar.init();
    self.initInfoButtons();
    self.setProperties();
    self.build();

    var resizeEnd;
    if(!IE8){
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

  /**
   * initInfoButtons() initialises info buttons for index and sentiment chart
   */
  initInfoButtons: function(){
    $('#index-info-button').leanModal({ closeButton: '.modal-close', modalId: '#index-info-modal' });
    $('#sentiment-info-button').leanModal({ closeButton: '.modal-close', modalId: '#sentiment-info-modal' });
  },

  /**
   * build() gets data from ChartModel and populates chart views when data is returned
   */
  build: function(){
    var self = this;
    $('.loader').css('width', this.properties.width);
    $('.outer #content').css('min-height', $(window).height() - 15 + 'px'); // 15 = size of top padding

    ChartModel.getInitialData()
    .done(function (indexError, sentimentError) {
      self.updateChartViewData(indexError, sentimentError, true);
      self.buildChartElements();
    });

    if(!IE8) {
      setInterval(function () {
        var indexOption = {};
        var sentimentOption = {};
        if (self.properties.mode === 'daily') {
          indexOption.daily = true;
          indexOption.dailyUpdate = true;
        } else {
          indexOption.weekly = true;
          indexOption.weeklyUpdate = true;
        }

        sentimentOption.sentimentUpdate = true;

        ChartModel.updateAllData(indexOption, sentimentOption)
        .done(function (indexError, sentimentError) {
          self.updateChartViewData(indexError, sentimentError);
          try { self.updateChartElements(); } catch (error) {  }
        });
      }, self.properties.refreshFrequency);
    }
  },

  /**
   * getPastIndexData()
   */
  getPastIndexData: function () {
    var self = this;
    if (self.updating) { return; }
    if (self.properties.mode === 'weekly') { return; }
    self.updating = true;

    var earliestDate = self.data.index.stockLine[0].rdate;
    var oldLength = self.data.index.stockLine.length;
    var options = {};
    var newDate = Helper.yyyymmddToDate(earliestDate.toString());

    if (self.properties.mode === 'daily') {
      options.daily = true;
      newDate.setDate(newDate.getDate()-1);
      options.date = parseInt(newDate.yyyymmdd());
    } else {
      options.weekly = true;
      newDate.setDate(newDate.getDate()-7);
      options.date = parseInt(newDate.yyyymmdd());
    }
    ChartModel.updateIndexData(options)
    .done(function (indexError) {
      self.updateChartViewData(indexError);
      var diff = self.data.index.stockLine.length - oldLength;
      self.data.lastDataIndex += diff;
      self.data.visibleStockLine = ChartView.getStockLine().slice(self.data.lastDataIndex - self.data.dataSetLength, self.data.lastDataIndex);
      self.moveToLeft();
      self.updating = false;
    });
  },

  /**
   * changeMode() switches chart between weekly and daily mode
   */
  changeMode: function(mode) {
    var self = this;
    var options;
    ChartView.properties.mode = mode;
    if (mode === 'weekly') {
      options = {
        weekly: {}
      };
    } else if (mode === 'daily') {
      options = {
        daily: {}
      };
    }
    ChartModel.refreshIndexData(options)
    .done(function (indexError) {
      self.updateChartViewData(indexError, false, true);
      self.redraw();
    });
  },

  /**
   * updateChartViewData()
   */
  updateChartViewData: function(indexError, sentimentError, initial) {
    var self = this;
    self.data = ChartModel.model;
    // self.data.sentiment.indexList = [];
    // self.data.sentiment.moodindexList = [];
    self.data.error = {
      index: indexError,
      sentiment: sentimentError
    };
    self.data.lastDataIndex = self.data.lastDataIndex || self.data.index.stockLine.length;
    self.data.dataSetLength = self.data.dataSetLength || self.data.index.stockLine.length;
    if (initial) {
      self.data.lastDataIndex = self.data.index.stockLine.length;
      self.data.dataSetLength = self.data.index.stockLine.length;
    }
    self.data.visibleStockLine = self.data.index.stockLine.slice(self.data.lastDataIndex - self.data.dataSetLength, self.data.lastDataIndex);
    self.setScrollbarWidth();
  },

  /*
   * buildChartElements() inits chart elements
   */
  buildChartElements: function() {
	$('#price').css('visibility', 'visible');
	$('#macd').css('visibility', 'visible');
	$('#rsi').css('visibility', 'visible');
	$('#sentiment').css('visibility', 'visible');

    var self = this;
    // Draw index
    if (!self.data.error.index.isError) {
      Toolbar.render(self.data.index); // must render before IndexChart.init. Or else ma60 won't hide properly
      IndexChart.init();
      RsiChart.init();
      MacdChart.init();
      ChartView.setScrollbarWidth();
      Dashboard.render(self.data.info);
    } else {
      Dashboard.renderWithError();
      IndexChart.initWithError();
    }
    // Draw sentiment
    try { SentimentChart.init(); } catch (error) { SentimentChart.initWithError(); }
    // SentimentChart.init();


    // Remove loaders
    $('.loader').remove();
    $('.dashboard-loader').remove();
  },

  /**
   * updateChartViewData() updates chart elements
   */
  updateChartElements: function() {
    var self = this;

    ChartView.updateVisibleStockLine();
    // Update index
    if (!self.data.indexError) {
      IndexChart.update();
      RsiChart.update();
      MacdChart.update();
      Dashboard.render(self.data.info);
    } else {
      Dashboard.renderWithError();
      IndexChart.initWithError();
    }

    if (!self.data.sentimentError) {
      SentimentChart.update();
    } else {
      SentimentChart.initWithError();
    }

    $('.zoomable-chart-container').css('width', '100%');
    ChartView.setScrollbarWidth();
    ChartView.setScrollbarPos();
  },

  /**
   * zoom() manages zooming function for chart view
   */
  zoom: function(zoomFactor) {
    var self = this;
    var newLength = Math.floor(self.data.dataSetLength / zoomFactor);

    if (newLength < 20) {
      return;
    }

    if (newLength > ChartView.getStockLine().length) {
      newLength = ChartView.getStockLine().length;
    }

    if (ChartView.getLastDataIndex() - newLength < 0) {
      var index = ChartView.getLastDataIndex() - (ChartView.getLastDataIndex() - newLength);
      ChartView.setLastDataIndex(index);
    }

    ChartView.setDataSetLength(newLength);
    ChartView.updateVisibleStockLine();

    if (ChartView.isZoomed()) {
       IndexChart.components.scrollBar.style('fill-opacity', 50);
       RsiChart  .components.scrollBar.style('fill-opacity', 50);
       MacdChart .components.scrollBar.style('fill-opacity', 50);
    } else {
       IndexChart.components.scrollBar.style('fill-opacity', 0);
       RsiChart  .components.scrollBar.style('fill-opacity', 0);
       MacdChart .components.scrollBar.style('fill-opacity', 0);
    }
    ChartView.setDataSetLength(newLength);
    self.setScrollbarWidth();
    self.setScrollbarPos();
    self.redraw();
  },
  zoomBehavior: function() {
    return d3.behavior.zoom()
      .on('zoom', function(){
        var deltaY = d3.event.sourceEvent.deltaY;

        if (!deltaY) // d3.event.sourceEvent.deltaY not defined in ie
          deltaY = -d3.event.sourceEvent.wheelDelta;

        if (deltaY > 0) {
          ChartView.moveToLeft();
        } else if (deltaY < 0) {
          ChartView.moveToRight();
        }
      });
  },

  /**
   * scrollbarDragBehavior() manages drag behavior for charts
   */
  scrollbarDragBehavior: function(){
    var self = this;
    this.properties.scrollbarDragBehavior = this.properties.scrollbarDragBehavior || d3.behavior.drag()
          .origin(function(d) { return d; })
          .on('drag', function(d) {
            var xPos = ChartView.getScrollbarPos() + d3.event.dx; //(get total chart width - starting xpos)/total chart width* stockline length
            if (xPos < 0 || xPos > ChartView.getChartWidth() - ChartView.getScrollbarWidth()) {
              return;
            }
            self.moveScrollBar(xPos, this);

            var xPos = ChartView.getScrollbarPos() + d3.event.dx; //(get total chart width - starting xpos)/total chart width* stockline length
            var speed = Math.ceil(ChartView.getVisibleStockLine().length * 0.075);
            if(xPos + ChartView.getScrollbarWidth() > ChartView.getChartWidth())
              xPos = ChartView.getChartWidth() - ChartView.getScrollbarWidth();
            if(xPos < 0)
              xPos = 0;
          });
          return this.properties.scrollbarDragBehavior;
  },

  /**
   * moveScrollBar() moves scrollbar for charts
   */
  moveScrollBar: function (xPos, scrollbar) {
    ChartView.properties.scrollbarPos = xPos;

    d3.select(scrollbar).attr('x', ChartView.properties.scrollbarPos);
    var index = Math.round(xPos / ChartView.getChartWidth() * ChartView.getStockLine().length);
    if (index !== ChartView.data.lastDataIndex - ChartView.data.dataSetLength) {
      ChartView.data.lastDataIndex = index + ChartView.data.dataSetLength;
      ChartView.redraw();
    }

  },

  /**
   * chartDragBehavior manages drag behavior for charts
   */
  chartDragBehavior: function() {
    var self = this;
    return d3.behavior.drag()
    .origin(function(d) { return d; })
    .on('drag', function(d){
      if(d3.event.dx < 0){
        ChartView.moveToRight();
      }else{
        ChartView.moveToLeft();
      }
    });
  },

  /**
   * moveToRight()
   */
  moveToRight: function() {
    var self = this;
    var speed = ChartView.getVisibleStockLine().length * 0.05;
        speed = Math.ceil(speed);
        speed = Math.abs(speed);

    if(self.data.lastDataIndex + speed > ChartView.getStockLine().length) {
      self.data.lastDataIndex = ChartView.getStockLine().length;
    } else {
      self.data.lastDataIndex+=speed;
    }
    self.data.visibleStockLine = ChartView.getStockLine().slice(self.data.lastDataIndex - self.data.dataSetLength, self.data.lastDataIndex);
    self.data.dataSetLength = ChartView.getVisibleStockLine().length;
    self.setScrollbarPos();
    self.redraw();
  },

  /**
   * moveToLeft()
   */
  moveToLeft: function () {
    var self  = this;
    var speed = ChartView.getVisibleStockLine().length * 0.05;
        speed = Math.ceil(speed);
        speed = Math.abs(speed);

    if(self.data.lastDataIndex - ChartView.getVisibleStockLine().length - speed < 0) {
      self.data.lastDataIndex = ChartView.getVisibleStockLine().length;
    } else {
      self.data.lastDataIndex -= speed;
    }
    self.data.visibleStockLine = ChartView.getStockLine().slice(self.data.lastDataIndex - self.data.dataSetLength, self.data.lastDataIndex);
    self.data.dataSetLength = ChartView.getVisibleStockLine().length;
    self.setScrollbarPos();
    self.redraw();

    if(ChartView.getLastDataIndex() - ChartView.data.visibleStockLine.length === 0){
      self.getPastIndexData();
    }
  },

  /**
   * redraw() updates the graph layer of all the charts in ChartView, with properties unchanged
   */
  redraw: function () {
    ChartView.updateVisibleStockLine();
    $('.zoomable-chart-container').css('width', '100%');
    ChartView.setScrollbarWidth();
    ChartView.setScrollbarPos();
    IndexChart.update();
    RsiChart.update();
    MacdChart.update();
  },

  /**
   * rebuild() updates the graph layer of all the charts with new properties (ex. windowWidth)
   */
  rebuild: function() {
    ChartView.setProperties();
     try {
      ChartView.updateVisibleStockLine();
      ChartView.setScrollbarWidth();
      ChartView.setScrollbarPos();
      RsiChart.update();
      MacdChart.update();
      IndexChart.update();
    } catch (error) {
      IndexChart.updateWithError();
    }
    try { SentimentChart.update(); } catch (error) { SentimentChart.initWithError(); }

    $('.zoomable-chart-container').css('width', '100%');
  },

  /**
   * showAllScrollbars() shows scrollbars for RSI, index and MACD chart
   */
  showAllScrollbars: function(){
    if(!ChartView.isZoomed()) return;
      RsiChart.components.scrollBar.style('fill-opacity', 100);
      IndexChart.components.scrollBar.style('fill-opacity', 100);
      MacdChart.components.scrollBar.style('fill-opacity', 100);
  },

  /**
   * hideAllScrollbars() hides all scrollbars for RSI, index and MACD chart
   */
  hideAllScrollbars: function(){
      RsiChart.components.scrollBar.style('fill-opacity', 0);
      IndexChart.components.scrollBar.style('fill-opacity', 0);
      MacdChart.components.scrollBar.style('fill-opacity', 0);
  },

  /**
   * mouseOverMouseOverlay()
   */
  mouseOverMouseOverlay: function(){
    ChartView.properties.mouseOverChart = true;
    if(ChartView.isZoomed()) {
      ChartView.showAllScrollbars();
    }
  },

  /**
   * mouseOutMouseOverlay()
   */
  mouseOutMouseOverlay: function(){
    var mOver = ChartView.properties.mouseOverScrollbar;
    ChartView.properties.mouseOverChart = false;
    if(!mOver){
      ChartView.hideAllScrollbars();
      $('html').css('overflow', 'visible');
    }
  },

  /**
   * Public getters and setters
   */
  getLastIndexOnViewPort: function() {
    return this.properties.lastIndexOnViewPort;
  },
  getStockLine: function() {
    return this.data.index.stockLine;
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
    var vsl = ChartView.getStockLine().slice(ChartView.getLastDataIndex() - ChartView.getDataSetLength(), ChartView.getLastDataIndex());
    ChartView.setVisibleStockLine(vsl);
  },
  getScrollSpeed: function(){
    return this.properties.scrollSpeed;
  },
  getScrollbarWidth: function() {
    return ChartView.properties.scrollBarWidth;
  },
  setScrollbarWidth: function(){
    ChartView.properties.scrollBarWidth = ChartView.getVisibleStockLine().length/ChartView.getStockLine().length*ChartView.getChartWidth();
  },
  getScrollbarPos: function(){
    return ChartView.properties.scrollbarPos;
  },
  setScrollbarPos: function(){
    var x =  (ChartView.getLastDataIndex() - ChartView.getVisibleStockLine().length)/ChartView.getStockLine().length * ChartView.getChartWidth();
    ChartView.properties.scrollbarPos = x;
  }
};

