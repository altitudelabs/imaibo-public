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
    
    var sentimentData = [];
    sentimentData[1439] = 0;

    var y1 = d3.scale.linear()
    .domain([1500 , 1600])
    .range([chartHeight-margin.bottom, margin.top+20]);

    var y2 = d3.scale.linear()
    .domain([d3.min(indexList.map(function(x) { return +x.price; })), d3.max(indexList.map(function(x){return +x.price; }))])
    .range([chartHeight-margin.bottom, margin.top+20]);

    var seven_am = moodindexList[0].timestamp; //seven_am in epoch time
    var min_before_midnight = seven_am + 61140; //the same day as seven_am

    var x = d3.scale.ordinal()
    .domain(sentimentData)
    .rangePoints(40, [margin.left, chartWidth + margin.left ]);

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
    zoomFactor     = prop.zoomFactor,
    graphWidth     = chartWidth * zoomFactor,
    interval       = this.properties.interval,
    xlabels,
    gline,
    tooltip;

    var moodindexList = data.sentiment.moodindexList;
    var indexList = data.sentiment.indexList;

    var startTime = d3.min(indexList.map(function(x) { return x.time; }));
    var endTime = d3.max(indexList.map(function(x) { return x.time; }));

    var sentimentData = [];
    var today = new Date(indexList[indexList.length-1].time * 1000);
    var currentTime = startTime;
    var sentimentDataIndex = 0;
    while (currentTime <= endTime) {
      sentimentData[sentimentDataIndex] = {
        time: currentTime
      };
      currentTime += 60;
      sentimentDataIndex += 1;
    }

    var numberOfDate = 0;
    for (var j = 0; j < indexList.length; j++) {
      var indexData = indexList[j];
      var timeDiff = indexData.time - startTime;
      var sentimentIndex = timeDiff / 60;
      sentimentData[sentimentIndex] = indexData; 
    }

    var y1 = d3.scale.linear()
    .domain([1500 , 1600])
    .range([chartHeight+margin.top-57, margin.top]);

    var y2 = d3.scale.linear()
    .domain([d3.min(indexList.map(function(x) { return +x.price; })), d3.max(indexList.map(function(x){return +x.price; }))])
    .range([147, 27]);

    var x = d3.scale.ordinal()
    .domain(sentimentData.map(function(x, i) { return x.time; }))
    .rangeBands([0, graphWidth]);

    var getTotalMin = function (clock) {
      var hour = parseInt(clock.slice(0,2));
      var min = parseInt(clock.slice(3,5));
      var totalMin = hour * 60 + min;
      return totalMin;
    };

    var chart = d3.select('#sentiment-chart')
    .append('svg:svg')
    .attr('class', 'chart')
    .attr('width', chartWidth)
    .attr('height', chartHeight);

    chart.append('g')
    .attr('class','xlabels')
    .selectAll('text.xrule')
    .data(sentimentData)
    .enter().append('svg:text')
    .attr('class', 'xrule')
    .attr('x', function (d, i) { return x(d.time); })
    .attr('y', chartHeight-margin.bottom-margin.top)
    .attr('text-anchor', 'middle')
    .text(function (d, i) {
        if (i.time % 3600 === 0) {
          return i.clock;
        }
    });

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

    var news_count = chart.selectAll("scatter-dots")
    .data(moodindexList)  // using the values in the ydata array
    .enter().append("text")  // create a new circle for each value
    .attr("y", function (d) { return y1(d.mood) - 10; } ) // translate y value to a pixel
    .attr("x", function (d,i) { return x(d.timestamp); } ) // translate x value
    .text(function(d, i){
      return d.newsCount;
    });

    var tes = chart.selectAll("scatter-dots")
    .data(moodindexList)  // using the values in the ydata array
    .enter().append("svg:circle")  // create a new circle for each value
    .attr("cy", function (d) { return y1(d.mood); } ) // translate y value to a pixel
    .attr("cx", function (d,i) { return x(d.timestamp); } ) // translate x value
    .attr("r", 4)
    .attr('stroke', '#25bcf1')
    .attr('stroke-width', '1.5')
    .style("opacity", 1)
    .on("mouseover", function(d) {
      this.setAttribute('fill', '#3bc1ef');
      this.setAttribute('r', '6');
      this.setAttribute('stroke', '#fff');

      var arrow = (d.newsSign === '+'? 'rise':'fall');
      var show_extra = (d.newsTitle.length < 12? 'hide':'show');

      tooltip.transition()
      .duration(200)
      .style("opacity", .9);

      tooltip.html('<div class="tooltip-date"> 日期： ' + Helper.toDate(d.rdate) + '   ' + d.clock.slice(0, -3) + '</div>' +
                   '<div class="wrapper">' +
                   '<div class="mood"> 心情指数： ' + d.mood +             '</div>' +
                   '<div class="arrow ' + arrow + '">                     </div>' +
                   '<div class="content"> ' + d.newsTitle.slice(0, 12) + '</div>' +
                   '<div class="extra ' + show_extra + '">...</div>' +
                   '</div>')
      .style("left", (d3.event.pageX + 10) + "px")
      .style("top", (d3.event.pageY ) + "px");
    }).on("mouseout", function(d) {
      this.setAttribute('fill','#000');
      this.setAttribute('r', '4');
      this.setAttribute('stroke', '#25bcf1');

      tooltip.transition()
      .duration(500)
      .style("opacity", 0);
    });


    var securityLine = d3.svg.line()
    .x(function(d,i) { return x(d.time); })
    .y(function(d)   { return y2(+d.price); })
    .interpolate('basis');
  
    var drawSecurityLine = function (data) {
      var linear = [];
      var dotted = [];
      var start = 0;
      for (var i = 0; i < data.length-1; i++) {
        if ( data[i+1].time - data[i].time > 3590 ) {
          linear.push(data.slice(start, i));
          dotted.push(data.slice(i, i+2));
          start = i+1;
        } 
      }
      for (var j = 0; j < linear.length; j++) {
          chart.append('path')
          .datum(linear[j])
          .attr('class','security')
          .attr('d', securityLine)
          .attr('stroke', '#fff')
          .attr('fill', 'none')
          .style('stroke');
      }
      for (var k = 0; k < dotted.length; k++) {
          chart.append('path')
          .datum(dotted[k])
          .attr('class','security')
          .attr('d', securityLine)
          .attr('stroke', '#fff')
          .attr('fill', 'none')
          .style('stroke-dasharray', ('1, 3'));
      }

    };
    drawSecurityLine(indexList);
  },
};

