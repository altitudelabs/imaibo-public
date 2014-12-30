var SentimentChart = {
  properties: {},
  setProperties: function(options) {
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
    this.setProperties();
    this.drawContainer();
    this.drawGraph(true);
  },
  drawContainer: function(){
    $('#sentiment-chart').empty();
    $('#sentiment-chart-label').empty();

    var data = ChartView.data;
    var containerWidth = ChartView.properties.width;
    var margin = this.properties.margin;
    var chartWidth = containerWidth - margin.left - margin.right;

    var height = this.properties.height;
    var chartHeight = height - margin.top - margin.bottom;
    var interval = this.properties.interval;
    var moodindexList = data.sentiment.moodindexList;
    var indexList = data.sentiment.indexList;

    var minMoodIndex = function (prop) {
      return d3.min(moodindexList.map(function(x) { return +x[prop]; }));
    };
    var maxMoodIndex = function (prop) {
      return d3.max(moodindexList.map(function(x) { return +x[prop]; }));
    };
    var minIndex = function (prop) {
      return d3.min(indexList.map(function(x) { return +x[prop]; }));
    };
    var maxIndex = function (prop) {
      return d3.max(indexList.map(function(x) { return +x[prop]; }));
    };
    
    var y1 = d3.scale.linear()
    .domain([ minMoodIndex('mood') + (minMoodIndex('mood')%50) - 100,  maxMoodIndex('mood') - (maxMoodIndex('mood')%50) + 100])
    // .domain([1550, 1700])
    .range([chartHeight-margin.bottom, margin.top+20]);

    var y2 = d3.scale.linear()
    .domain([minIndex('price') + (minIndex('price')%50) - 50, maxIndex('price') - (maxIndex('price')%50) + 50])
    .range([chartHeight-margin.bottom, margin.top+20]);

    var chart_label = d3.select('#sentiment-chart-label')
    .append('svg:svg')
    .attr('class', 'chart')
    .attr('width', containerWidth + 120)
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

    chart_label.append('svg:line')
    .attr('class', 'xborder-top-thick')
    .attr('x1', margin.left)
    .attr('x2', chartWidth + margin.left)
    .attr('y1', margin.top)
    .attr('y2', margin.top)
    .attr('stroke', '#464646');

    chart_label.append('svg:line')
    .attr('class', 'yborder-left')
    .attr('x1', margin.left)
    .attr('x2', margin.left)
    .attr('y1', chartHeight - margin.bottom)
    .attr('y2', margin.top)
    .attr('stroke', '#464646');

    chart_label.append('svg:line')
    .attr('class', 'yborder-right')
    .attr('x1', chartWidth + margin.left)
    .attr('x2', chartWidth + margin.left)
    .attr('y1', chartHeight - margin.bottom)
    .attr('y2', margin.top)
    .attr('stroke', '#464646');

    chart_label.append('svg:line')
    .attr('class', 'xaxis')
    .attr('x1', margin.left)
    .attr('x2', containerWidth - margin.right)
    .attr('y1', chartHeight - margin.bottom)
    .attr('y2', chartHeight - margin.bottom)
    .attr('stroke', '#464646');
    
    chart_label.append('g')
    .attr('class','y1labels')
    .selectAll('text.yrule')
    .data(y1.ticks(5))
    .enter().append('svg:text')
    .attr('class', 'yrule')
    .attr('x', margin.left - 15)
    .attr('y', y1)
    .attr('text-anchor', 'middle')
    .text(String);

    chart_label.append('g')
    .attr('class','y2labels')
    .selectAll('text.yrule')
    .data(y2.ticks(5))
    .enter().append('svg:text')
    .attr('class', 'yrule')
    .attr('x', chartWidth + margin.left + 18)
    .attr('y', y2)
    .attr('text-anchor', 'middle')
    .text(String);
  },
  drawGraph: function(isNew){
    'use strict';

    $('#sentiment-chart').empty();

    var data = ChartView.data,
    prop = ChartView.properties,
    margin = prop.margin,
    chartWidth  = prop.width - margin.left - margin.right,
    height      = this.properties.height,
    chartHeight = height - margin.top - margin.bottom,
    interval       = this.properties.interval,
    xlabels,
    gline,
    tooltip;

    var moodindexList = data.sentiment.moodindexList;
    var indexList = data.sentiment.indexList;
    for (var i = 0; i < indexList.length; i++) {
      indexList[i].timestamp = indexList[i].time;
    }
    var combinedIndexList = moodindexList.concat(indexList);
    
    var startTime = d3.min(combinedIndexList.map(function(x) { return x.timestamp; }));
    var startDate = new Date(startTime * 1000);
    
    var endTime = d3.max(combinedIndexList.map(function(x) { return x.timestamp; }));
    var endDate = new Date(endTime * 1000);

    // startTime -= ( (startDate.getHours()*3600) + (startDate.getMinutes()*60));
    // startTime -= 21600;
    endTime += (27000 - (endDate.getHours()%3*3600) + (endDate.getMinutes()*60));
    // endTime += 21600;

    startTime -= 6000;
    // endTime += 10800;
    
    // add dummy data to draw ordinal graph
    var sentimentData = [];
    var today = new Date(indexList[indexList.length-1].timestamp * 1000);
    var currentTime = startTime;
    var sentimentDataIndex = 0;
    while (currentTime <= endTime) {
      sentimentData[sentimentDataIndex] = {
        timestamp: currentTime
      };
      currentTime += 60;
      sentimentDataIndex += 1;
    }
    currentTime = startTime;

    var numberOfDate = 0;
    for (var j = 0; j < indexList.length; j++) {
      var indexData = indexList[j];
      var timeDiff = indexData.timestamp - startTime;
      var sentimentIndex = timeDiff / 60;
      sentimentData[sentimentIndex] = indexData; 
    }

    var minMoodIndex = function (prop) { return d3.min(moodindexList.map(function(x) { return +x[prop]; })); },
    maxMoodIndex = function (prop) { return d3.max(moodindexList.map(function(x) { return +x[prop]; })); },
    minIndex = function (prop) { return d3.min(indexList.map(function(x) { return +x[prop]; })); },
    maxIndex = function (prop) { return d3.max(indexList.map(function(x) { return +x[prop]; })); };
    
    var y1 = d3.scale.linear()
    .domain([ minMoodIndex('mood') + (minMoodIndex('mood')%50) - 100,  maxMoodIndex('mood') - (maxMoodIndex('mood')%50) + 100])
    .range([chartHeight+margin.top-57, margin.top]);

    var y2 = d3.scale.linear()
    .domain([minIndex('price') + (minIndex('price')%50) - 50, maxIndex('price') - (maxIndex('price')%50) + 50])
    .range([147, 27]);

    var x = d3.scale.ordinal()
    .domain(sentimentData.map(function(x) { return x.timestamp; }))
    .rangeBands([0, chartWidth]); //inversed the x axis because api came in descending order

    var chart = d3.select('#sentiment-chart')
    .append('svg:svg')
    .attr('class', 'chart')
    .attr('width', chartWidth)
    .attr('height', chartHeight);

    drawXLabels();
    // drawYLabels();
    drawSecurityLine(indexList);
    drawSentimentLine(); //drawing sentiment line last so it's on top


    function drawXLabels () {
      var xLabelInterval;
      if (chartWidth < 450) {
        xLabelInterval = 24; //hours
      } else if (chartWidth < 750) {
        xLabelInterval = 12;
      } else {
        xLabelInterval = 6;
      }

      chart.append('g')
      .attr('class','xlabels')
      .selectAll('text.xrule')
      .data(sentimentData)
      .enter().append('svg:text')
      .attr('class', 'xrule')
      .attr('x', function (d, i) { return x(d.timestamp); })
      .attr('y', chartHeight-margin.bottom-margin.top)
      .attr('text-anchor', 'middle')
      .text(function (d, i) {
        var date = new Date(d.timestamp * 1000);

        //6 hours Interval
        if (xLabelInterval === 6) {
          if ((d.timestamp + 7200) % 21600 === 0 && i !== 0) {
            return date.getDate() + '-' + date.getHours() + ':0' + date.getMinutes();
          }
        } else if (xLabelInterval === 12) {
          if ((d.timestamp - 14400) % 43200 === 0 && i !== 0) {
            return date.getDate() + '-' + date.getHours() + ':0' + date.getMinutes();
          }

        } else if (xLabelInterval === 24) {
          if (date.getHours() === 0 && date.getMinutes() === 0) {
            return date.getMonth() + '/' + date.getDate();
          }
        }
      });
    }
    // function drawYLabels () {

    //   // chart.append('g')
    //   // .attr('class','xlabels')
    //   // .selectAll('text.xrule')
    //   // .data(sentimentData)
    //   // .enter().append('svg:text')

    //   chart.append('g')
    //   .attr('class','y1labels')
    //   .selectAll('text.yrule')
    //   .data(y1.ticks(5))
    //   .enter().append('svg:text')
    //   .attr('class', 'yrule')
    //   .attr('x', margin.left - 60)
    //   .attr('y', y1)
    //   .attr('text-anchor', 'middle')
    //   .text(String);

    //   chart.append('g')
    //   .attr('class','y2labels')
    //   .selectAll('text.yrule')
    //   .data(y2.ticks(5))
    //   .enter().append('svg:text')
    //   .attr('class', 'yrule')
    //   .attr('x', chartWidth + margin.left + 18)
    //   .attr('y', y2)
    //   .attr('text-anchor', 'middle')
    //   .text(String);
    // }
    function drawSentimentLine () {

      var sentimentLine = d3.svg.line()
      .x(function(d,i) { return x(d.timestamp); })
      .y(function(d) { return y1(d.mood); })
      .interpolate('linear');

      chart.append('path')
      .datum(moodindexList)
      .attr('class','sentiment')
      .attr('d', sentimentLine)
      .attr('stroke', '#25bcf1')
      .attr('fill', 'none');

      tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip').style('opacity', 0);

      if (!HIDE) { //hiding for v1
        chart.selectAll('scatter-dots')
        .data(moodindexList)  // using the values in the ydata array
        .enter().append('path')
        .attr('d', function (d,i) {
          if (d.newsCount) { 
            return 'M29,17.375c0,6.1-3.877,11.125-6.5,11.125s-6.75-5.35-6.75-11.25c0-4.004,4.06-5.167,6.683-5.167  S29,13.371,29,17.375z';
          }
        })
        .attr('transform', function (d, i) {
          return 'translate(' + (x(d.timestamp) - 23) + ',' + (y1(d.mood)-37) + ')';
        })
        .attr('fill', function (d,i) {
          return '#31BBED'; 
        });
      
        chart.selectAll('scatter-dots')
        .data(moodindexList)  // using the values in the ydata array
        .enter().append('text')  // create a new circle for each value
        .attr('class', 'sentiment')
        .attr('y', function (d) { return y1(d.mood) - 13; } ) // translate y value to a pixel
        .attr('x', function (d,i) { return x(d.timestamp) - 4; } ) // translate x value
        .attr('fill', 'white')
        .text(function(d, i){
          if (d.newsCount) { return d.newsCount; }
        });

      }

      var tes = chart.selectAll('scatter-dots')
      .data(moodindexList)  // using the values in the ydata array
      .enter().append("svg:circle")  // create a new circle for each value
      .attr("cy", function (d) { return y1(d.mood); } ) // translate y value to a pixel
      .attr("cx", function (d,i) { return x(d.timestamp); } ) // translate x value
      .attr("r", 4)
      .attr('stroke', '#25bcf1')
      .attr('stroke-width', '1')
      .style("opacity", 1)
      .attr('id', function (d, i) {
        return 'sd-' + i;
      });

      var hoverC = chart.selectAll('scatter-dots')
      .data(moodindexList)  // using the values in the ydata array
      .enter().append('svg:circle')  // create a new circle for each value
      .attr('cy', function (d) { return y1(d.mood); } ) // translate y value to a pixel
      .attr('cx', function (d,i) { return x(d.timestamp); } ) // translate x value
      .attr('r', 8)
      .style('opacity', 0)
      .on('mouseover', function(d, i) {
        var target = d3.select('#sd-' + i);
        target.attr('fill', '#3bc1ef');
        target.attr('r', '4');
        target.attr('stroke', '#fff');
        target.attr('stroke-width', '1.5');

        var arrow = (d.newsSign === '+'? 'rise':'fall');
        var show_extra = (d.newsTitle.length < 12? 'hide':'show');

        tooltip.transition()
        .duration(200)
        .style('opacity', .9);
        tooltip.html('<div class="sentiment-tooltip">' + 
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
        .style('left', (d3.event.pageX + 8) + 'px')
        .style('top', (d3.event.pageY + 3) + 'px');
      })
      .on('mouseout', function(d, i) {
        var target = d3.select('#sd-' + i);
        target.attr('fill','#000');
        target.attr('r', '4');
        target.attr('stroke', '#25bcf1');
        target.attr('stroke-width', '1');

        tooltip.transition()
        .duration(500)
        .style('opacity', 0);
      });
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
        //initial dotted line
        if (i === 0) {
          dotted.push(data.slice(i, 1));
          var timestamp = dotted[0][0].timestamp - (dotted[0][0].timestamp%86400);
          dotted[0].unshift({
            timestamp: timestamp+1,
            price: dotted[0][0].price
          });
        }


        if ( data[i+1].timestamp - data[i].timestamp > 3590) {
          //linear graph
          linear.push(data.slice(start, i));
          
          //straight dotted line
          var dottedArray = data.slice(i, i+1)
                            .concat([{
                              timestamp: data[i+1].timestamp,
                              price: data[i].price
                            }]);
          dotted.push(dottedArray);
          
          // //vertical linear line right after dotted line
          // linear.push([
          //   {
          //     timestamp: data[i+1].timestamp,
          //     price: data[i].price
          //   }, 
          //   {
          //     timestamp: data[i+1].timestamp,
          //     price: data[i+1].price
          //   }
          // ]);

          start = i+1;
        }
      }
      linear.push(data.slice(start, data.length-1)); //last bit of data

      //last dotted line if no real data for longer than a minute
      // var now = new Date().getTime();
      // now = (now - now%1000)/1000;
      // var lastData = data[data.length-1];
      // if (now - lastData.timestamp > 60) {
      //   dotted.push([lastData, {
      //     timestamp: lastData.timestamp - 1,
      //     price: lastData.price
      //   }]);
      // }

      for (var j = 0; j < linear.length; j++) {
        drawLinear(linear[j]);
      }
      for (var k = 0; k < dotted.length; k++) {
        drawDotted(dotted[k]);
      }

      function drawLinear (data) {
        chart.append('path')
        .datum(data)
        .attr('class','security')
        .attr('d', securityLine)
        .attr('stroke', '#fff')
        .attr('fill', 'none')
        .style('stroke');
      }

      function drawDotted (data) {
        chart.append('path')
        .datum(data)
        .attr('class','security')
        .attr('d', securityLine)
        .attr('stroke', '#fff')
        .attr('fill', 'none')
        .style('stroke-dasharray', ('1, 3'));
      }
    }
  },
};

