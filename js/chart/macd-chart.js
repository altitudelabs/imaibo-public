var MacdChart = {
  properties: {},
  setProperties: function(options) {
    var properties = {
      height: 130,
      interval: 40,
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

    $('#macd > .wrapper > .buttons > .close').on('click', function() {
      $('#macd').slideUp(500);
      $('#macd-checkbox').attr('checked', false);
    });
  },
  drawGraph: function(isNew) {
    'use strict';

    var prop = ChartView.properties,
    margin = prop.margin,
    chartWidth  = prop.width - margin.left - margin.right,
    height      = this.properties.height,
    chartHeight = height - margin.top - margin.bottom,
    zoomFactor     = prop.zoomFactor,
    graphWidth     = chartWidth * zoomFactor,
    data           = ChartView.data,
    interval       = this.properties.interval,
    x              = ChartView.x(data.daily.stockLine, 'rdate'),
    xlabels,
    gline,
    tooltip;

    var chart = d3.select('#macd-chart')
    .attr('width', graphWidth)
    .select('svg')
    .attr('width', graphWidth);

    if(isNew){
      xlabels = chart.append('g')
      .attr('class','xlabels');

      // tooltip = chart.append('rect')
      // .attr('class','mouseover-overlay')
      // .attr('fill', 'transparent');
    }else{
      xlabels = chart.selectAll('g.xlabels');
      gline   = chart.selectAll('path.sentiment');
      // tooltip = chart.selectAll('rect.mouseover-overlay');

      chart.selectAll('g.xlabels')
      .selectAll('text.xrule')
      .remove();

      chart.selectAll('svg > rect')
      .remove();

      chart
      .selectAll('path.macd')
      .remove();

      chart
      .selectAll('svg > .line')
      .remove();
    }
    var y1_diff = d3.max(data.daily.stockLine.map(function(x) {return Math.abs((+x.diff)); }));
    var y2_diff = d3.max(data.daily.stockLine.map(function(x) {return Math.abs((+x.macd)); }));

    var y1 = d3.scale.linear()
    .domain([y1_diff*-1, y1_diff])
    .range([chartHeight- margin.bottom, margin.top]);

    var y2 = d3.scale.linear()
    .domain([y2_diff*-1, y2_diff])
    .range([chartHeight-margin.bottom, margin.top]);

    xlabels
    .selectAll('text.xrule')
    .data(data.daily.stockLine)
    .enter().append('svg:text')
    .attr('class', 'xrule')
    .attr('x', function(d,i){ return x(i); })
    .attr('y', chartHeight-margin.bottom+10)
    .attr('text-anchor', 'end')
    .text(function(d,i){ return i%interval===0 ? Helper.toDate(d.rdate, 'yyyy/mm') : ''; });

    chart.selectAll('bar')
    .data(data.daily.stockLine)
    .enter().append('svg:rect')
    .attr('x', function(d, i) { return x(i); })
    .attr('y', function(d) {    return y1(max(+d.diff, 0)); })
    .attr('height', function(d) {
      return Math.abs(y1(+d.diff) - y1(0)); })
    .attr('width',function(d) { return 0.8 * (chartWidth)/data.daily.stockLine.length; })
    .attr('fill', function(d) { return +d.diff > 0 ? '#f65c4e' : '#3bbb57'; });


    //dea line
    plotMACD('dea', '#d7db74');
    plotMACD('macd', '#236a82');

    function plotMACD(type, color){
      var line = d3.svg.line()
      .x(function(d,i) { return x(i); })
      .y(function(d)   {
        return type === 'dea'? y2(d.dea): y2(d.macd); })
      .interpolate('linear');

      chart.append('path')
      .datum(data.daily.stockLine)
      .attr('class','macd')
      .attr('d', line)
      .attr('stroke', color)
      .attr('fill', 'none');
    }

    if (isNew) {
      tooltip = chart.append('rect')
      .attr('class','mouseover-overlay')
      .attr('fill', 'transparent');
    } else {
      tooltip = chart.selectAll('rect.mouseover-overlay');
    }

    var tooltip =  chart.attr('class', 'mouseover-overlay');

   var containerMouseX;
    $('#macd-chart-container').mousemove(function(e){
      containerMouseX = e.pageX - $(this).parent().offset().left;
      containerMouseX = containerMouseX > 910? containerMouseX - 150:containerMouseX;
    });
    
    tooltip
    .attr('class', 'mouseover-overlay')
    .attr('fill', 'transparent')
    .attr('x', 0)
    .attr('y', margin.top)
    .attr('width', graphWidth)
    .attr('height', chartHeight)
    .on('mouseover', function(e){
      return Tooltip.show(); })
    .on('mouseout', function(){
      return Tooltip.hide(); })
    .on('mousemove', function(){
      var xPos = d3.mouse(this)[0],
      j = ChartView.xInverse(xPos, x),
      d = d2 = data.daily.stockLine[j];

      var model = {
        top: d3.event.pageY - 120,
        left: containerMouseX + 55,
        date: d.rdate,
        macd: d.macd,
        diff: d.diff,
        dea: d.dea
      };
      return Tooltip.render.macd(model);
    });
  },
  drawContainer: function(){
    $('#macd-chart').empty();
    $('#macd-chart-label').empty();

    var containerWidth = ChartView.properties.width;
    var margin = ChartView.properties.margin;
    var chartWidth = containerWidth - margin.left - margin.right;
    var zoomFactor = ChartView.properties.zoomFactor;
    var graphWidth = chartWidth * zoomFactor;

    var height = this.properties.height;
    var chartHeight = height - margin.top - margin.bottom;
    var interval = this.properties.interval;

    var chart = d3.select('#macd-chart')
    .append('svg:svg')
    .attr('class', 'chart')
    // .attr('width', graphWidth)
    .attr('height', chartHeight);

    var chart_label = d3.select('#macd-chart-label')
    .append('svg:svg')
    .attr('class', 'chart')
    .attr('width', containerWidth + 120)
    .attr('height', chartHeight);

    $('#macd-chart-container').slimScroll({
      height: height.toString() + 'px',
      width: chartWidth.toString() + 'px',
      color: '#ffcc00'
    });

    $('#macd-chart-container').css('top', 0);

    $('#macd .slimScrollDiv').css('position', 'absolute')
    .css('top', '33px')
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

    var data = ChartView.data;

    var y1_diff = d3.max(data.daily.stockLine.map(function(x) {return Math.abs((+x.diff)); }));
    var y2_diff = d3.max(data.daily.stockLine.map(function(x) {return Math.abs((+x.macd)); }));

    var y1 = d3.scale.linear()
    .domain([y1_diff*-1, y1_diff])
    .range([chartHeight-margin.bottom, margin.top]);

    var y2 = d3.scale.linear()
    .domain([y2_diff*-1, y2_diff])
    .range([chartHeight-margin.bottom, margin.top]);

    data  = ChartView.data.daily.stockLine;
    var x = ChartView.x(data, 'rdate');

    chart_label.append('g')
    .attr('class','y1labels')
    .selectAll('text.yrule')
    .data(y1.ticks(3))
    .enter().append('svg:text')
    .attr('class', 'yrule')
    .attr('x', margin.left - 15)
    .attr('y', y1)
    .attr('text-anchor', 'middle')
    .text(String);

    chart_label.append('g')
    .attr('class','y2labels')
    .selectAll('text.yrule')
    .data(y2.ticks(3))
    .enter().append('svg:text')
    .attr('class', 'yrule')
    .attr('x', containerWidth-margin.right + 15)
    .attr('y', y2)
    .attr('text-anchor', 'middle')
    .text(String);

    $('#macd-checkbox').change(function(){
      $('#macd').css('display', $(this).is(':checked')? 'block':'none');
    });

  }
};

