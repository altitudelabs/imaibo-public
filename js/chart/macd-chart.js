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
    if(ChartView.data.indexError) return;
    this.setProperties();
    this.drawContainer();
    this.drawGraph();
    this.initCloseAction();
  },
  initCloseAction: function(){
    $('#macd > .wrapper > .buttons > .close').on('click', function() {
      $('#macd').slideUp(500);
      $('#macd-checkbox').attr('checked', false);
    });
  },
  drawGraph: function() {
    'use strict';

    var self            = this,
        prop            = ChartView.properties,
        containerWidth  = ChartView.properties.width,
        margin          = prop.margin,
        chartWidth      = prop.width - margin.left - margin.right,
        height          = this.properties.height,
        chartHeight     = height - margin.top - margin.bottom,
        zoomFactor      = prop.zoomFactor,
        graphWidth      = chartWidth * zoomFactor,
        data            = ChartView.data,
        interval        = this.properties.interval,
        x               = ChartView.x(data.daily.stockLine, 'rdate');

    this.components.chart
      .attr('width', graphWidth)
      .select('svg')
      .attr('width', graphWidth);

    $('#macd-chart-container').css('width', chartWidth);

    var y1Diff = d3.max(data.daily.stockLine.map(function(x) {return Math.abs((+x.diff)); }));
    var y2Diff = d3.max(data.daily.stockLine.map(function(x) {return Math.abs((+x.macd)); }));

    var y1 = d3.scale.linear()
      .domain([y1Diff*-1, y1Diff])
      .range([chartHeight - margin.top - margin.bottom, margin.top + 5]);

    var y2 = d3.scale.linear()
      .domain([y2Diff*-1, y2Diff])
      .range([chartHeight - margin.top - margin.bottom, margin.top + 5]);

    // Update y1 labels
    var y1Labels = this.components.chartLabel.select('g.y1labels')
      .selectAll('text.y1rule')
      .data(y1.ticks(3));

    y1Labels.enter().append('text').attr('class', 'y1rule');

    y1Labels.exit().remove();

    y1Labels
      .attr('x', margin.left - 15)
      .attr('y', y1)
      .attr('text-anchor', 'middle')
      .text(String);

    // Update y2 labels
    var y2Labels = this.components.chartLabel.select('g.y2labels')
      .selectAll('text.y2rule')
      .data(y2.ticks(3));

    y2Labels.enter().append('text').attr('class', 'y2rule');

    y2Labels.exit().remove();

    y2Labels
      .attr('x', containerWidth - margin.right + 15)
      .attr('y', y2)
      .attr('text-anchor', 'middle')
      .text(String);

    // Update x labels
    var xLabels = this.components.chart.select('g.xlabels')
                    .selectAll('text.xrule')
                    .data(ChartView.getXLabels());

    xLabels.enter().append('svg:text').attr('class', 'xrule');

    xLabels.exit().remove();

    xLabels
      .attr('x', function(d,i){ return x(d.rdate); })
      .attr('y', chartHeight-margin.bottom+15)
      .attr('text-anchor', 'middle')
      .text(function(d,i){ return Helper.toDate(d.rdate, 'yyyy/mm'); });

    // Update bars
    var bars = this.components.chart.select('g.bars')
                .selectAll('rect.bars')
                .data(data.daily.stockLine);

    bars.enter().append('rect').attr('class','bars');

    bars.exit().remove();

    bars
      .attr('x', function(d, i) { return x(i); })
      .attr('y', function(d) { return y1(max(+d.diff, 0)); })
      .attr('height', function(d) { return Math.abs(y1(+d.diff) - y1(0)); })
      .attr('width',function(d) { return 0.8 * graphWidth/data.daily.stockLine.length; })
      .attr('fill', function(d) { return +d.diff > 0 ? '#f65c4e' : '#3bbb57'; });

    // Update MACD and DEA lines
    function plotMACD(type, color){
      var line = d3.svg.line()
        .x(function(d,i) { return x(i); })
        .y(function(d)   {
          return type === 'dea'? y2(d.dea): y2(d.macd); })
        .interpolate('linear');

      self.components.chart.select('path.' + type)
        .datum(data.daily.stockLine)
        .attr('d', line)
        .attr('stroke', color)
        .attr('fill', 'none');
    }

    plotMACD('dea', '#d7db74');
    plotMACD('macd', '#236a82');

    this.components.chart.select('rect.mouseover-overlay')
      .attr('x', 0)
      .attr('y', margin.top)
      .attr('width', graphWidth)
      .attr('height', height-margin.top-margin.bottom)
      .on('mouseover', function(e){
        return Tooltip.show(); })
      .on('mouseout', function(){
        return Tooltip.hide(); })
      .on('mousemove', function(){
        var xPos, mouseX, mouseY;

        if(IE8) {
          /* TO BE FIXED:
          xPos = eventX;
          leftOffset = eventX - 60;
          top = event.offsetY + ($('#rsi-checkbox').is(':checked')? 450:300);
          */
        }
        else {
          xPos = d3.mouse(this)[0];
          mouseX = d3.event.pageX;
          mouseY = d3.event.pageY;
        }

        var j = ChartView.xInverse((IE8?xPos-55:xPos), x);
        var d = data.daily.stockLine[j];

        var model = {
          top: mouseY + 10,
          // 10 = horizontal distance from mouse cursor
          left: chartWidth - mouseX > 135 ? mouseX + 10 : mouseX - 180 - 10,
          // if the right edge touches the right y axis
          // 180 = width of tooltip, 10 = vertical distance from cursor
          date: d.rdate,
          macd: d.macd,
          diff: d.diff,
          dea: d.dea
        };
        return Tooltip.render.macd(model);
      });
  },
  drawContainer: function(){

    this.components = {};

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

    this.components.chart = d3.select('#macd-chart')
      .append('svg:svg')
      .attr('class', 'chart')
      .attr('height', chartHeight);

    this.components.chartLabel = d3.select('#macd-chart-label')
      .append('svg:svg')
      .attr('class', 'chart')
      .attr('width', containerWidth + 120)
      .attr('height', chartHeight);

    this.components.chartLabel.append('svg:line')
      .attr('class', 'xborder-top-thick')
      .attr('x1', margin.left)
      .attr('x2', chartWidth + margin.left)
      .attr('y1', margin.top)
      .attr('y2', margin.top)
      .attr('stroke', 'rgb(77, 77, 77)')
      .attr('stroke-width', '2px');

    this.components.chartLabel.append('svg:line')
      .attr('class', 'yborder-left')
      .attr('x1', margin.left)
      .attr('x2', margin.left)
      .attr('y1', chartHeight - margin.bottom)
      .attr('y2', margin.top)
      .attr('stroke', 'rgb(77, 77, 77)')
      .attr('stroke-width', '2px');

    this.components.chartLabel.append('svg:line')
      .attr('class', 'yborder-right')
      .attr('x1', chartWidth + margin.left)
      .attr('x2', chartWidth + margin.left)
      .attr('y1', chartHeight - margin.bottom)
      .attr('y2', margin.top)
      .attr('stroke', 'rgb(77, 77, 77)')
      .attr('stroke-width', '2px');

    this.components.chartLabel.append('svg:line')
      .attr('class', 'xaxis')
      .attr('x1', margin.left)
      .attr('x2', containerWidth - margin.right)
      .attr('y1', chartHeight - margin.bottom)
      .attr('y2', chartHeight - margin.bottom)
      .attr('stroke', 'rgb(77, 77, 77)')
      .attr('stroke-width', '2px');

    // y labels
    this.components.chartLabel.append('g')
      .attr('class','y1labels');

    this.components.chartLabel.append('g')
      .attr('class','y2labels')

    // x labels
    this.components.chart.append('g')
      .attr('class','xlabels');

    // bars
    this.components.chart.append('g').attr('class', 'bars');

    // DEA line
    this.components.chart.append('path')
      .attr('class','dea');

    // MACD line
    this.components.chart.append('path')
      .attr('class','macd');

    // tooltip
    this.components.chart.append('rect')
      .attr('class','mouseover-overlay')
      .attr('fill', 'transparent')
      .attr('fill-opacity', 1);
  }
};

