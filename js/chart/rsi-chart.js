var RsiChart = {
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
  y2: function(){
    return d3.scale.linear()
    .domain([0, 100])
    .range([RsiChart.properties.chartHeight - RsiChart.properties.margin.bottom, RsiChart.properties.margin.top])
  },
  init: function(){
    if(ChartView.data.indexError) return;
    this.setProperties();
    this.drawContainer();
    this.drawGraph();
    this.initCloseAction();
  },
  initCloseAction: function() {
    $('#rsi > .wrapper > .buttons > .close').on('click', function() {
      $('#rsi').slideUp(500);
      $('#rsi-checkbox').attr('checked', false);
    });
  },
  drawGraph: function() {
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

    var y2 = d3.scale.linear()
      .domain([0, 100])
      .range([chartHeight - margin.bottom, margin.top]);

    this.components.chart
      .attr('width', graphWidth)
      .select('svg')
      .attr('width', graphWidth);

    $('#rsi-chart-container').css('width', chartWidth);

    // Update y labels
    var yLabels = this.components.chartLabel.select('g.y2labels')
      .selectAll('text.yrule')
      .data(y2.ticks(3));

    yLabels.enter().append('text').attr('class', 'yrule');

    yLabels.exit().remove();
    yLabels
      .attr('x', containerWidth - margin.right + 15)
      .attr('y', y2)
      .attr('text-anchor', 'middle')
      .text(String);

    // Draw x labels
    var xLabels = this.components.chart.select('g.xlabels')
                    .selectAll('text.xrule')
                    .data(ChartView.getXLabels());

    xLabels.enter().append('svg:text').attr('class', 'xrule');

    xLabels.exit().remove();

    xLabels
      .attr('x', function(d,i){ return x(d.rdate); })
      .attr('y', chartHeight-margin.bottom+8)
      .attr('text-anchor', 'middle')
      .text(function(d,i){ return Helper.toDate(d.rdate, 'yyyy/mm'); });

    // Draw RSI lines
    function plotRSI(rsi, color){
      var line = d3.svg.line()
        .x(function(d,i) { return x(i); })
        .y(function(d)   {
          if(rsi ===  6) return y2(d.rsi6);
          if(rsi === 12) return y2(d.rsi12);
          if(rsi === 24) return y2(d.rsi24);
        })
        .interpolate('linear');

      self.components.chart.select('path.rsi' + rsi)
        .datum(data.daily.stockLine)
        .attr('d', line)
        .attr('stroke', color)
        .attr('fill', 'none');
    }

    plotRSI(6,'#fff');
    plotRSI(12,'#d8db74');
    plotRSI(24,'#784e7a');

    // Draw tooltip
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
          top = event.offsetY + 300;
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
          date: Helper.toDate(d.rdate),
          rsi6: d.rsi6,
          rsi12: d.rsi12,
          rsi24: d.rsi24,
        };
        return Tooltip.render.rsi(model);
      });
  },
  drawContainer: function(){

    this.components = {};

    $('#rsi-chart').empty();
    $('#rsi-chart-label').empty();

    var data = ChartView.data;

    var containerWidth = ChartView.properties.width;
    var margin = ChartView.properties.margin;
    var chartWidth = containerWidth - margin.left - margin.right;
    var zoomFactor = ChartView.properties.zoomFactor;
    var graphWidth = chartWidth * zoomFactor;

    var height = this.properties.height;
    var chartHeight = height - margin.top - margin.bottom;
    var interval = this.properties.interval;

    this.components.chart = d3.select('#rsi-chart')
      .append('svg:svg')
      .attr('class', 'chart')
      .attr('height', chartHeight);

    this.components.chartLabel = d3.select('#rsi-chart-label')
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

    var y2 = d3.scale.linear()
      .domain([0, 100])
      .range([chartHeight - margin.bottom, margin.top]);

    this.components.chartLabel.append('svg:line')
      .attr('class', 'guideline-70')
      .attr('x1', margin.left)
      .attr('x2', chartWidth + margin.left)
      .attr('y1', y2(70))
      .attr('y2', y2(70))
      .attr('stroke', 'rgb(50, 50, 50)')
      .attr('stroke-width', '1px')
      .attr('shape-rendering', 'crispEdges');

    this.components.chartLabel.append('svg:line')
      .attr('class', 'guideline-30')
      .attr('x1', margin.left)
      .attr('x2', chartWidth + margin.left)
      .attr('y1', y2(30))
      .attr('y2', y2(30))
      .attr('stroke', 'rgb(50, 50, 50)')
      .attr('stroke-width', '1px')
      .attr('shape-rendering', 'crispEdges');

    this.components.chartLabel.append('g')
      .attr('class','y2labels');

    this.components.chart.append('g')
      .attr('class','xlabels');

    // RSI lines
    this.components.chart.append('path').attr('class', 'rsi6');
    this.components.chart.append('path').attr('class', 'rsi12');
    this.components.chart.append('path').attr('class', 'rsi24');

    // Tooltip
    this.components.chart.append('rect')
      .attr('class','mouseover-overlay')
      .attr('fill', 'transparent')
      .attr('fill-opacity', 0);
  },
};


