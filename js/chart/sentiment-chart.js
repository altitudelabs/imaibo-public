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
    };
    if (options) {
      for (var key in options) {
        properties[key] = options[key];
      }
    }
    this.properties = $.extend(true, {}, properties);
  },
  init: function(){
    'use strict';
    this.setProperties();
    this.updateData();
    this.drawContainer();
    this.drawGraph();
  },
  update: function (hasNewData) {
    'use strict';
    if (hasNewData) {
      this.updateData();
    }
    this.updateContainer();
    this.updateGraph(hasNewData);
  },
  updateData: function () {
    'use strict';

    var self = this;
    var moodindexList = ChartView.data.sentiment.moodindexList;
    var indexList = ChartView.data.sentiment.indexList;
    //filtering out non trading days
    moodindexList = moodindexList.filter(function (x) {
      if (!!x.isTradingDay && !!x.timestamp) {
        return true;
      } else {
        return false;
      }
    });
    indexList = indexList.filter(function (x) {
      if (!!x.timestamp) {
        return true;
      } else {
        return false;
      }
    });
    self.data.moodindexList = moodindexList;
    self.data.indexList = indexList;
  },
  drawContainer: function(){
    'use strict';
    var self = this;

    var containerWidth = ChartView.properties.width;
    var margin = this.properties.margin;
    var chartWidth = containerWidth - margin.left - margin.right;

    var height = this.properties.height;
    var chartHeight = height - margin.top - margin.bottom;

    var isEmpty = self.data.moodindexList.length == 0;

    var minY1 = self.helpers.minIndex('mood', self.data.moodindexList);
    var maxY1 = self.helpers.maxIndex('mood', self.data.moodindexList);
    var minY2 = self.helpers.minIndex('price', self.data.indexList);
    var maxY2 = self.helpers.maxIndex('price', self.data.indexList);

    var y1 = self.helpers.y(minY1 + (minY1%50) - 100, maxY1 - (maxY1%50) + 100);
    var y2 = self.helpers.y(minY2 + (minY2%50) - 50, maxY2 - (maxY2%50) + 50);

    self.components.chartLabel = self.components.chartLabel || d3.select('#sentiment-chart-label').append('svg:svg');
    self.components.topBorder = self.components.topBorder || self.components.chartLabel.append('svg:line');
    self.components.rightBorder = self.components.rightBorder || self.components.chartLabel.append('svg:line');
    self.components.bottomBorder = self.components.bottomBorder || self.components.chartLabel.append('svg:line');
    self.components.leftBorder = self.components.leftBorder || self.components.chartLabel.append('svg:line');
    self.components.y1Labels = self.components.y1Labels || self.components.chartLabel.append('g').selectAll('text.yrule').data(y1.ticks(5));
    self.components.y2Labels = self.components.y2Labels || self.components.chartLabel.append('g').selectAll('text.yrule').data(y2.ticks(5));

    self.components.chartLabel
    .attr('class', 'chart')
    .attr('width', containerWidth)
    .attr('height', chartHeight);

    $('#sentiment-chart-container').slimScroll({
      height: (chartHeight+20).toString() + 'px',
      width: chartWidth.toString() + 'px',
      color: '#ffcc00'
    });

    $('#sentiment-chart-container').css('top', 0);

    $('#sentiment > .slimScrollDiv')
    .css('position', 'absolute')
    .css('top', '39px')
    .css('left', '45px')
    .css('width', chartWidth.toString() + 'px');

    self.components.topBorder
    .attr('class', 'xborder-top-thick')
    .attr('x1', margin.left)
    .attr('x2', chartWidth + margin.left)
    .attr('y1', margin.top)
    .attr('y2', margin.top)
    .attr('stroke', '#464646');

    self.components.rightBorder
    .attr('class', 'yborder-right')
    .attr('x1', chartWidth + margin.left)
    .attr('x2', chartWidth + margin.left)
    .attr('y1', chartHeight - margin.bottom)
    .attr('y2', margin.top)
    .attr('stroke', '#464646');

    self.components.bottomBorder
    .attr('class', 'xaxis')
    .attr('x1', margin.left)
    .attr('x2', containerWidth - margin.right)
    .attr('y1', chartHeight - margin.bottom)
    .attr('y2', chartHeight - margin.bottom)
    .attr('stroke', '#464646');
    
    self.components.leftBorder
    .attr('class', 'yborder-left')
    .attr('x1', margin.left)
    .attr('x2', margin.left)
    .attr('y1', chartHeight - margin.bottom)
    .attr('y2', margin.top)
    .attr('stroke', '#464646');

    if(!isEmpty) {
      self.components.y1Labels
      .attr('class','y1labels')
      .enter().append('svg:text')
      .attr('class', 'yrule');

      self.components.y1Labels
      .attr('x', margin.left - 15)
      .attr('y', y1)
      .attr('text-anchor', 'middle')
      .text(String);

      self.components.y2Labels
      .attr('class','y2labels')
      .enter()
      .append('svg:text')
      .attr('class', 'yrule');

      self.components.y2Labels
      .attr('x', chartWidth + margin.left + 18)
      .attr('y', y2)
      .attr('text-anchor', 'middle')
      .text(String);
    }
  },
  updateContainer: function (hasNewData) {
    'use strict';

    var self = this;

    var containerWidth = ChartView.properties.width;
    var margin = this.properties.margin;
    var chartWidth = containerWidth - margin.left - margin.right;

    self.components.chartLabel
    .attr('width', containerWidth);

    $('#sentiment-chart-container').css('width', chartWidth.toString());
    
    $('#sentiment > .slimScrollDiv')
    .css('position', 'absolute')
    .css('top', '39px')
    .css('left', '45px')
    .css('width', chartWidth.toString() + 'px');

    self.components.topBorder
    .attr('x2', chartWidth + margin.left);

    self.components.rightBorder
    .attr('x1', chartWidth + margin.left)
    .attr('x2', chartWidth + margin.left);

    self.components.bottomBorder
    .attr('x2', containerWidth - margin.right);

    self.components.y1Labels
    .attr('x', margin.left - 15);

    self.components.y2Labels
    .attr('x', chartWidth + margin.left + 18);
  },
  drawGraph: function(){
    'use strict';

    var self = this;

    var prop = ChartView.properties,
    margin = prop.margin,
    chartWidth  = prop.width - margin.left - margin.right,
    height      = this.properties.height,
    chartHeight = height - margin.top - margin.bottom;

    var moodindexList = self.data.moodindexList;
    var indexList = self.data.indexList;
    var isEmpty = moodindexList.length == 0;

    if(isEmpty) {
      $('#sentiment-chart-container').append('<div class="empty-data">暂时无法下载数据，请稍后再试</div>');
    }

    //filtering out non trading days
    moodindexList = moodindexList.filter(function (x) {
      if (!!x.isTradingDay && !!x.timestamp) {
        return true;
      } else {
        return false;
      }
    });

    indexList = indexList.filter(function (x) {
      if (!!x.timestamp) {
        return true;
      }
    });

    var combinedIndexList = moodindexList.concat(indexList);

    var startTime = d3.min(combinedIndexList.map(function(x) { return x.timestamp; }));
    
    var endTime = new Date().getTime();
    endTime = (endTime - endTime%1000)/1000;
    var endDate = new Date(endTime * 1000);
    
    var allTimeStampsArray = combinedIndexList.map(function (x) { 
        return x.timestamp;
    });

    //timeStampsArray will only be used to draw ordinal x axis
    var ordinalTimeStamps = getOrdinalTimeStampsArray(allTimeStampsArray);
    var xLabelInterval;
    if (chartWidth < 450) {
      xLabelInterval = 24; //hours
    } else if (chartWidth < 1000) {
      xLabelInterval = 12;
    } else {
      xLabelInterval = 6;
    }

    var minY1 = self.helpers.minIndex('mood', self.data.moodindexList);
    var maxY1 = self.helpers.maxIndex('mood', self.data.moodindexList);
    var minY2 = self.helpers.minIndex('price', self.data.indexList);
    var maxY2 = self.helpers.maxIndex('price', self.data.indexList);

    var y1 = self.helpers.y(minY1 + (minY1%50) - 100, maxY1 - (maxY1%50) + 100);
    var y2 = self.helpers.y(minY2 + (minY2%50) - 50, maxY2 - (maxY2%50) + 50);
    var x = self.helpers.x(chartWidth, ordinalTimeStamps);

    self.components.chart = d3.select('#sentiment-chart').append('svg:svg');
    self.components.xLabels = self.components.chart.selectAll('text.xrule').data(getXLabelTimeStampsArray(ordinalTimeStamps));
    self.components.sentimentLine = self.components.chart.append('path').datum(self.data.moodindexList);
    self.components.securityLines = [];
    self.components.tooltip = d3.select('body').append('div');
    self.components.scatterDots = self.components.chart.selectAll('scatter-dots').data(self.data.moodindexList);
    self.components.scatterDotsBubble = self.components.chart.selectAll('scatter-dots').data(self.data.moodindexList);
    self.components.scatterDotsBubbleText = self.components.chart.selectAll('scatter-dots').data(self.data.moodindexList);
    self.components.scatterDotsHover = self.components.chart.selectAll('scatter-dots').data(self.data.moodindexList);
    var chart = self.components.chart;

    self.components.chart
    .attr('class', 'chart')
    .attr('width', chartWidth)
    .attr('height', chartHeight);

    drawXLabels();
    drawSecurityLine(self.data.indexList);
    drawSentimentLine(); //drawing sentiment line last so it's on top
    

    function getOrdinalTimeStampsArray (allTimeStamps) {
      var timeStamps = [];
      var previousTimeStamp,
          currentTimeStamp;
      for (var j = 0; j < allTimeStamps.length; j++) {
        currentTimeStamp = allTimeStamps[j];
        previousTimeStamp = allTimeStamps[j-1];
        if (j === 0) {
          previousTimeStamp = startTime - 9000; // x padding on the left
          timeStamps.push(previousTimeStamp);
        } else {
          if (currentTimeStamp - previousTimeStamp >= 86400) {
            var diff = currentTimeStamp - previousTimeStamp;
            var days = diff - (diff%86400);
            previousTimeStamp = previousTimeStamp + days - (previousTimeStamp%86400) + 57600;
            timeStamps.push(previousTimeStamp);
          }
        }
        if (j === allTimeStamps.length - 1) {
          currentTimeStamp = endTime - ((endDate.getHours()%3*3600) + (endDate.getMinutes()*60) + (endDate.getSeconds())); // x padding on the right
          currentTimeStamp += 18000;
        }
        while (previousTimeStamp < currentTimeStamp) {
          timeStamps.push(previousTimeStamp+=60);
        }
      }
      return timeStamps;
    }
    function getXLabelTimeStampsArray (timeStampsArray) {
      var xLabelTimeStampsArray = timeStampsArray.filter(function (e) {
        var date = new Date(e * 1000);
        if ((e + 7200) % 21600 === 0) {
          return true;
        }
      });
      return xLabelTimeStampsArray;
    }
    function drawXLabels () {
      self.components.xLabels
      .attr('class','xlabels')
      .enter()
      .append('svg:text')
      .attr('class', 'xrule')
      .attr('text-anchor', 'middle');

      self.components.xLabels
      .attr('x', function (d, i) { return x(d); })
      .attr('y', chartHeight-margin.bottom-margin.top)
      .text(function (d, i) {
        var date = new Date(d * 1000);
        if (xLabelInterval === 24) {
          if ((d - 14400) % 86400 === 0) {
            return date.getMonth()+1 + '/' + (date.getDate()<10 ? '0' + date.getDate() : date.getDate());
          }
        } else if (xLabelInterval === 12) {
          if ((d - 14400) % 43200 === 0) {
            if (date.getHours() + date.getMinutes() === 0) {
              return date.getMonth()+1 + '/' + date.getDate();
            } else {
              return date.getMonth()+1 + '/' + date.getDate() + ' ' + date.getHours() + ':0' + date.getMinutes();
            }
          }
        } else if (xLabelInterval === 6) {
          if ((d + 7200) % 21600 === 0) {
            return date.getMonth()+1 + '/' + date.getDate() + ' ' + date.getHours() + ':0' + date.getMinutes();
          }
        }

      });
      self.components.xLabels
      .exit()
      .remove();
    } 
    function drawSentimentLine () {
      var sentimentLine = d3.svg.line()
      .x(function(d,i) { return x(d.timestamp); })
      .y(function(d) { return y1(d.mood); })
      .interpolate('linear');

      self.components.sentimentLine
      .attr('class','sentiment')
      .attr('d', sentimentLine)
      .attr('stroke', '#25bcf1')
      .attr('fill', 'none');

      self.components.tooltip
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .attr('id', 'sentiment-tooltip');

      if (!HIDE) { //hiding for v1

        // var newDots = self.components.scatterDots
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

        self.components.scatterDotsBubble
        .attr('transform', function (d, i) {
          return 'translate(' + (x(d.timestamp) - 23) + ',' + (y1(d.mood)-37) + ')';
        });

        // self.components.scatterDotsBubble
        // .exit()
        // .remove();

        self.components.scatterDotsBubbleText
        .enter().append('text')  // create a new circle for each value
        .attr('class', 'sentiment')
        .attr('fill', 'white')
        .text(function(d, i){
          if (d.newsCount) { return d.newsCount; }
        });

        self.components.scatterDotsBubbleText
        .attr('y', function (d) { return y1(d.mood) - 13; } ) // translate y value to a pixel
        .attr('x', function (d,i) { return x(d.timestamp) - 4; } ); // translate x value

      }


      self.components.scatterDots
      .enter().append('svg:circle')  // create a new circle for each value
      .attr('r', 4)
      .attr('stroke', '#25bcf1')
      .attr('stroke-width', '1')
      .style('opacity', 1)
      .attr('id', function (d, i) {
        return 'sd-' + i;
      });

      self.components.scatterDots
      .attr('cy', function (d) { return y1(d.mood); } ) // translate y value to a pixel
      .attr('cx', function (d,i) { return x(d.timestamp); } ); // translate x value
     
      self.components.scatterDots
      .exit()
      .remove();

      var style, fadeIn, fadeOut;

      self.components.scatterDotsHover
      .enter().append('svg:circle')  // create a new circle for each value
      .attr('r', 8)
      .style('opacity', 0)
      .on('mouseover', function(d, i) {
        var xPos;
        var yPos;
        
        if(IE8){
          xPos = event.clientX;
          yPos = event.clientY;
          style = 'display';
          fadeIn = 'inline-block';
          fadeOut = 'none';
        }else{
          xPos = d3.event.pageX + 8;
          yPos = d3.event.pageY + 3;
          style = 'opacity';
          fadeIn = 1;
          fadeOut = 0;
        }

        var target = d3.select('#sd-' + i);
        target.attr('fill', '#3bc1ef');
        target.attr('r', '4');
        target.attr('stroke', '#fff');
        target.attr('stroke-width', '1.5');

        var arrow = (d.newsSign === '+'? 'rise':'fall');
        var show_extra = (d.newsTitle.length < 12? 'hide':'show');

        self.components.tooltip.transition()
        .duration(200)
        .style(style, fadeIn);
        self.components.tooltip.html('<div class="sentiment-self.components.tooltip sentiment-tooltip">' + 
                        '<div class="tooltip-date"> 日期： &nbsp;' + Helper.toDate(d.rdate) + ' &nbsp;&nbsp;&nbsp;' + d.clock.slice(0, -3) + '</div>' +
                        '<div class="wrapper">' +
                          '<div class="mood"> 心情指数： ' + d.mood +             '</div>' +
                          '<div>' +
                            '<div class="arrow ' + arrow + '">                     </div>' +
                            '<div class="content"> ' + d.newsTitle.slice(0, 12) + '</div>' +
                            '<div class="extra ' + show_extra + '">...</div>' +
                          '</div>' +
                        '</div>' +
                     '</div>')
        .style('left', xPos + 'px')
        .style('top', yPos + 'px');
      })
      .on('mouseout', function(d, i) {
        var target = d3.select('#sd-' + i);
        target.attr('fill','#000');
        target.attr('r', '4');
        target.attr('stroke', '#25bcf1');
        target.attr('stroke-width', '1');

        self.components.tooltip.transition()
        .duration(500)
        .style(style, fadeOut);
      });

      self.components.scatterDotsHover
      .attr('cy', function (d) { return y1(d.mood); } ) // translate y value to a pixel
      .attr('cx', function (d,i) { return x(d.timestamp); } ); // translate x value
    }
    function drawSecurityLine (data) {
      var securityLine = d3.svg.line()
      .x(function(d,i) { return x(d.timestamp); })
      .y(function(d)   { return y2(+d.price); })
      .interpolate('basis');

      var linear = [];
      var dotted = [];
      var start = 0;
      for (var i = 0; i < data.length-1; i++) {
        var dottedArray;
        var linearArray;
        //initial dotted line
        if (i === 0) {
          var timestamp = data.slice(i, 1)[0].timestamp - (data.slice(i, 1)[0].timestamp%86400);
          
          // dotted.push(data.slice(i, 1));
          // dotted[0].unshift({
          //   timestamp: timestamp+1,
          //   price: dotted[0][0].price
          // });

          dottedArray = data.slice(i, 1).unshift({
            timestamp: timestamp+1,
            price: data.slice(i, 1)[0].price
          });
          drawDotted(dottedArray);
        }

        if ( data[i+1].timestamp - data[i].timestamp > 3590) {
          //linear graph
          linearArray = data.slice(start, i);
          drawLinear(linearArray);
          
          //straight dotted line
          dottedArray = data.slice(i, i+1)
                            .concat([{
                              timestamp: data[i+1].timestamp,
                              price: data[i].price
                            }]);
          drawDotted(dottedArray);
          // //vertical linear line right after dotted line
          // linearArray = [
          //   {
          //     timestamp: data[i+1].timestamp,
          //     price: data[i].price
          //   }, 
          //   {
          //     timestamp: data[i+1].timestamp,
          //     price: data[i+1].price
          //   }
          // ];
          // drawLinear(linearArray);

          start = i+1;
        }
      }
      drawLinear(data.slice(start, data.length-1)); //last bit of data

      // last dotted line if no real data for longer than a minute
      var lastData = data[data.length-1];
      if (!!lastData && endTime - lastData.timestamp > 60) {
        drawDotted([lastData, {
          timestamp: (endTime - endTime%60),
          price: lastData.price
        }]);
      }

      function drawLinear (data) {
        var linearPath = chart.append('path')
        .datum(data);
        
        self.components.securityLines.push(linearPath);
        
        linearPath
        .attr('class','security')
        .attr('class','security-linear')
        .attr('d', securityLine)
        .attr('stroke', '#fff')
        .attr('fill', 'none')
        .style('stroke');
      }
      function drawDotted (data) {
        var dottedPath = chart.append('path')
        .datum(data);
        self.components.securityLines.push(dottedPath);
        
        dottedPath
        .attr('class','security')
        .attr('class','security-dotted')
        .attr('d', securityLine)
        .attr('stroke', '#fff')
        .attr('fill', 'none')
        .style('stroke-dasharray', ('1, 3'));
      }
    }
  },
  updateGraph: function (hasNewData) {
    'use strict';
    var self = this;

    var prop = ChartView.properties,
    margin = prop.margin,
    chartWidth  = prop.width - margin.left - margin.right,
    height      = this.properties.height,
    chartHeight = height - margin.top - margin.bottom;

    var moodindexList = self.data.moodindexList;
    var indexList = self.data.indexList;

    //filtering out non trading days
    moodindexList = moodindexList.filter(function (x) {
       if (!!x.isTradingDay && !!x.timestamp) {
        return true;
      } else {
        return false;
      }
    });

    indexList = indexList.filter(function (x) {
      if (!!x.timestamp) {
        return true;
      }
    });

    var combinedIndexList = moodindexList.concat(indexList);

    var allTimeStampsArray = combinedIndexList.map(function (x) { 
        return x.timestamp;
    });

    var startTime = d3.min(combinedIndexList.map(function(x) { return x.timestamp; }));
    
    var endTime = new Date().getTime();
    endTime = (endTime - endTime%1000)/1000;
    var endDate = new Date(endTime * 1000);

    //timeStampsArray will only be used to draw ordinal x axis
    var minMoodIndex = function (prop) { return d3.min(moodindexList.map(function(x) { return +x[prop]; })); },
    maxMoodIndex = function (prop) { return d3.max(moodindexList.map(function(x) { return +x[prop]; })); },
    minIndex = function (prop) { return d3.min(indexList.map(function(x) { return +x[prop]; })); },
    maxIndex = function (prop) { return d3.max(indexList.map(function(x) { return +x[prop]; })); };
    var ordinalTimeStamps = getOrdinalTimeStampsArray(allTimeStampsArray);

    var xLabelInterval;

    if (chartWidth < 450) {
      xLabelInterval = 24; //hours
    } else if (chartWidth < 1000) {
      xLabelInterval = 12;
    } else {
      xLabelInterval = 6;
    }
    var minY1 = self.helpers.minIndex('mood', moodindexList);
    var maxY1 = self.helpers.maxIndex('mood', moodindexList);
    var minY2 = self.helpers.minIndex('price', indexList);
    var maxY2 = self.helpers.maxIndex('price', indexList);

    var y1 = self.helpers.y(minY1 + (minY1%50) - 100, maxY1 - (maxY1%50) + 100);
    var y2 = self.helpers.y(minY2 + (minY2%50) - 50, maxY2 - (maxY2%50) + 50);
    var x = self.helpers.x(chartWidth, ordinalTimeStamps);

    self.components.chart
    .attr('width', chartWidth);

    //update components is there is new data;
    if (hasNewData) {
      self.components.xLabels = self.components.xLabels.data(getXLabelTimeStampsArray(ordinalTimeStamps));
      self.components.sentimentLine = self.components.sentimentLine.datum(moodindexList);
      self.components.scatterDots = self.components.scatterDots.data(moodindexList);
      self.components.scatterDotsBubble = self.components.scatterDotsBubble.data(moodindexList);
      self.components.scatterDotsBubbleText = self.components.scatterDotsBubbleText.data(moodindexList);
      self.components.scatterDotsHover = self.components.scatterDotsHover.data(moodindexList);
      
      //redrawing securityLines. refactor later
      for (var i = 0; i < self.components.securityLines.length; i++) {
        self.components.securityLines[i].remove();
      }
      self.components.securityLines = [];
      

      self.components.scatterDots
      .enter().append('svg:circle')  // create a new circle for each value
      .attr('r', 4)
      .attr('stroke', '#25bcf1')
      .attr('stroke-width', '1')
      .style('opacity', 1)
      .attr('id', function (d, i) {
        return 'sd-' + i;
      });

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

      self.components.scatterDotsBubbleText
      .enter().append('text')  // create a new circle for each value
      .attr('class', 'sentiment')
      .attr('fill', 'white')
      .text(function(d, i){
        if (d.newsCount) { return d.newsCount; }
      });
      
      var style, fadeIn, fadeOut;

      self.components.scatterDotsHover
      .enter().append('svg:circle')  // create a new circle for each value
      .attr('r', 8)
      .style('opacity', 0)
      .on('mouseover', function(d, i) {
        var xPos;
        var yPos;
        
        if(IE8){
          xPos = event.clientX;
          yPos = event.clientY;
          style = 'display';
          fadeIn = 'inline-block';
          fadeOut = 'none';
        }else{
          xPos = d3.event.pageX + 8;
          yPos = d3.event.pageY + 3;
          style = 'opacity';
          fadeIn = 1;
          fadeOut = 0;
        }

        var target = d3.select('#sd-' + i);
        target.attr('fill', '#3bc1ef');
        target.attr('r', '4');
        target.attr('stroke', '#fff');
        target.attr('stroke-width', '1.5');

        var arrow = (d.newsSign === '+'? 'rise':'fall');
        var show_extra = (d.newsTitle.length < 12? 'hide':'show');

        self.components.tooltip.transition()
        .duration(200)
        .style(style, fadeIn);
        self.components.tooltip.html('<div class="sentiment-self.components.tooltip sentiment-tooltip">' + 
                        '<div class="tooltip-date"> 日期： &nbsp;' + Helper.toDate(d.rdate) + ' &nbsp;&nbsp;&nbsp;' + d.clock.slice(0, -3) + '</div>' +
                        '<div class="wrapper">' +
                          '<div class="mood"> 心情指数： ' + d.mood +             '</div>' +
                          '<div>' +
                            '<div class="arrow ' + arrow + '">                     </div>' +
                            '<div class="content"> ' + d.newsTitle.slice(0, 12) + '</div>' +
                            '<div class="extra ' + show_extra + '">...</div>' +
                          '</div>' +
                        '</div>' +
                     '</div>')
        .style('left', xPos + 'px')
        .style('top', yPos + 'px');
      })
      .on('mouseout', function(d, i) {
        var target = d3.select('#sd-' + i);
        target.attr('fill','#000');
        target.attr('r', '4');
        target.attr('stroke', '#25bcf1');
        target.attr('stroke-width', '1');

        self.components.tooltip.transition()
        .duration(500)
        .style(style, fadeOut);
      });

      self.components.xLabels
      .attr('class','xlabels')
      .enter()
      .append('svg:text')
      .attr('class', 'xrule')
      .attr('text-anchor', 'middle');
      //redrawing securityLines. refactor later
      reDrawSecurityLine(self.data.indexList);
    }

    var securityLine = d3.svg.line()
    .x(function(d,i) { return x(d.timestamp); })
    .y(function(d)   { return y2(+d.price); })
    .interpolate('basis');
    
    for (var j = 0; j < self.components.securityLines.length; j++) {
      self.components.securityLines[j]
      .attr('d', securityLine);
    }

    var sentimentLine = d3.svg.line()
    .x(function(d,i) { return x(d.timestamp); })
    .y(function(d) { return y1(d.mood); })
    .interpolate('linear');

    self.components.sentimentLine
    .attr('d', sentimentLine);

    self.components.scatterDots
    .attr('cy', function (d) { return y1(d.mood); } ) // translate y value to a pixel
    .attr('cx', function (d,i) { return x(d.timestamp); } ); // translate x value
     
    self.components.scatterDotsBubble
    .attr('transform', function (d, i) {
      return 'translate(' + (x(d.timestamp) - 23) + ',' + (y1(d.mood)-37) + ')';
    });
    
    self.components.scatterDotsBubbleText
    .attr('y', function (d) { return y1(d.mood) - 13; } ) // translate y value to a pixel
    .attr('x', function (d,i) { return x(d.timestamp) - 4; } ); // translate x value

    self.components.scatterDotsHover
    .attr('cy', function (d) { return y1(d.mood); } ) // translate y value to a pixel
    .attr('cx', function (d,i) { return x(d.timestamp); } ); // translate x value
    
    self.components.xLabels
    .attr('x', function (d, i) { return x(d); })
    .attr('y', chartHeight-margin.bottom-margin.top)
    .text(function (d, i) {
      var date = new Date(d * 1000);
      if (xLabelInterval === 24) {
        if ((d - 14400) % 86400 === 0) {
          return date.getMonth()+1 + '/' + (date.getDate()<10 ? '0' + date.getDate() : date.getDate());
        }
      } else if (xLabelInterval === 12) {
        if ((d - 14400) % 43200 === 0) {
          if (date.getHours() + date.getMinutes() === 0) {
            return date.getMonth()+1 + '/' + date.getDate();
          } else {
            return date.getMonth()+1 + '/' + date.getDate() + ' ' + date.getHours() + ':0' + date.getMinutes();
          }
        }
      } else if (xLabelInterval === 6) {
        if ((d + 7200) % 21600 === 0) {
          return date.getMonth()+1 + '/' + date.getDate() + ' ' + date.getHours() + ':0' + date.getMinutes();
        }
      }

    });
    
    function getOrdinalTimeStampsArray (allTimeStamps) {
      var timeStamps = [];
      var previousTimeStamp,
          currentTimeStamp;
      for (var j = 0; j < allTimeStamps.length; j++) {
        currentTimeStamp = allTimeStamps[j];
        previousTimeStamp = allTimeStamps[j-1];
        if (j === 0) {
          previousTimeStamp = startTime - 9000; // x padding on the left
          timeStamps.push(previousTimeStamp);
        } else {
          if (currentTimeStamp - previousTimeStamp >= 86400) {
            var diff = currentTimeStamp - previousTimeStamp;
            var days = diff - (diff%86400);
            previousTimeStamp = previousTimeStamp + days - (previousTimeStamp%86400) + 57600;

            timeStamps.push(previousTimeStamp);
          }
        }
        if (j === allTimeStamps.length - 1) {
          // var currentDate = new Date(currentTimeStamp * 1000);

          currentTimeStamp = endTime - ((endDate.getHours()%3*3600) + (endDate.getMinutes()*60) + (endDate.getSeconds())); // x padding on the right
          currentTimeStamp += 18000;
        }
        while (previousTimeStamp < currentTimeStamp) {
          timeStamps.push(previousTimeStamp+=60);
        }
      }
      return timeStamps;
    }
    function getXLabelTimeStampsArray (timeStampsArray) {
      var xLabelTimeStampsArray = timeStampsArray.filter(function (e) {
        var date = new Date(e * 1000);
        if ((e + 7200) % 21600 === 0) {
          return true;
        }
      });
      return xLabelTimeStampsArray;
    }

    //should not be redrawing. refactore later
    function reDrawSecurityLine (data) {
      var securityLine = d3.svg.line()
      .x(function(d,i) { return x(d.timestamp); })
      .y(function(d)   { return y2(+d.price); })
      .interpolate('basis');

      var linear = [];
      var dotted = [];
      var start = 0;
      for (var i = 0; i < data.length-1; i++) {
        var dottedArray;
        var linearArray;
        //initial dotted line
        if (i === 0) {
          var timestamp = data.slice(i, 1)[0].timestamp - (data.slice(i, 1)[0].timestamp%86400);
          
          // dotted.push(data.slice(i, 1));
          // dotted[0].unshift({
          //   timestamp: timestamp+1,
          //   price: dotted[0][0].price
          // });

          dottedArray = data.slice(i, 1).unshift({
            timestamp: timestamp+1,
            price: data.slice(i, 1)[0].price
          });
          drawDotted(dottedArray);
        }

        if ( data[i+1].timestamp - data[i].timestamp > 3590) {
          //linear graph
          linearArray = data.slice(start, i);
          drawLinear(linearArray);
          
          //straight dotted line
          dottedArray = data.slice(i, i+1)
                            .concat([{
                              timestamp: data[i+1].timestamp,
                              price: data[i].price
                            }]);
          drawDotted(dottedArray);
          // //vertical linear line right after dotted line
          // linearArray = [
          //   {
          //     timestamp: data[i+1].timestamp,
          //     price: data[i].price
          //   }, 
          //   {
          //     timestamp: data[i+1].timestamp,
          //     price: data[i+1].price
          //   }
          // ];
          // drawLinear(linearArray);

          start = i+1;
        }
      }
      drawLinear(data.slice(start, data.length-1)); //last bit of data

      // last dotted line if no real data for longer than a minute
      var lastData = data[data.length-1];
      if (!!lastData && endTime - lastData.timestamp > 60) {
        drawDotted([lastData, {
          timestamp: (endTime - endTime%60),
          price: lastData.price
        }]);
      }

      function drawLinear (data) {
        var linearPath = self.components.chart.append('path')
        .datum(data);
        
        self.components.securityLines.push(linearPath);
        
        linearPath
        .attr('class','security')
        .attr('class','security-linear')
        .attr('d', securityLine)
        .attr('stroke', '#fff')
        .attr('fill', 'none')
        .style('stroke');
      }
      function drawDotted (data) {
        var dottedPath = self.components.chart.append('path')
        .datum(data);
        self.components.securityLines.push(dottedPath);
        
        dottedPath
        .attr('class','security')
        .attr('class','security-dotted')
        .attr('d', securityLine)
        .attr('stroke', '#fff')
        .attr('fill', 'none')
        .style('stroke-dasharray', ('1, 3'));
      }
    }
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
    }
  }
};
