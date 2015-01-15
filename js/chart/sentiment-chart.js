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
      containerWidth: ChartView.properties.width,
      absoluteHeight: 1038
    };
    properties.chartWidth = properties.containerWidth - properties.margin.left - properties.margin.right;
    properties.chartHeight = properties.height - properties.margin.top - properties.margin.bottom;
    this.properties = $.extend(true, {}, properties);
  },
  init: function(){
    'use strict';
    this.setProperties();
    this.updateData(true);
    this.draw();
  },
  initWithError: function(){
    this.setProperties();
    this.draw(true);
    $('#sentiment-chart-label').append('<div class="empty-data">暂时无法下载数据，请稍后再试</div>');
    $('#sentiment .legend').remove();
  },
  update: function () {
    this.setProperties();
    this.updateData();
    this.draw();
  },
  updateData: function () {
    'use strict';
    if(ChartView.data.sentimentError) { return; }
    var self = this;
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

    var dataDate = new Date(ChartView.data.sentiment.timestamp*1000);
    self.data.startTime = dataDate.setHours(8,30,0,0)/1000;
    self.data.endTime = dataDate.setHours(17,30,0,0)/1000;
    self.data.ordinalTimeStamps = self.helpers.getOrdinalTimestamps();
    self.data.x  = self.helpers.x(self.properties.chartWidth, self.data.ordinalTimeStamps);
  },
  draw: function(error){
    'use strict';
    var self = this;
    self.appendComponents();
    if (error) { return; }

    // LINK DATA ===================================================================
    self.componentsBuilder.y1Labels.linkData();
    self.componentsBuilder.y2Labels.linkData();
    self.componentsBuilder.xLabels.linkData();
    self.componentsBuilder.verticalGridLines.linkData();
    self.componentsBuilder.horizontalGridLines.linkData();
    self.componentsBuilder.scatterDots.linkData();
    self.componentsBuilder.scatterDotsHover.linkData();
    self.componentsBuilder.sentimentLine.linkData();
    self.componentsBuilder.securityLines.linkData();
    if (!HIDE) {
      self.componentsBuilder.scatterDotsBubble.linkData();
      self.componentsBuilder.scatterDotsBubbleText.linkData();
    } 

    // ENTER LOOP ===================================================================
    self.componentsBuilder.y1Labels.enter();
    self.componentsBuilder.y2Labels.enter();
    self.componentsBuilder.xLabels.enter();
    self.componentsBuilder.verticalGridLines.enter();
    self.componentsBuilder.horizontalGridLines.enter();
    self.componentsBuilder.scatterDots.enter();
    self.componentsBuilder.scatterDotsHover.enter();
    if (!HIDE) {
      self.componentsBuilder.scatterDotsBubble.enter();
      self.componentsBuilder.scatterDotsBubbleText.enter();
    }
    // UPDATE LOOP ===================================================================
    for (var key in self.componentsBuilder) {
      self.componentsBuilder[key].update();
    } 

    // Etc ===================================================================
    self.helpers.updateLegends(self.data.indexList[self.data.indexList.length-1], self.data.moodindexList[self.data.moodindexList.length-1]);
    this.animate();

  },
  appendComponents: function () {
    'use strict';
    var self = SentimentChart;
    $('#sentiment-chart').empty();
    $('#sentiment-chart-label').empty();
    //ordering here is important! do not use for-loop
    self.componentsBuilder.chart.append();
    self.componentsBuilder.chartLabel.append();
    self.componentsBuilder.verticalGridLines.append();
    self.componentsBuilder.horizontalGridLines.append();
    self.componentsBuilder.topBorder.append();
    self.componentsBuilder.rightBorder.append();
    self.componentsBuilder.bottomBorder.append();
    self.componentsBuilder.leftBorder.append();
    self.componentsBuilder.y1Labels.append();
    self.componentsBuilder.y2Labels.append();
    self.componentsBuilder.xLabels.append();
    self.componentsBuilder.sentimentLine.append();
    self.componentsBuilder.securityLines.append();
    self.componentsBuilder.scatterDots.append();
    self.componentsBuilder.scatterDotsBubble.append();
    self.componentsBuilder.scatterDotsBubbleText.append();
    self.componentsBuilder.scatterDotsHover.append();
    self.componentsBuilder.sentimentCover.append();
    self.componentsBuilder.sentimentOverlay.append();
    self.componentsBuilder.tooltip.append();
  },
  animate: function () {
    var self = this;
    //sentimentCover (animation)
    self.componentsBuilder.sentimentCover.animate();
  },
  helpers: {
    x: function (width, data) {
      'use strict';
      var props = SentimentChart.properties;
      return d3.scale.ordinal()
      .domain(data.map(function(x) { return x; }))
      .rangeBands([0, width]);
    },
    y: function (min, max) {
      'use strict';
      var props = SentimentChart.properties;
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
      })
      .sort(function (a, b){
        return a.timestamp - b.timestamp;
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
      var timeStamps = [];
      for (var j = SentimentChart.data.startTime; j <= SentimentChart.data.endTime; j+=60){
        timeStamps.push(j);
      }
      return timeStamps;
    },
    // Create array of half hourly timestamps for vertical lines
    makeVerticalLines: function(){
      var interval = 60*30;
      var arr = [];
      for(var i = SentimentChart.data.startTime; i < SentimentChart.data.endTime; i+=interval){
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
    getLastest: function (type, timestamp) {
      'use strict';
      var closest;
      for (var i = 0; i < SentimentChart.data[type].length; i++) {
        if (SentimentChart.data[type][i].timestamp < timestamp) {
          closest = SentimentChart.data[type][i];
        }
      }
      return closest;
    },
    updateLegends: function (indexData, moodindexData) {
      $('#sentiment-chart-legend .security').text(indexData ? indexData.price : '--');
      $('#sentiment-chart-legend .mood').text(moodindexData ? moodindexData.mood : '--');
      $('#sentiment-chart-legend .moodchange').text(moodindexData ? moodindexData.moodChg : '--');
    },
    getMousePosition: function (context) {
      'use strict';
      var xPos, yPos;
      if(IE8) {
        xPos = event.clientX;
        yPos = event.clientY;
      }
      else {
        xPos = d3.mouse(context)[0];
        yPos = d3.mouse(context)[1];
      }
      return [xPos, yPos];
    }
  },
  componentsBuilder: {
    chart: {
      append: function () {
        SentimentChart.components.chart = d3.select('#sentiment-chart').append('svg:svg');
      },
      update: function () {
        var props = SentimentChart.properties;
        SentimentChart.components.chart
        .attr('class', 'chart')
        .attr('width', props.chartWidth)
        .attr('height', props.chartHeight);
      }
    },
    chartLabel: { 
      append: function () {
        SentimentChart.components.chartLabel = d3.select('#sentiment-chart-label').append('svg:svg');
      },
      update: function () {
        SentimentChart.components.chartLabel
        .attr('class', 'chart')
        .attr('width', SentimentChart.properties.containerWidth)
        .attr('height', SentimentChart.properties.chartHeight);
      }
    },
    horizontalGridLines: {
      append: function () {
        SentimentChart.components.horizontalGridLines = SentimentChart.components.chartLabel.append('g').selectAll('text.yrule');
      },
      linkData: function () {
        SentimentChart.components.horizontalGridLines = SentimentChart.components.horizontalGridLines.data(SentimentChart.data.y1.ticks(5));
      },
      enter: function () {
        var props = SentimentChart.properties;
        SentimentChart.components.horizontalGridLines
        .enter().append('line')
        .attr(
        {
            'class':'horizontalGrid',
            'x1' : props.margin.left,
            'x2' : props.chartWidth + props.margin.left,
            'y1' : function(d){ return SentimentChart.data.y1(d)- 10;},
            'y2' : function(d){ return SentimentChart.data.y1(d)- 10;},
            'fill' : 'none',
            'shape-rendering' : 'crispEdges',
            'stroke' : 'rgb(50, 50, 50)',
            'stroke-width' : '1px'

        });
      },
      update: function () {
        var props = SentimentChart.properties;
        SentimentChart.components.horizontalGridLines
        .attr('x2', props.chartWidth + props.margin.left);
      },
      exit: function () {
        SentimentChart.components.horizontalGridLines
        .exit()
        .remove();
      }
    },
    verticalGridLines: {
      append: function () {
        SentimentChart.components.verticalGridLines = SentimentChart.components.chartLabel.append('g').selectAll('text.yrule');
      },
      linkData: function () {
        var hourly = SentimentChart.helpers.makeVerticalLines();
        SentimentChart.components.verticalGridLines = SentimentChart.components.verticalGridLines.data(hourly);
      },
      enter: function () {
        var props = SentimentChart.properties;

        SentimentChart.components.verticalGridLines
        .enter().append('line')
        .attr({
          'class':'horizontalGrid',
          'x1' : function(d){ return SentimentChart.data.x(d) + props.margin.left; },
          'x2' : function(d){ return SentimentChart.data.x(d) + props.margin.left; },
          'y1' : props.chartHeight - props.margin.bottom,
          'y2' : props.margin.top,
          'fill' : 'none',
          'shape-rendering' : 'crispEdges',
          'stroke' : 'rgb(50, 50, 50)',
          'stroke-width' : '1px'
        });
      },
      update: function () {
        var props = SentimentChart.properties;
        SentimentChart.components.verticalGridLines
        .attr({
          'x1' : function(d){ return SentimentChart.data.x(d) + props.margin.left; },
          'x2' : function(d){ return SentimentChart.data.x(d) + props.margin.left; },
        });  
      },
      exit: function () {
        SentimentChart.components.verticalGridLines
        .exit()
        .remove();
      }
    },
    topBorder: {
      append: function () {
        SentimentChart.components.topBorder = SentimentChart.components.chartLabel.append('svg:line');
      },
      update: function () {
        var props = SentimentChart.properties;
        SentimentChart.components.topBorder
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
        SentimentChart.components.rightBorder = SentimentChart.components.chartLabel.append('svg:line');
      },
      update: function () {
        var props = SentimentChart.properties;
        SentimentChart.components.rightBorder
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
        SentimentChart.components.bottomBorder = SentimentChart.components.chartLabel.append('svg:line');
      },
      update: function () {
        var props = SentimentChart.properties;
        SentimentChart.components.bottomBorder
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
        SentimentChart.components.leftBorder = SentimentChart.components.chartLabel.append('svg:line');
      },
      update: function () {
        var props = SentimentChart.properties;
        SentimentChart.components.leftBorder
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
        SentimentChart.components.y1Labels = SentimentChart.components.chartLabel.append('g').selectAll('text.yrule');
      },
      linkData: function () {
        SentimentChart.components.y1Labels = SentimentChart.components.y1Labels.data(SentimentChart.data.y1.ticks(5));
      },
      enter: function () {
        SentimentChart.components.y1Labels
        .attr('class','y1labels')
        .enter().append('svg:text')
        .attr('class', 'yrule');
      },
      update: function () {
        var props = SentimentChart.properties;
        SentimentChart.components.y1Labels
        .attr('x', props.margin.left - 15)
        .attr('y', SentimentChart.data.y1)
        .attr('text-anchor', 'middle')
        .style('fill','rgb(129, 129, 129)')
        .text(String);
      },
      exit: function () {
        SentimentChart.components.y1Labels
        .exit()
        .remove();
      }
    },
    y2Labels: {
      append: function () {
        SentimentChart.components.y2Labels = SentimentChart.components.chartLabel.append('g').selectAll('text.yrule');
      },
      linkData: function () {
        SentimentChart.components.y2Labels = SentimentChart.components.y2Labels.data(SentimentChart.data.y2.ticks(5));
      },
      enter: function () {
        SentimentChart.components.y2Labels
        .attr('class','y2labels')
        .enter()
        .append('svg:text')
        .attr('class', 'yrule');
      },
      update: function () {
        var props = SentimentChart.properties;
        SentimentChart.components.y2Labels
        .attr('x', props.chartWidth + props.margin.left + 18)
        .attr('y', SentimentChart.data.y2)
        .attr('text-anchor', 'middle')
        .style('fill','rgb(129, 129, 129)')
        .text(String);
      },
      exit: function () {
        SentimentChart.components.y2Labels
        .exit()
        .remove();
      }
    },
    xLabels: {
      append: function () {
        SentimentChart.components.xLabels = SentimentChart.components.chart.selectAll('text.xrule');
      },
      linkData: function () {
        var begin = SentimentChart.data.startTime + 1800;
        var xLabelTimeStampsArray = [];
        for (var i = 0; i < 5; i++) {
          xLabelTimeStampsArray.push(begin + i*7200);
        }
        SentimentChart.components.xLabels = SentimentChart.components.xLabels.data(xLabelTimeStampsArray);
      },
      enter: function () {
        SentimentChart.components.xLabels
        .attr('class','xlabels')
        .enter()
        .append('svg:text')
        .attr('class', 'xrule')
        .attr('text-anchor', 'middle');
      },
      update: function () {
        var props = SentimentChart.properties;
        SentimentChart.components.xLabels
        .attr('x', function (d, i) { return SentimentChart.data.x(d); })
        .attr('y', props.chartHeight - 22)
        .text(function (d, i) {
          return new Date(d * 1000).getHours() + ':00';
        });
      },
      exit: function () {
        SentimentChart.components.xLabels
        .exit()
        .remove();
      }
    },
    sentimentLine: {
      append: function () {
        SentimentChart.components.sentimentLine = SentimentChart.components.chart.append('path');
      },
      linkData: function () {
        SentimentChart.components.sentimentLine = SentimentChart.components.sentimentLine.datum(SentimentChart.data.moodindexList);
      },
      update: function () {
        SentimentChart.components.sentimentLine
        .attr({
          'class':'sentiment',
          'd': d3.svg.line()
               .x(function(d,i) { return SentimentChart.data.x(d.timestamp); })
               .y(function(d) { return SentimentChart.data.y1(d.mood); })
               .interpolate('linear'),
          'stroke': '#25bcf1',
          'fill': 'none'
        });
      }
    },
    securityLines: {
      types: ['openDotted', 'lunchDotted', 'closeDotted', 'amLinear', 'pmLinear'],
      append: function () {
        SentimentChart.components.securityLines = {};
        for (var i = 0; i < this.types.length; i++) {
          SentimentChart.components.securityLines[this.types[i]] = SentimentChart.components.chart.append('path');
        }
      },
      linkData: function () {
        var data = SentimentChart.data.indexList;

        //linear
        var amLinearData = data.slice(0, 121);

        SentimentChart.components.securityLines['amLinear'] = SentimentChart.components.securityLines['amLinear'].datum(amLinearData);
        var pmLinearData = data.slice(121, data.length);

        SentimentChart.components.securityLines['pmLinear'] = SentimentChart.components.securityLines['pmLinear'].datum(pmLinearData);
        
        //dotted
        var currentTimeStamp = SentimentChart.helpers.getCurrentTimestamp();
        var currentDate = new Date(currentTimeStamp*1000);
        var dataDate = new Date(data[0].timestamp*1000);

        var notSameDay = !(dataDate.getDate() === currentDate.getDate() && dataDate.getMonth() === currentDate.getMonth());

        if (currentTimeStamp < SentimentChart.data.startTime) { return; }
        
        //start - market open
        var openDottedPrice = currentDate.getHours() < 9 ? SentimentChart.data.closePrice : data[0].price;
        var openDottedData = [{ timestamp: SentimentChart.data.startTime,
                                price: openDottedPrice
                              },
                              { timestamp: Math.min(currentTimeStamp, SentimentChart.data.startTime + 3600),
                                price: openDottedPrice
                              }];
        SentimentChart.components.securityLines['openDotted'] = SentimentChart.components.securityLines['openDotted'].datum(openDottedData);
        //lunch
        if (currentDate.getHours() > 12 || (currentDate.getHours() === 12 && currentDate.getMinutes() > 30 || notSameDay)) {
          var lunchDottedPrice = amLinearData[120].price;
          var lunchDottedData = [{
                                  timestamp: amLinearData[120].timestamp+60,
                                  price: lunchDottedPrice
                                },
                                {
                                  timestamp: Math.min(currentTimeStamp, amLinearData[120].timestamp+5400),
                                  price: lunchDottedPrice
                                }];
          SentimentChart.components.securityLines['lunchDotted'] = SentimentChart.components.securityLines['lunchDotted'].datum(lunchDottedData);
        }
        //market close
        if (currentDate.getHours() > 15 || (currentDate.getHours() === 15 && currentDate.getMinutes() > 30 || notSameDay)) {
          var closeDottedPrice = pmLinearData[120].price;
          var closeDottedData = [{
                                  timestamp: pmLinearData[120].timestamp+60,
                                  price: closeDottedPrice
                                },
                                {
                                  timestamp: Math.min(currentTimeStamp, pmLinearData[120].timestamp+9000),
                                  price: closeDottedPrice
                                }];
          SentimentChart.components.securityLines['closeDotted'] = SentimentChart.components.securityLines['closeDotted'].datum(closeDottedData);
        }
      },
      update: function () {
        var id;
        
        for (var i = 0; i < this.types.length; i++) {
          id = this.types[i];
          //general
          SentimentChart.components.securityLines[id]
          .attr({
            'class':'security',
            'stroke': '#fff',
            'fill': 'none'
          });
          if (SentimentChart.components.securityLines[id].data()[0]) {
            SentimentChart.components.securityLines[id]
            .attr('d', d3.svg.line()
                 .x(function(d,i) { return SentimentChart.data.x(d.timestamp); })
                 .y(function(d)   { return SentimentChart.data.y2(d.price); })
                 .interpolate('basis'))
          }
          //style specific
          if (id.substr(id.length - 6) === 'Dotted') {
            SentimentChart.components.securityLines[id]
            .attr('class','security-dotted')
            .style('stroke-dasharray', ('1, 3'));
          }

        }
      }
    },
    tooltip: {
      append: function () {
        SentimentChart.components.tooltip = d3.select('#sentiment-chart').append('div')
        .attr('id', 'sentiment-tooltip')
        .attr('class', 'tooltip');
      },
      update: function () {
        SentimentChart.components.tooltip
        .style('display', 'none');
      }
    },
    scatterDots: {
      append: function () {
        SentimentChart.components.scatterDots = SentimentChart.components.chart.selectAll('scatter-dots');
      },
      linkData: function () {
        SentimentChart.components.scatterDots = SentimentChart.components.scatterDots.data(SentimentChart.data.moodindexList);
      },
      enter: function () {
        SentimentChart.components.scatterDots
        .enter().append('svg:circle')  // create a new circle for each value
        .attr('fill', '#25bcf1')
        .style('opacity', 1)
        .attr('id', function (d, i) {
          return 'sd-' + i;
        });
      },
      update: function () {
        SentimentChart.components.scatterDots
        .attr('r', 4)
        .attr('cy', function (d) { return SentimentChart.data.y1(d.mood); } ) // translate y value to a pixel
        .attr('cx', function (d,i) { return SentimentChart.data.x(d.timestamp); } ); // translate x value

      },
      exit: function () {
        SentimentChart.components.scatterDots
        .exit()
        .remove();
      }
    },
    scatterDotsBubble: {
      append: function () {
        SentimentChart.components.scatterDotsBubble = SentimentChart.components.chart.selectAll('scatter-dots');
      },
      linkData: function () {
        SentimentChart.components.scatterDotsBubble = SentimentChart.components.scatterDotsBubble.data(SentimentChart.data.moodindexList);
      },
      enter: function () {
        SentimentChart.components.scatterDotsBubble
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
        SentimentChart.components.scatterDotsBubble
        .attr('transform', function (d, i) {
          return 'translate(' + (SentimentChart.data.x(d.timestamp) - 23 ) + ',' + (SentimentChart.data.y1(d.mood)-37) + ')';
        });
      },
      exit: function () {
        SentimentChart.components.scatterDotsBubble
        .exit()
        .remove();
      }
    },
    scatterDotsBubbleText: {
      append: function () {
        SentimentChart.components.scatterDotsBubbleText = SentimentChart.components.chart.selectAll('scatter-dots');
      },
      linkData: function () {
        SentimentChart.components.scatterDotsBubbleText = SentimentChart.components.scatterDotsBubbleText.data(SentimentChart.data.moodindexList);
      },
      enter: function () {
        SentimentChart.components.scatterDotsBubbleText
        .enter().append('text')  // create a new circle for each value
        .attr('class', 'sentiment')
        .attr('fill', 'white')
        .text(function(d, i){
          if (d.newsCount) { return d.newsCount; }
        });
      },
      update: function () {
        SentimentChart.components.scatterDotsBubbleText
        .attr('y', function (d) { return SentimentChart.data.y1(d.mood) - 13; } ) // translate y value to a pixel
        .attr('x', function (d,i) { return SentimentChart.data.x(d.timestamp) - 3 ; } ); // translate x value
      },
      exit: function () {
        SentimentChart.components.scatterDotsBubbleText
        .exit()
        .remove();
      }
    },
    // scatterDotsBubbleHover: {
    //   append: function () {
    //     SentimentChart.components.scatterDotsBubbleText = SentimentChart.components.chart.selectAll('scatter-dots');
    //   }
    // }
    scatterDotsHover: {
      append: function () {
        SentimentChart.components.scatterDotsHover = SentimentChart.components.chart.selectAll('scatter-dots');
      },
      linkData: function () {
        SentimentChart.components.scatterDotsHover = SentimentChart.components.scatterDotsHover.data(SentimentChart.data.moodindexList);
      },
      enter: function () {
        SentimentChart.components.scatterDotsHover
        .enter().append('svg:circle')  // create a new circle for each value
        .attr('r', 8)
        .style('opacity', 0)
        .on('mouseover', function(d, i) {
          if (!d.newsList.length) { return; }
          var dot = this;
          
          // shouldRenderLeft means the tooltip should render towards the left side of the hovered dot
          // shouldRenderBottom means the tooltip should render towards the bottom side of the hovered dot
          var shouldRenderLeft = true;
          var shouldRenderBottom = true;
          if (SentimentChart.helpers.getMousePosition(dot)[0] < SentimentChart.properties.chartWidth/2) {
            shouldRenderLeft = false;
          }
          if (SentimentChart.helpers.getMousePosition(dot)[1] > SentimentChart.properties.chartHeight/2) {
            shouldRenderBottom = false;
          }
          
          var target = d3.select('#sd-' + i);
          target.attr('r', 6);

          var arrow = (d.newsSign === '+'? 'rise':'fall');
          var moodDiff;
          if (i === 0) {
            moodDiff = ' - ';
          } else {
            var prevMood = SentimentChart.components.scatterDots.data()[i-1].mood;
            moodDiff = d.mood - prevMood;
            moodDiff = moodDiff.toFixed(2);
            if (moodDiff > 0) {
              moodDiff = '+' + moodDiff;
            }
          }
          var tooltipHeight = 59;
          var news;
          var title;
          var div = '<div class="sentiment-tooltip">\
                       <div class="tooltip-date">' + Helper.toDate(d.rdate).slice(5) + ' ' + d.clock.slice(0, -3) + '<div><a href="/">更多</a></div></div>\
                       <div class="wrapper">';

          for (var i = 0; i < d.newsList.length; i++) {
            if (i === 3) { break; }
            news = d.newsList[i]
            title = news.newsTitle.length > 11 ? news.newsTitle.slice(i, 11) + '...' : news.newsTitle.slice(i, 13);
            div +=    '<div>&nbsp;&#183;\
                         <a href="' + news.url + '" class="content" target="_blank"> ' + title + '</a>&nbsp;&nbsp;&nbsp;\
                         <div class="arrow-wrapper">\
                           <div class="arrow-text">心情影响: </div>\
                           <div class="arrow ' + arrow + '"></div>\
                           <div class="arrow-number"> ' + news.newsMood + '</div>\
                         </div>\
                       </div>'
            tooltipHeight += 22;
          }

          div +=     '</div>\
                    </div>\
                  </div>';

          var dotPosition = [d3.select(this).attr('cx'), d3.select(this).attr('cy')];
          var padding = 15;          
          var tooltipHeight;
          SentimentChart.components.tooltip
          .html(div)
          .style('left', shouldRenderLeft ? dotPosition[0] - padding - 250 + 'px' : dotPosition[0] - padding + 'px')
          .style('top', shouldRenderBottom ? dotPosition[1] - padding + 'px' : dotPosition[1] - tooltipHeight + padding + 'px')
          .on('mouseout', function () {
            var mousePosition = SentimentChart.helpers.getMousePosition(dot);
            var dotPosition = [parseInt(d3.select(dot).attr('cx')), parseInt(d3.select(dot).attr('cy'))];
            // var outOfLeft;
            // var outOfRight;
            // var outOfTop;
            // var outOfBottom;
            // if (shouldRenderLeft) {
            //   outOfLeft = mousePosition[0] < dotPosition[0] - 250 - padding;
            //   outOfRight = mousePosition[0] > dotPosition[0] + padding;
            // } else {
            //   outOfLeft = mousePosition[0] < dotPosition[0] - padding;
            //   outOfRight = mousePosition[0] > dotPosition[0] + 250 + padding;
            // }
            // if (shouldRenderBottom) {
            //   outOfTop = mousePosition[1] < dotPosition[1] - padding;
            //   outOfBottom = mousePosition[1] > dotPosition[1] + tooltipHeight - padding;
            // } else {
            //   outOfTop = mousePosition[1] < dotPosition[1] - tooltipHeight + padding;
            //   outOfBottom = mousePosition[1] > dotPosition[1] + padding;
            // }
            
            // if (outOfLeft || outOfRight || outOfTop || outOfBottom) {
            //   self.componentsBuilder.tooltip.update()
            //   self.componentsBuilder.scatterDots.update()
            // }
            var inLeft;
            var inRight;
            var inTop;
            var inBottom;

            // Make the tooltip disappear if mouseout event fires, and the mouse position is not within the bound of the tooltip
            // shouldRenderLeft means the tooltip should render towards the left side of the hovered dot
            // shouldRenderBottom means the tooltip should render towards the bottom side of the hovered dot
            if (shouldRenderLeft) {
              inLeft = mousePosition[0] > dotPosition[0] - 250 - padding;
              inRight = mousePosition[0] < dotPosition[0] + padding;
            } else {
              inLeft = mousePosition[0] > dotPosition[0] - padding;
              inRight = mousePosition[0] < dotPosition[0] + 250 + padding;
            }
            if (shouldRenderBottom) {
              inTop = mousePosition[1] > dotPosition[1] - padding;
              inBottom = mousePosition[1] < dotPosition[1] + tooltipHeight - padding;
            } else {
              inTop = mousePosition[1] > dotPosition[1] - tooltipHeight + padding;
              inBottom = mousePosition[1] < dotPosition[1] + padding;
            }
            if (!(inLeft && inRight && inTop && inBottom)) {
              SentimentChart.componentsBuilder.tooltip.update()
              SentimentChart.componentsBuilder.scatterDots.update()
            }
          })
          .style('display', 'inline-block')
        })
        .on('mouseout', function (d, i) {
        })
      },
      update: function () {
        SentimentChart.components.scatterDotsHover
        .attr('cy', function (d) { return SentimentChart.data.y1(d.mood); } ) // translate y value to a pixel
        .attr('cx', function (d,i) { return SentimentChart.data.x(d.timestamp); } );
      },
      exit: function () {
        SentimentChart.components.scatterDotsHover
        .exit()
        .remove();
      },
      style: '',
      fadeIn: '',
      fadeOut: '',
      mousePosition: []
      
    },
    sentimentCover: {
      append: function () {
        SentimentChart.components.sentimentCover = d3.select('#sentiment-chart').append('svg:svg');
      },
      update: function () {
        var props = SentimentChart.properties;
        SentimentChart.components.sentimentCover
        .style('position', 'absolute')
        .style('left', 0)
        .style('top', 7)
        .style('background-color', 'rgb(38, 38, 38)')
        .attr('width', props.chartWidth - 2)
        .attr('height', props.chartHeight - 44)
      },
      animate: function () {
        var props = SentimentChart.properties;
        SentimentChart.components.sentimentCover
        .style('left', props.chartWidth - 2)
        .attr('width', 0)
      }
    },
    sentimentOverlay: {
      append: function () {
        SentimentChart.components.sentimentOverlay = SentimentChart.components.chart.append('svg:rect');
      },
      update: function () {
        var props = SentimentChart.properties;
        SentimentChart.components.sentimentOverlay
        .style('position', 'absolute')
        .style('left', props.margin.left)
        .attr('y', 6)
        .attr('opacity', 0)
        .attr('width', props.chartWidth - 2)
        .attr('height', props.chartHeight - 44)
        .on('mousemove', function () {

          var mousePosition = SentimentChart.helpers.getMousePosition(this);

          var j = ChartView.xInverse((IE8?mousePosition[0]-55:mousePosition[0]), SentimentChart.data.x);
          var timestamp = SentimentChart.data.ordinalTimeStamps[j];
          var indexData = SentimentChart.helpers.getLastest('indexList', timestamp);
          var moodindexData = SentimentChart.helpers.getLastest('moodindexList', timestamp);
          
          if (d3.select('#sentiment-tooltip').style('display') !== 'none') {
            SentimentChart.componentsBuilder.tooltip.update();
            SentimentChart.componentsBuilder.scatterDots.update();
          }

          SentimentChart.helpers.updateLegends(indexData, moodindexData);
        })
      },
    }
  }
};
