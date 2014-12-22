var MacdChart = {
  y2: function(){
    return d3.scale.linear()
    .domain([Macd.properties.largest_abs*-1, MacdChart.properties.largest_abs])
    .range([MacdChart.properties.chartHeight - MacdChart.properties.margin.bottom, MacdChart.properties.margin.top])
  },
  y1_diff: function() {
    return d3.max(MacdChart.properties.data.daily.stockLine.map(function(x) {return Math.abs((+x.diff)); }));
  },
  y2_diff: function() {
    return d3.max(MacdChart.properties.data.daily.stockLine.map(function(x) {return Math.abs((+x.macd)); }));
  },
  y1: function(){
    return d3.scale.linear()
    .domain([MacdChart.y1_diff()*-1, MacdChart.y1_diff()])
    .range([MacdChart.properties.chartHeight-MacdChart.properties.margin.bottom,  MacdChart.properties.margin.top]);
  },
  y2: function() {
    return d3.scale.linear()
    .domain([MacdChart.y2_diff()*-1, MacdChart.y2_diff()])
    .range([MacdChart.properties.chartHeight-MacdChart.properties.margin.bottom,  MacdChart.properties.margin.top]);
  },
  properties: {},
  init: function(){
    this.properties = $.extend({}, ChartView.properties);
    this.properties.zoomFactor = 1;
    this.properties.data = ChartView.data;
    this.properties.height = 240;
    this.properties.chartHeight = this.properties.height - this.properties.margin.top - this.properties.margin.bottom;
    this.properties.chartWidth = this.properties.width - this.properties.margin.left - this.properties.margin.right;
    this.build();

    $('#macd > .wrapper > .buttons > .close').on('click', function() {
      $('#macd').slideUp(500);
      $('#macd-checkbox').attr('checked', false);
    });
  },
  drawGraph: function(isNew, x, chart) {
    var prop = this.properties,
    chartWidth = prop.chartWidth,
    chartHeight = prop.chartHeight,
    height         = prop.height,
    zoomFactor     = prop.zoomFactor,
    graphWidth     = chartWidth * zoomFactor,
    margin         = prop.margin,
    data           = ChartView.data || this.data,
    interval       = prop.interval,
    xlabels,
    gline,
    diff,
    tooltip;

    if(isNew){
      xlabels = chart.append('g')
      .attr('class','xlabels');

      tooltip = chart.append('rect')
      .attr('class','mouseover-overlay')
      .attr('fill', 'transparent');


    }else{
      xlabels = chart.selectAll('g.xlabels');
      gline   = chart.selectAll('path.sentiment');
      tooltip = chart.selectAll('rect.mouseover-overlay');

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

    var y1 = this.y1();
    var y2 = this.y2();

    xlabels
    .selectAll('text.xrule')
    .data(data.daily.stockLine)
    .enter().append('svg:text')
    .attr('class', 'xrule')
    .attr('x', function(d,i){ return x(i); })
    .attr('y', chartHeight-margin.bottom+20)
    .attr('text-anchor', 'middle')
    .text(function(d,i){ return i%interval===0 ? Helper.toDate(d.rdate) : ''; });

    chart.selectAll('bar')
    .data(data.daily.stockLine)
    .enter().append('svg:rect')
    .attr('x', function(d, i) { return x(i); })
    .attr('y', function(d) {    return y1(max(+d.diff, 0)); })
    .attr('height', function(d) {
      return Math.abs(y1(+d.diff) - y1(0)); })
    .attr('width',function(d) { return 0.8 * (chartWidth)/data.daily.stockLine.length; })
    .attr('fill', function(d) { return +d.diff > 0 ? '#f65c4e' : '#3bbb57'; });

    tooltip.attr('class', 'mouseover-overlay')
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
            top: d3.mouse(this)[1] + height*2 + 100 + ($('#rsi-checkbox').is(':checked')? 250: 0),
            left: chartWidth-d3.event.layerX>150 ? d3.event.layerX + 50 : d3.event.layerX-155,
            date: Helper.toDate(d.rdate),
            macd: d.macd,
            diff: d.diff,
            dea: d.dea
          };
          return Tooltip.render.macd(model);
        });

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
  },
  redraw: function(zoomFactor) {
    this.properties.zoomFactor *= zoomFactor;

    var height = this.properties.height,
    margin = this.properties.margin,
    data = this.properties.data,
    chartWidth = this.properties.chartWidth,
    chartHeight = this.properties.chartHeight,
    graphWidth = chartWidth * this.properties.zoomFactor;

    var y2 = this.y2();
    var x = ChartView.x(graphWidth);

    $('.slimScrollDiv').css('width', (graphWidth).toString() + 'px');

    var chart = d3.select('#macd-chart')
    .select('svg')
    .attr('width', graphWidth)
    .attr('height', height);

    this.drawGraph(false, x, chart);
  },

  build: function(){
    $('#macd-chart').empty();
    $('#macd-chart-label').empty();

    var data = ChartView.data,
    width = ChartView.defaults.width,
    chartWidth = this.properties.chartWidth,
    graphWidth = this.properties.chartWidth * this.properties.zoomFactor,
    chartHeight = this.properties.chartHeight,
    height = this.properties.height,
    margin = this.properties.margin,
    interval = this.properties.interval;
    console.log(this.properties);

    var chart = d3.select('#macd-chart')
    .append('svg:svg')
    .attr('class', 'chart')
    .attr('width', graphWidth)
    .attr('height', chartHeight);

    var chart_label = d3.select('#macd-chart-label')
    .append('svg:svg')
    .attr('class', 'chart')
    .attr('width', width)
    .attr('height', chartHeight);

    var y1 = MacdChart.y1();
    var y2 = MacdChart.y2();

    var x = ChartView.x(graphWidth);

    $('#macd-chart-container').slimScroll({
      height: height.toString() + 'px',
      width: chartWidth.toString() + 'px',
      color: '#ffcc00',
    });
    $('#macd-chart-container').css('top', 0);

    $('#macd .slimScrollDiv').css('position', 'absolute')
    .css('top', (margin.top+20).toString() + 'px')
    .css('left', '50px')
    .css('width', graphWidth.toString() + 'px');

    chart_label.append('svg:line')
    .attr('class', 'xborder-top-thick')
    .attr('x1', margin.left)
    .attr('x2', chartWidth + margin.left)
    .attr('y1', margin.bottom - 20)
    .attr('y2', margin.bottom - 20)
    .attr('stroke', '#464646');

    chart_label.append('svg:line')
    .attr('class', 'yborder-left')
    .attr('x1', margin.left)
    .attr('x2', margin.left)
    .attr('y1',  chartHeight - margin.bottom)
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
    .attr('x2', width - margin.right)
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
    .attr('x', width-margin.right + 15)
    .attr('y', y2)
    .attr('text-anchor', 'middle')
    .text(String);

    $('#macd-checkbox').change(function(){
      $('#macd').css('display', $(this).is(':checked')? 'block':'none');
    });

    this.drawGraph(true, x, chart);
  }
};

