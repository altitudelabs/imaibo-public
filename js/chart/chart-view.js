var ChartView = {
  data: {
    daily: {},
    sentiment: {}
  },
  properties: {
    refreshFrequency: 5000
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
      self.rebuild();
    });

    $('#chart-view').on('resize', function(){
      self.rebuild();
    });

  },
  build: function(){
    var self = this;
    $('.loader').css('width', this.properties.width);
    $('.loader').css('height', '441px');

    self.buildChartElements(true);

    setInterval(function(){
      self.buildChartElements(false);
    }, this.properties.refreshFrequency);
  },
  buildChartElements: function(initial) {
    var self = this;
    var today = new Date();
    today = today.getFullYear().toString() +
    (today.getMonth()+1).toString() +
    today.getDate().toString();

    ChartModel.getIndexData(today,function(data) {
      ChartModel.getSentimentData(today, function(data){
        self.data.sentiment = data.sentiment;
        SentimentChart.init();
        self.data.info = data.info;
        self.data.daily = data.daily;
        self.data.minute = data.minute;

        IndexChart.init();
        RsiChart.init();
        MacdChart.init();
        Dashboard.render(self.data.info);
        if(initial) Toolbar.render(self.data.daily);
      });
    });
  },
  redraw: function (zoomFactor) {
    zoomFactor = zoomFactor || 1;
    this.properties.zoomFactor *= zoomFactor;
    $('.zoomable-chart-container').css('width', '100%');
    IndexChart.drawGraph(false);
    RsiChart.drawGraph(false);
    MacdChart.drawGraph(false);
    SentimentChart.drawGraph(false);
  },
  rebuild: function() {
    this.setProperties();
    IndexChart.init();
    RsiChart.init();
    MacdChart.init();
    this.redraw(true);
  },
  horizontalScroll: function () {
    'use strict';

    //should optimize should not
    $('.container').on('mousewheel', function (event){
      event.preventDefault();
      var original = $('.container').scrollLeft();
      $('.container').scrollLeft ( original - event.originalEvent.deltaY )
    });
  },
};

