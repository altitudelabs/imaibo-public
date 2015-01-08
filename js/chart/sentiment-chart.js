var SentimentChart = {
  properties: {},
  components: {},
  data: {},
  setProperties: function(options) {
    'use strict';
    var properties = {
      height: 244,
      interval: 40,
      margin: { top: 6, right: 45, bottom: 36, left: 45 },
      containerWidth: ChartView.properties.width
    };
    properties.chartWidth = properties.containerWidth - properties.margin.left - properties.margin.right;
    properties.chartHeight = properties.height - properties.margin.top - properties.margin.bottom;
    this.properties = $.extend(true, {}, properties);
  },
  init: function(){
    'use strict';
    this.setProperties();
    this.updateData(true);
    this.appendComponents();
    this.draw();
    this.animate();
  },
  initWithError: function(){
    this.setProperties();
    this.draw();
    $('#sentiment-chart-label').append('<div class="empty-data">暂时无法下载数据，请稍后再试</div>');
    $('#sentiment .legend').remove();
  },
  update: function (hasNewData) {
    'use strict';
    this.updateData(hasNewData);
    this.setProperties();
    this.draw();
  },
  updateData: function (hasNewData) {
    'use strict';
    if(ChartView.data.sentimentError) { return; }
    var self = this;
    if (hasNewData) {
      self.data.moodindexList = self.helpers.processMoodData(ChartView.data.sentiment.moodindexList);
      self.data.indexList = self.helpers.processIndexData(ChartView.data.sentiment.indexList);
      self.data.closePrice = ChartView.data.sentiment.preclosepx;
      var minY1 = self.helpers.minIndex('mood', self.data.moodindexList);
      var maxY1 = self.helpers.maxIndex('mood', self.data.moodindexList);
      var minY2 = self.helpers.minIndex('price', self.data.indexList);
      var maxY2 = self.helpers.maxIndex('price', self.data.indexList);
      var y1Range = self.helpers.getRangeWithBuffer(minY1, maxY1);
      var y2Range = self.helpers.getRangeWithBuffer(minY2, maxY2);
      self.data.y1 = self.helpers.y(y1Range[0], y1Range[1]);
      self.data.y2 = self.helpers.y(y2Range[0], y2Range[1]);
    }
    var dataDate = new Date(self.data.moodindexList[0].timestamp*1000);
    self.data.startTime = dataDate.setHours(8,30,0,0)/1000;
    self.data.endTime = dataDate.setHours(17,30,0,0)/1000;
    self.data.ordinalTimeStamps = self.helpers.getOrdinalTimestamps();
    self.data.x  = self.helpers.x(self.properties.chartWidth, self.data.ordinalTimeStamps);
  },
  appendComponents: function () {
    'use strict';
    var self = this;

    //order here determines the z-index of the element
    self.componentsBuilder.chartLabel.append();
    self.componentsBuilder.topBorder.append();
    self.componentsBuilder.rightBorder.append();
    self.componentsBuilder.bottomBorder.append();
    self.componentsBuilder.leftBorder.append();
    self.componentsBuilder.y1Labels.append();
    self.componentsBuilder.y2Labels.append();
    
    self.componentsBuilder.chart.append();
    self.componentsBuilder.xLabels.append();
    self.componentsBuilder.sentimentLine.append();
    self.componentsBuilder.securityLines.append();
    self.componentsBuilder.tooltip.append();
    self.componentsBuilder.scatterDots.append();
    self.componentsBuilder.scatterDotsBubble.append();
    self.componentsBuilder.scatterDotsBubbleText.append();
    self.componentsBuilder.scatterDotsHover.append();
    
    self.componentsBuilder.sentimentCover.append();

    self.componentsBuilder.verticalGridLines.append();
    self.componentsBuilder.horizontalGridLines.append();
  },
  draw: function(){
    'use strict';
    var self = this;

    var props = self.properties;

    //container
    self.componentsBuilder.chartLabel.update();
    self.componentsBuilder.topBorder.update();
    self.componentsBuilder.rightBorder.update();
    self.componentsBuilder.bottomBorder.update();
    self.componentsBuilder.leftBorder.update();
    
    if(!ChartView.data.sentimentError) {
      //labels
      self.componentsBuilder.y1Labels.linkData();
      self.componentsBuilder.y1Labels.enter();
      self.componentsBuilder.y1Labels.update();

      self.componentsBuilder.y2Labels.linkData();
      self.componentsBuilder.y2Labels.enter();
      self.componentsBuilder.y2Labels.update();

      self.componentsBuilder.xLabels.linkData();
      self.componentsBuilder.xLabels.enter();
      self.componentsBuilder.xLabels.update();
      
      //GridLines
      self.componentsBuilder.verticalGridLines.linkData();
      self.componentsBuilder.verticalGridLines.enter();
      self.componentsBuilder.verticalGridLines.update();
      
      self.componentsBuilder.horizontalGridLines.linkData();
      self.componentsBuilder.horizontalGridLines.enter();
      self.componentsBuilder.horizontalGridLines.update();
    }

    //chart
    self.componentsBuilder.chart.update();

    //sentiment line
    self.componentsBuilder.sentimentLine.linkData();
    self.componentsBuilder.sentimentLine.update();
    //security line
    self.componentsBuilder.securityLines.linkData();
    self.componentsBuilder.securityLines.update();

    //tooltip
    self.componentsBuilder.tooltip.update();
    
    //scatterDots
    self.componentsBuilder.scatterDots.linkData();
    self.componentsBuilder.scatterDots.enter();
    self.componentsBuilder.scatterDots.update();

    if (!HIDE) {
      self.componentsBuilder.scatterDotsBubble.linkData();
      self.componentsBuilder.scatterDotsBubble.enter();
      self.componentsBuilder.scatterDotsBubble.update();

      self.componentsBuilder.scatterDotsBubbleText.linkData();
      self.componentsBuilder.scatterDotsBubbleText.enter();
      self.componentsBuilder.scatterDotsBubbleText.update();
    }

    self.componentsBuilder.scatterDotsHover.linkData();
    self.componentsBuilder.scatterDotsHover.enter();
    self.componentsBuilder.scatterDotsHover.update();
  },
  animate: function () {
    var self = this;
    //sentimentCover (animation)
    self.componentsBuilder.sentimentCover.update();
    self.componentsBuilder.sentimentCover.animate();
  },
  helpers: {
    x: function (width, data) {
      'use strict';
      var self = SentimentChart;
      var props = self.properties;
      return d3.scale.ordinal()
      .domain(data.map(function(x) { return x; }))
      .rangeBands([0, width]);
    },
    y: function (min, max) {
      'use strict';
      var self = SentimentChart;
      var props = self.properties;
      return d3.scale.linear()
      .domain([min, max])
      .range([props.height - props.margin.top - props.margin.bottom - props.margin.bottom, props.margin.top+20]);
    },
    minIndex: function (prop, data) {
      if(data && data.length != 0){
        return d3.min(data.map(function(x) { return +x[prop]; }));
      }
      return 0;
    },
    maxIndex: function (prop, data) {
      if(data && data.length != 0) {
        return d3.max(data.map(function(x) { return +x[prop]; }));
      }
      return 0;
    },
    // Processing mood data filters out non-trading days
    processMoodData: function(data){
      return data.filter(function (x) {
        if (!!x.isTradingDay && !!x.timestamp && new Date(x.timestamp*1000).getHours() !== 7) {
          return true;
        } else {
          return false;
        }
      });
    },
    // Processing index data filters out non-trading days
    processIndexData: function(data){
      return data.filter(function (x) {
        if (!!x.timestamp) {
          return true;
        }
      });
    },
    getRangeWithBuffer: function (min, max) {
      return [min - ((max - min)*0.5), max + ((max - min)*0.5)];
    },
    // Returns array of ordinal timestamps for x-axis
    getOrdinalTimestamps: function() {
      var self = SentimentChart;
      var timeStamps = [];
      for (var j = self.data.startTime; j <= self.data.endTime; j+=60){
        timeStamps.push(j);
      }
      return timeStamps;
    },
    // Create array of half hourly timestamps for vertical lines
    makeVerticalLines: function(){
      var self = SentimentChart;
      var interval = 60*30;
      var arr = [];
      for(var i = self.data.startTime; i < self.data.endTime; i+=interval){
        arr.push(i);
      }
      return arr;
    },
    // Returns current timestamp in client format
    getCurrentTimestamp: function(){
      var t = new Date();
      var t = t.setHours(t.getHours(),t.getMinutes(),0,0)/1000;
      return t;
    },
  },
  componentsBuilder: {
    chart: {
      append: function () {
        var self = SentimentChart;
        self.components.chart = d3.select('#sentiment-chart').append('svg:svg');
      },
      update: function () {
        var self = SentimentChart;
        var props = self.properties;
        self.components.chart
        .attr('class', 'chart')
        .attr('width', props.chartWidth)
        .attr('height', props.chartHeight);
      }
    },
    chartLabel: { 
      append: function () {
        var self = SentimentChart;
        self.components.chartLabel = d3.select('#sentiment-chart-label').append('svg:svg');
      },
      update: function () {
        var self = SentimentChart;
        self.components.chartLabel
        .attr('class', 'chart')
        .attr('width', self.properties.containerWidth)
        .attr('height', self.properties.chartHeight);
      }
    },
    horizontalGridLines: {
      append: function () {
        var self = SentimentChart;
        self.components.horizontalGridLines = self.components.chartLabel.append('g').selectAll('text.yrule');
      },
      linkData: function () {
        var self = SentimentChart;
        self.components.horizontalGridLines = self.components.horizontalGridLines.data(self.data.y1.ticks(5));
      },
      enter: function () {
        var self = SentimentChart;
        var props = self.properties;
        self.components.horizontalGridLines
        .enter().append('line')
        .attr(
        {
            'class':'horizontalGrid',
            'x1' : props.margin.left,
            'x2' : props.chartWidth + props.margin.left,
            'y1' : function(d){ return self.data.y1(d)- 10;},
            'y2' : function(d){ return self.data.y1(d)- 10;},
            'fill' : 'none',
            'shape-rendering' : 'crispEdges',
            'stroke' : 'rgb(50, 50, 50)',
            'stroke-width' : '1px'
        });
      },
      update: function () {
        var self = SentimentChart;
        var props = self.properties;
        self.components.horizontalGridLines
        .attr('x2', props.chartWidth + props.margin.left);
      },
      exit: function () {
        var self = SentimentChart;
        self.components.horizontalGridLines
        .exit()
        .remove();
      }
    },
    verticalGridLines: {
      append: function () {
        var self = SentimentChart;
        self.components.verticalGridLines = self.components.chartLabel.append('g').selectAll('text.yrule');
      },
      linkData: function () {
        var self = SentimentChart;
        var hourly = self.helpers.makeVerticalLines();
        self.components.verticalGridLines = self.components.verticalGridLines.data(hourly);
      },
      enter: function () {
        var self = SentimentChart;
        var props = self.properties;

        self.components.verticalGridLines
        .enter().append('line')
          .attr({
            'class':'horizontalGrid',
            'x1' : function(d){ return self.data.x(d) + props.margin.left; },
            'x2' : function(d){ return self.data.x(d) + props.margin.left; },
            'y1' : props.chartHeight - props.margin.bottom,
            'y2' : props.margin.top,
            'fill' : 'none',
            'shape-rendering' : 'crispEdges',
            'stroke' : 'rgb(50, 50, 50)',
            'stroke-width' : '1px'
          });
      },
      update: function () {
        var self = SentimentChart;
        var props = self.properties;
        self.components.verticalGridLines
        .attr({
          'x1' : function(d){ return self.data.x(d) + props.margin.left; },
          'x2' : function(d){ return self.data.x(d) + props.margin.left; },
        });  
      },
      exit: function () {
        var self = SentimentChart;
        self.components.verticalGridLines
        .exit()
        .remove();
      }
    },
    topBorder: {
      append: function () {
        var self = SentimentChart;
        self.components.topBorder = self.components.chartLabel.append('svg:line');
      },
      update: function () {
        var self = SentimentChart;
        var props = self.properties;
        self.components.topBorder
        .attr('class', 'xborder-top-thick')
        .attr('x1', props.margin.left)
        .attr('x2', props.chartWidth + props.margin.left)
        .attr('y1', props.margin.top)
        .attr('y2', props.margin.top)
        .attr('stroke', 'rgb(77, 77, 77)')
        .attr('stroke-width', '2px');
      }
    },
    rightBorder: {
      append: function () {
        var self = SentimentChart;
        self.components.rightBorder = self.components.chartLabel.append('svg:line');
      },
      update: function () {
        var self = SentimentChart;
        var props = self.properties;
        self.components.rightBorder
        .attr('class', 'yborder-right')
        .attr('x1', props.chartWidth + props.margin.left)
        .attr('x2', props.chartWidth + props.margin.left)
        .attr('y1', props.chartHeight - props.margin.bottom)
        .attr('y2', props.margin.top)
        .attr('stroke', 'rgb(77, 77, 77)')
        .attr('stroke-width', '2px');

      }
    },
    bottomBorder: {
      append: function () {
        var self = SentimentChart;
        self.components.bottomBorder = self.components.chartLabel.append('svg:line');
      },
      update: function () {
        var self = SentimentChart;
        var props = self.properties;
        self.components.bottomBorder
        .attr('class', 'xaxis')
        .attr('x1', props.margin.left)
        .attr('x2', props.containerWidth - props.margin.right)
        .attr('y1', props.chartHeight - props.margin.bottom)
        .attr('y2', props.chartHeight - props.margin.bottom)
        .attr('stroke', 'rgb(77, 77, 77)')
        .attr('stroke-width', '2px');
      }
    },
    leftBorder: {
      append: function () {
        var self = SentimentChart;
        self.components.leftBorder = self.components.chartLabel.append('svg:line');
      },
      update: function () {
        var self = SentimentChart;
        var props = self.properties;
        self.components.leftBorder
        .attr('class', 'yborder-left')
        .attr('x1', props.margin.left)
        .attr('x2', props.margin.left)
        .attr('y1', props.chartHeight - props.margin.bottom)
        .attr('y2', props.margin.top)
        .attr('stroke', 'rgb(77, 77, 77)')
        .attr('stroke-width', '2px');
      }
    },
    y1Labels: {
      append: function () {
        var self = SentimentChart;
        self.components.y1Labels = self.components.chartLabel.append('g').selectAll('text.yrule');
      },
      linkData: function () {
        var self = SentimentChart;
        self.components.y1Labels = self.components.y1Labels.data(self.data.y1.ticks(5));
      },
      enter: function () {
        var self = SentimentChart;
        self.components.y1Labels
        .attr('class','y1labels')
        .enter().append('svg:text')
        .attr('class', 'yrule');
      },
      update: function () {
        var self = SentimentChart;
        var props = self.properties;
        self.components.y1Labels
        .attr('x', props.margin.left - 15)
        .attr('y', self.data.y1)
        .attr('text-anchor', 'middle')
        .style('fill','rgb(129, 129, 129)')
        .text(String);
      },
      exit: function () {
        var self = SentimentChart;
        self.components.y1Labels
        .exit()
        .remove();
      }
    },
    y2Labels: {
      append: function () {
        var self = SentimentChart;
        self.components.y2Labels = self.components.chartLabel.append('g').selectAll('text.yrule');
      },
      linkData: function () {
        var self = SentimentChart;
        self.components.y2Labels = self.components.y2Labels.data(self.data.y2.ticks(5));
      },
      enter: function () {
        var self = SentimentChart;
        self.components.y2Labels
        .attr('class','y2labels')
        .enter()
        .append('svg:text')
        .attr('class', 'yrule');
      },
      update: function () {
        var self = SentimentChart;
        var props = self.properties;
        self.components.y2Labels
        .attr('x', props.chartWidth + props.margin.left + 18)
        .attr('y', self.data.y2)
        .attr('text-anchor', 'middle')
        .style('fill','rgb(129, 129, 129)')
        .text(String);
      },
      exit: function () {
        var self = SentimentChart;
        self.components.y2Labels
        .exit()
        .remove();
      }
    },
    xLabels: {
      append: function () {
        var self = SentimentChart;
        self.components.xLabels = self.components.chart.selectAll('text.xrule');
      },
      linkData: function () {
        var self = SentimentChart;
        var begin = self.data.startTime + 1800;
        var xLabelTimeStampsArray = [];
        for (var i = 0; i < 5; i++) {
          xLabelTimeStampsArray.push(begin + i*7200);
        }
        self.components.xLabels = self.components.xLabels.data(xLabelTimeStampsArray);
      },
      enter: function () {
        var self = SentimentChart;
        self.components.xLabels
        .attr('class','xlabels')
        .enter()
        .append('svg:text')
        .attr('class', 'xrule')
        .attr('text-anchor', 'middle');
      },
      update: function () {
        var self = SentimentChart;
        var props = self.properties;
        self.components.xLabels
        .attr('x', function (d, i) { return self.data.x(d); })
        .attr('y', props.chartHeight - 25)
        .text(function (d, i) {
          return new Date(d * 1000).getHours() + ':00';
        });
      },
      exit: function () {
        var self = SentimentChart;
        self.components.xLabels
        .exit()
        .remove();
      }
    },
    sentimentLine: {
      append: function () {
        var self = SentimentChart;
        self.components.sentimentLine = self.components.chart.append('path');
      },
      linkData: function () {
        var self = SentimentChart;
        self.components.sentimentLine = self.components.sentimentLine.datum(self.data.moodindexList);
      },
      update: function () {
        var self = SentimentChart;
        self.components.sentimentLine
        .attr({
          'class':'sentiment',
          'd': d3.svg.line()
               .x(function(d,i) { return self.data.x(d.timestamp); })
               .y(function(d) { return self.data.y1(d.mood); })
               .interpolate('linear'),
          'stroke': '#25bcf1',
          'fill': 'none'
        });
      }
    },
    securityLines: {
      types: ['openDotted', 'lunchDotted', 'closeDotted', 'amLinear', 'pmLinear'],
      append: function () {
        var self = SentimentChart;
        self.components.securityLines = {};
        for (var i = 0; i < this.types.length; i++) {
          self.components.securityLines[this.types[i]] = self.components.chart.append('path');
        }
      },
      linkData: function () {
        var self = SentimentChart;
        var data = self.data.indexList;
        
        //linear
        var amLinearData = data.slice(0, 121);
        self.components.securityLines['amLinear'] = self.components.securityLines['amLinear'].datum(amLinearData);
        var pmLinearData = data.slice(121);
        self.components.securityLines['pmLinear'] = self.components.securityLines['pmLinear'].datum(pmLinearData);
        
        //dotted
        var currentTimeStamp = self.helpers.getCurrentTimestamp();
        var currentDate = new Date(currentTimeStamp*1000);

        if (currentTimeStamp < self.data.startTime) { return; }
        
        //start - market open
        var openDottedPrice = currentDate.getHours() < 9 ? self.data.closePrice : data[0].price;
        var openDottedData = [{ timestamp: self.data.startTime,
                                price: openDottedPrice
                              },
                              { timestamp: Math.min(currentTimeStamp, self.data.startTime + 3600),
                                price: openDottedPrice
                              }];
        self.components.securityLines['openDotted'] = self.components.securityLines['openDotted'].datum(openDottedData);

        //lunch
        if (currentDate.getHours() > 12 || (currentDate.getHours() === 12 && currentDate.getMinutes() > 30 )) {
          var lunchDottedPrice = amLinearData[120].price;
          var lunchDottedData = [{
                                  timestamp: amLinearData[120].timestamp+60,
                                  price: lunchDottedPrice
                                },
                                {
                                  timestamp: Math.min(currentTimeStamp, amLinearData[120].timestamp+5400),
                                  price: lunchDottedPrice
                                }];
          self.components.securityLines['lunchDotted'] = self.components.securityLines['lunchDotted'].datum(lunchDottedData);
        }
        //market close
        if (currentDate.getHours() > 15 || (currentDate.getHours() === 15 && currentDate.getMinutes() > 30 )) {
          var closeDottedPrice = pmLinearData[150].price;
          var closeDottedData = [{
                                  timestamp: amLinearData[150].timestamp+60,
                                  price: closeDottedPrice
                                },
                                {
                                  timestamp: Math.min(currentTimeStamp, amLinearData[150].timestamp+7200),
                                  price: closeDottedPrice
                                }];
          self.components.securityLines['closeDotted'] = self.components.securityLines['closeDotted'].datum(closeDottedData);
        }
      },
      update: function () {
        var self = SentimentChart;
        var id;
        
        for (var i = 0; i < this.types.length; i++) {
          id = this.types[i];
          //general
          self.components.securityLines[id]
          .attr({
            'class':'security',
            'stroke': '#fff',
            'fill': 'none'
          });
          if (self.components.securityLines[id].data()[0]) {
            self.components.securityLines[id]
            .attr('d', d3.svg.line()
                 .x(function(d,i) { return self.data.x(d.timestamp); })
                 .y(function(d)   { return self.data.y2(d.price); })
                 .interpolate('basis'))
          }
          //style specific
          if (id.substr(id.length - 6) === 'Dotted') {
            self.components.securityLines[id]
            .attr('class','security-dotted')
            .style('stroke-dasharray', ('1, 3'));
          }

        }
      }
    },
    tooltip: {
      append: function () {
        var self = SentimentChart;
        self.components.tooltip = d3.select('body').append('div');
      },
      update: function () {
        var self = SentimentChart;
        self.components.tooltip
        .attr('class', 'tooltip')
        .style('opacity', 0)
        .attr('id', 'sentiment-tooltip');
      }
    },
    scatterDots: {
      append: function () {
        var self = SentimentChart;
        self.components.scatterDots = self.components.chart.selectAll('scatter-dots');
      },
      linkData: function () {
        var self = SentimentChart;
        self.components.scatterDots = self.components.scatterDots.data(self.data.moodindexList);
      },
      enter: function () {
        var self = SentimentChart;
        self.components.scatterDots
        .enter().append('svg:circle')  // create a new circle for each value
        .attr('r', 4)
        .attr('stroke', '#25bcf1')
        .attr('stroke-width', '1')
        .style('opacity', 1)
        .attr('id', function (d, i) {
          return 'sd-' + i;
        });
      },
      update: function () {
        var self = SentimentChart;
        self.components.scatterDots
        .attr('cy', function (d) { return self.data.y1(d.mood); } ) // translate y value to a pixel
        .attr('cx', function (d,i) { return self.data.x(d.timestamp); } ); // translate x value

      },
      exit: function () {
        var self = SentimentChart;
        self.components.scatterDots
        .exit()
        .remove();
      }
    },
    scatterDotsBubble: {
      append: function () {
        var self = SentimentChart;
        self.components.scatterDotsBubble = self.components.chart.selectAll('scatter-dots');
      },
      linkData: function () {
        var self = SentimentChart;
        self.components.scatterDotsBubble = self.components.scatterDotsBubble.data(self.data.moodindexList);
      },
      enter: function () {
        var self = SentimentChart;
        self.components.scatterDotsBubble
        .enter()
        .append('path')
        .attr('fill', function (d,i) {
          return '#31BBED';
        })
        .attr('d', function (d,i) {
          if (d.newsCount) {
            return 'M29,17.375c0,6.1-3.877,11.125-6.5,11.125s-6.75-5.35-6.75-11.25c0-4.004,4.06-5.167,6.683-5.167  S29,13.371,29,17.375z';
          }
        });
      },
      update: function () {
        var self = SentimentChart;
        self.components.scatterDotsBubble
        .attr('transform', function (d, i) {
          return 'translate(' + (self.data.x(d.timestamp) - 23 ) + ',' + (self.data.y1(d.mood)-37) + ')';
        });
      },
      exit: function () {
        var self = SentimentChart;
        self.components.scatterDotsBubble
        .exit()
        .remove();
      }
    },
    scatterDotsBubbleText: {
      append: function () {
        var self = SentimentChart;
        self.components.scatterDotsBubbleText = self.components.chart.selectAll('scatter-dots');
      },
      linkData: function () {
        var self = SentimentChart;
        self.components.scatterDotsBubbleText = self.components.scatterDotsBubbleText.data(self.data.moodindexList);
      },
      enter: function () {
        var self = SentimentChart;
        self.components.scatterDotsBubbleText
        .enter().append('text')  // create a new circle for each value
        .attr('class', 'sentiment')
        .attr('fill', 'white')
        .text(function(d, i){
          if (d.newsCount) { return d.newsCount; }
        });
      },
      update: function () {
        var self = SentimentChart;
        self.components.scatterDotsBubbleText
        .attr('y', function (d) { return self.data.y1(d.mood) - 13; } ) // translate y value to a pixel
        .attr('x', function (d,i) { return self.data.x(d.timestamp) - 4 ; } ); // translate x value
      },
      exit: function () {
        var self = SentimentChart;
        self.components.scatterDotsBubbleText
        .exit()
        .remove();
      }
    },
    // scatterDotsBubbleHover: {
    //   append: function () {
    //     var self = SentimentChart;
    //     self.components.scatterDotsBubbleText = self.components.chart.selectAll('scatter-dots');
    //   }
    // }
    scatterDotsHover: {
      append: function () {
        var self = SentimentChart;
        self.components.scatterDotsHover = self.components.chart.selectAll('scatter-dots');
      },
      linkData: function () {
        var self = SentimentChart;
        self.components.scatterDotsHover = self.components.scatterDotsHover.data(self.data.moodindexList);
      },
      enter: function () {
        var self = SentimentChart;
        var sDH = this;
        self.components.scatterDotsHover
        .enter().append('svg:circle')  // create a new circle for each value
        .attr('r', 8)
        .style('opacity', 0)
        .on('mouseover', function(d, i) {
          if(IE8){
            sDH.xPos = event.clientX;
            sDH.yPos = event.clientY;
            sDH.style = 'display';
            sDH.fadeIn = 'inline-block';
            sDH.fadeOut = 'none';
          }else{
            sDH.xPos = d3.event.pageX + 8;
            sDH.yPos = d3.event.pageY + 3;
            sDH.style = 'opacity';
            sDH.fadeIn = 1;
            sDH.fadeOut = 0;
          }

          var target = d3.select('#sd-' + i);
          target.attr('fill', '#3bc1ef');
          target.attr('r', '4');
          target.attr('stroke', '#fff');
          target.attr('stroke-width', '1.5');

          var arrow = (d.newsSign === '+'? 'rise':'fall');
          // var show_extra = (d.newsTitle.length < 12? 'hide':'show');
          var moodDiff;
          if (i === 0) {
            moodDiff = ' - ';
          } else {
            var prevMood = self.components.scatterDots.data()[i-1].mood;
            moodDiff = d.mood - prevMood;
            moodDiff = moodDiff.toFixed(2);
            if (moodDiff > 0) {
              moodDiff = '+' + moodDiff;
            }
          }
          self.components.tooltip.transition()
          .duration(200)
          .style(sDH.style, sDH.fadeIn);
          self.components.tooltip.html('<div class="sentiment-self.components.tooltip sentiment-tooltip">' +
                          '<div class="tooltip-date">' + Helper.toDate(d.rdate).slice(5) + ' &nbsp;&nbsp;&nbsp;' + d.clock.slice(0, -3) + '</div>' +
                          '<div class="wrapper">' +
                            '<div class="mood"> 心情指数： ' + d.mood +             '</div>' +
                            '<div class="mood"> 相对之前： ' + d.moodChg +             '</div>' +
                            // '<div>' +
                            //   '<div class="arrow ' + arrow + '">                     </div>' +
                            //   '<div class="content"> ' + d.newsTitle.slice(0, 12) + '</div>' +
                            //   '<div class="extra ' + show_extra + '">...</div>' +
                            // '</div>' +
                          '</div>' +
                       '</div>')
          .style('left', sDH.xPos + 'px')
          .style('top', sDH.yPos + 'px');
        })
        .on('mouseout', function(d, i) {
          var target = d3.select('#sd-' + i);
          target.attr('fill','#000');
          target.attr('r', '4');
          target.attr('stroke', '#25bcf1');
          target.attr('stroke-width', '1');

          self.components.tooltip.transition()
          .duration(500)
          .style(sDH.style, sDH.fadeOut);
        });
      },
      update: function () {
        var self = SentimentChart;
        self.components.scatterDotsHover
        .attr('cy', function (d) { return self.data.y1(d.mood); } ) // translate y value to a pixel
        .attr('cx', function (d,i) { return self.data.x(d.timestamp); } );
      },
      exit: function () {
        var self = SentimentChart;
        self.components.scatterDotsHover
        .exit()
        .remove();
      },
      style: '',
      fadeIn: '',
      fadeOut: '',
      xPos: '',
      yPos: ''
    },
    sentimentCover: {
      append: function () {
        var self = SentimentChart;
        self.components.sentimentCover = d3.select('#sentiment-chart').append('svg:svg');
      },
      update: function () {
        var self = SentimentChart;
        var props = self.properties;
        self.components.sentimentCover
        .style('position', 'absolute')
        .style('left', 3)
        .style('top', 3)
        .style('background-color', 'rgb(38, 38, 38)')
        .attr('width', props.chartWidth - 4)
        .attr('height', props.chartHeight - 44)
      },
      animate: function () {
        var self = SentimentChart;
        var props = self.properties;
        self.components.sentimentCover
        .transition().duration(1000)
          .style('left', props.chartWidth - 4)
          .attr('width', 0)
      }
    },
    sentimentHover: {
      append: function () {
        var self = SentimentChart;
        self.components.sentimentHover = d3.select('#sentiment-chart').append('svg:svg');
      },
      update: function () {
        var self = SentimentChart;
        var props = self.properties;
        self.components.sentimentHover
        .style('position', 'absolute')
        .style('left', 0)
        .style('top', 0)
        .style('opacity', '0')
        .attr('width', props.chartWidth)
        .attr('height', props.chartHeight)
      },
    }
  }
};
