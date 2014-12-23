var ChartView = {
  data: {
    daily:{},
    sentiment: {}
  },
  properties: {},
  setProperties: function (options) {
    var self = this;
    //review
    var properties = {
      width: $('#content').width(), //width of left panel
      margin: { top: 8, right: 45, bottom: 25, left: 45 }, //margin of chart
      // chartWidth: function(){ return self.properties.width - self.properties.margin.right - self.properties.margin.left; }, //width of charts
      // graphWidth: this.chartWidth,
      volumeHeight: 50,
      zoomFactor: self.properties.zoomFactor || 1/1.2,
    };

    if (options) {
      for (var key in options) {
        properties[key] = options[key];
      }
    }
    this.properties = $.extend(true, {}, properties);
  },

//data.daily.stockLine
  x: function(data, returnProp){
    var self = this;
    var props = self.properties;
    var graphWidth = (props.width - props.margin.left - props.margin.right)*props.zoomFactor;
    return d3.scale.ordinal()
    .domain(data.map(function(x) { return x[returnProp]; }))
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

    $(window).on('resize', function() {
      self.setProperties();
      IndexChart.init();
      RsiChart.init();
      MacdChart.init();
      self.redraw(true); });
    $('#chart-view').on('resize', function(){
      self.setProperties();
      IndexChart.init();
      RsiChart.init();
      MacdChart.init();
      self.redraw(true);
    });

  },
  build: function(){
    var self = this;
    $('.loader').css('width', this.properties.width);
    $('.loader').css('height', '441px');

    function draw(date){
      //should handle this in model.js instead
      ChartModel.getIndexData(function(data) {
        ChartModel.getSentimentData(date, function(data){
          self.data.sentiment = data.sentiment;
          SentimentChart.build();
          self.data.info = data.info;
          self.data.daily = data.daily;
          self.data.minute = data.minute;

          IndexChart.init();
          RsiChart.init();
          MacdChart.init();
          Dashboard.render(self.data.info);
          Toolbar.render(self.data.daily);
        });
      });
    }
    var today = new Date();
    today = today.getFullYear().toString()  +
    (today.getMonth()+1).toString() +
    today.getDate().toString();
    draw(today);
  },
  redraw: function (zoomFactor) {
    this.properties.zoomFactor *= zoomFactor;
    $('.zoomable-chart-container').css('width', '100%');
    IndexChart.drawGraph(false);
    RsiChart.drawGraph(false);
    MacdChart.drawGraph(false);
    SentimentChart.build();
  },
  horizontalScroll: function () {
    'use strict';

    //should optimize should not
    $('.container').on('mousewheel', function (event){
      event.preventDefault();
      var original = $('.container').scrollLeft();
      console.log($('.container'));
      $('.container').scrollLeft ( original - event.originalEvent.deltaY)
    });
  },
};

