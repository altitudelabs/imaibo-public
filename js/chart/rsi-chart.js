var RsiChart = {
  properties: {},
  setProperties: function(options) {
    var properties = {
      height: 240,
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
    .domain([RsiChart.properties.largest_abs*-1, RsiChart.properties.largest_abs])
    .range([RsiChart.properties.chartHeight - RsiChart.properties.margin.bottom, RsiChart.properties.margin.top])
  },
  init: function() {
    this.setProperties();
    this.drawContainer();
    this.drawGraph(true);

    // this.properties.largest_abs = d3.max(data.daily.stockLine.map(function(x) {
    //   return max(
    //     max(Math.abs(+x.rsi6),
    //         Math.abs(+x.rsi12)),
    //         Math.abs(+x.rsi24)
    //   );
    // }));

  $('#rsi > .wrapper > .buttons > .close').on('click', function() {
      $('#rsi').slideUp(500);
      $('#rsi-checkbox').attr('checked', false);
    });
  },
  drawGraph: function(isNew) {
    var prop = ChartView.properties,
        margin = prop.margin,
    chartWidth = prop.width - margin.left - margin.right,
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

    var y2 = d3.scale.linear()
    .domain([this.properties.largest_abs*-1, this.properties.largest_abs])
    .range([chartHeight - margin.bottom, margin.top]);

    var chart = d3.select('#rsi-chart')
    .attr('width', graphWidth)
    .select('svg')
    .attr('width', graphWidth);

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

      chart
      .selectAll('path.rsi')
      .remove();

      chart
      .selectAll('svg > .line')
      .remove();
    }

    xlabels
    .selectAll('text.xrule')
    .data(data.daily.stockLine)
    .enter().append('svg:text')
    .attr('class', 'xrule')
    .attr('x', function(d,i){ return x(i); })
    .attr('y', chartHeight - margin.top)
    .attr('text-anchor', 'end')
    .text(function(d,i){return i%interval===0 ? Helper.toDate(d.rdate, 'yyyy-mm') : ''; });

    function plotRSI(rsi, color){
      var line = d3.svg.line()
      .x(function(d,i) { return x(i); })
      .y(function(d)   {
        if(rsi == 6) return y2(d.rsi6);
        if(rsi ==12) return y2(d.rsi12);
        if(rsi ==24) return y2(d.rsi24);
      })
      .interpolate('linear');

      chart.append('path')
      .datum(data.daily.stockLine)
      .attr('class','rsi')
      .attr('d', line)
      .attr('stroke', color)
      .attr('fill', 'none');
    }

    plotRSI(6,'#fff');
    plotRSI(12,'#d8db74');
    plotRSI(24,'#784e7a');

    var tooltip =  chart.attr('class', 'mouseover-overlay');
    tooltip.attr('class', 'mouseover-overlay')
    .attr('fill', 'transparent')
    .attr('x', 0)
    .attr('y', margin.top)
    .attr('width', chartWidth)
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
            top: d3.mouse(this)[1] + height*2,
            left: chartWidth-d3.event.layerX>150 ? d3.event.layerX + 50 : d3.event.layerX-155,
            date: Helper.toDate(d.rdate),
            rsi6: d.rsi6,
            rsi12: d.rsi12,
            rsi24: d.rsi24,
          };
          return Tooltip.render.rsi(model);
        });
  },
  drawContainer: function(){
    // rsi-chart
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

    var chart = d3.select('#rsi-chart')
    .append('svg:svg')
    .attr('class', 'chart')
    .attr('width', graphWidth)
    .attr('height', chartHeight);

    var chart_label = d3.select('#rsi-chart-label')
    .append('svg:svg')
    .attr('class', 'chart')
    .attr('width', containerWidth + 120)
    .attr('height', chartHeight);

    $('#rsi-chart-container').slimScroll({
      height: height.toString() + 'px',
      width: chartWidth.toString() + 'px',
      color: '#ffcc00',
    });
    $('#rsi-chart-container').css('top', 0);

    $('#rsi .slimScrollDiv').css('position', 'absolute')
    .css('top', (margin.top+20).toString() + 'px')
    .css('left', '50px')
    .css('width', graphWidth.toString() + 'px');

    //vertical aligning the lines in the middle
    this.properties.largest_abs = d3.max(data.daily.stockLine.map(function(x) {return max(max(Math.abs(+x.rsi6), Math.abs(+x.rsi12)), Math.abs(+x.rsi24)); }));

    var y2 = d3.scale.linear()
    .domain([this.properties.largest_abs*-1, this.properties.largest_abs])
    .range([chartHeight - margin.bottom, margin.top]);

    data = ChartView.data.daily.stockLine;

    var x = ChartView.x(data, 'rdate');

    chart_label.append('g')
    .attr('class','y2labels')
    .selectAll('text.yrule')
    .data(y2.ticks(10))
    .enter().append('svg:text')
    .attr('class', 'yrule')
    .attr('x', chartWidth + margin.left + 15 )
    .attr('y', y2)
    .attr('text-anchor', 'middle')
    .text(String);

    chart_label.append('svg:line')
    .attr('class', 'guideline-80')
    .attr('x1', margin.left)
    .attr('x2', chartWidth + margin.left)
    .attr('y1', margin.bottom + 10)
    .attr('y2', margin.bottom + 10)
    .attr('stroke', '#464646');

    chart_label.append('svg:line')
    .attr('class', 'guideline-20')
    .attr('x1', margin.left)
    .attr('x2', chartWidth + margin.left)
    .attr('y1', chartHeight - margin.bottom - 30)
    .attr('y2', chartHeight - margin.bottom - 30)
    .attr('stroke', '#464646');

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
    .attr('y1', chartHeight - margin.bottom)
    .attr('y2', margin.top)
    .attr('stroke', '#464646');

    chart_label.append('svg:line')
    .attr('class', 'yborder-right')
    .attr('x1',  chartWidth + margin.left)
    .attr('x2',  chartWidth + margin.left)
    .attr('y1',  chartHeight - margin.bottom)
    .attr('y2',  margin.top)
    .attr('stroke', '#464646');

    chart_label.append('svg:line')
    .attr('class', 'xaxis')
    .attr('x1', margin.left)
    .attr('x2', chartWidth + margin.left)
    .attr('y1', chartHeight - margin.bottom)
    .attr('y2', chartHeight - margin.bottom)
    .attr('stroke', '#464646');
  },
};


