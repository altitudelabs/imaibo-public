var RsiChart = {
    properties: {},
    init: function() {
      var data;
      this.properties.data = data = ChartView.data;
      this.properties.height = 200;
      this.properties.margin = { top: 30, right: 70, bottom: 30, left: 50 };
      this.properties.width = ChartView.defaults.width - 122;
      this.properties.zoomFactor = 1;
      this.properties.interval = 40;
      this.properties.largest_abs = d3.max(data.daily.stockLine.map(function(x) {
        return max(
          max(Math.abs(+x.rsi6),
              Math.abs(+x.rsi12)),
              Math.abs(+x.rsi24)
        );
      }));
      this.build();
    },
    drawGraph: function(isNew, y2, x, chart) {
      var prop = this.properties,
      containerWidth = prop.width,
      height         = prop.height,
      zoomFactor     = prop.zoomFactor,
      graphWidth     = containerWidth * zoomFactor,
      margin         = prop.margin,
      data           = ChartView.data || this.data,
      interval       = prop.interval,
      xlabels,
      gline,
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
      .attr('y', height-10)
      .attr('text-anchor', 'middle')
      .text(function(d,i){return i%interval===0 ? Helper.toDate(d.rdate) : ''; });

      function plotRSI(rsi, color){
        var line = d3.svg.line()
        .x(function(d,i) { return x(i)-50; })
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
      .attr('x', margin.left)
      .attr('y', 10)
      .attr('width', graphWidth)
      .attr('height', 200)
      .on('mouseover', function(e){
        return Tooltip.show(); })
        .on('mouseout', function(){
          return Tooltip.hide(); })
          .on('mousemove', function(){
            var xPos = d3.mouse(this)[0],
            j = ChartView.xInverse(xPos, x),
            d = d2 = data.daily.stockLine[j];

            var model = {
              top: d3.mouse(this)[1] + height*2 + 75,
              left: graphWidth-d3.event.layerX>150 ? d3.event.layerX + 50 : d3.event.layerX-155,
              date: Helper.toDate(d.rdate),
              rsi6: d.rsi6,
              rsi12: d.rsi12,
              rsi24: d.rsi24,
            };
            return Tooltip.render.rsi(model);
          });
    },
    redraw: function(zoomFactor) {
      this.properties.zoomFactor *= zoomFactor;

      var largest_abs = this.properties.largest_abs,
      data = this.properties.data,
      graphWidth = this.properties.width * this.properties.zoomFactor;

      var y2 = d3.scale.linear()
      .domain([largest_abs*-1, largest_abs])
      .range([height-margin.top, margin.bottom]);

      var x = d3.scale.ordinal()
      .domain(data.daily.stockLine.map(function(x) { return x.rdate; }))
      .rangeBands([margin.left, graphWidth]); //inversed the x axis because api came in descending order

      $('.slimScrollDiv').css('width', (graphWidth).toString() + 'px');


      var chart = d3.select('#rsi-chart')
      .select('svg')
      .attr('width', graphWidth)
      .attr('height', height);

      this.drawGraph(false, y2, x, chart);
    },
    build: function(){
      // rsi-chart
      $('#rsi-chart').empty();

      var data       = ChartView.data;
      margin     = this.properties.margin,
      containerWidth = this.properties.width + margin.left + margin.right,
      height     = this.properties.height,
      interval   = 40,

      console.log(height);
      zoomFactor = this.properties.zoomFactor,
      graphWidth = (containerWidth-122) * zoomFactor;

      var chart = d3.select('#rsi-chart')
      .append('svg:svg')
      .attr('class', 'chart')
      .attr('width', graphWidth)
      .attr('height', height);

      var chart_label = d3.select('#rsi-chart-label')
      .append('svg:svg')
      .attr('class', 'chart')
      .attr('width', containerWidth)
      .attr('height', height);

      $('#rsi-chart-container').slimScroll({
        height: (height+40).toString() + 'px',
        width: containerWidth.toString() + 'px',
        color: '#ffcc00',
      });

      $('#rsi-chart-container').css('width', (graphWidth).toString() + 'px');

      $('#rsi .slimScrollDiv').css('position', 'absolute')
      .css('top', '0')
      .css('left', '50px')
      .css('width', (graphWidth).toString() + 'px');

      //vertical aligning the lines in the middle
      var largest_abs = d3.max(data.daily.stockLine.map(function(x) {return max(max(Math.abs(+x.rsi6), Math.abs(+x.rsi12)), Math.abs(+x.rsi24)); }));

      var y2 = d3.scale.linear()
      .domain([largest_abs*-1, largest_abs])
      .range([height-margin.top, margin.bottom]);

      var x = d3.scale.ordinal()
      .domain(data.daily.stockLine.map(function(x) { return x.rdate; }))
      .rangeBands([margin.left, graphWidth]); //inversed the x axis because api came in descending order

      chart_label.append('g')
      .attr('class','y2labels')
      .selectAll('text.yrule')
      .data(y2.ticks(5))
      .enter().append('svg:text')
      .attr('class', 'yrule')
      .attr('x', containerWidth-margin.right + 15 )
      .attr('y', y2)
      .attr('text-anchor', 'middle')
      .text(String);

      chart_label.append('svg:line')
      .attr('class', 'guideline-80')
      .attr('x1', margin.left)
      .attr('x2', containerWidth - margin.right)
      .attr('y1', margin.bottom + 10)
      .attr('y2', margin.bottom + 10)
      .attr('stroke', '#464646');

      chart_label.append('svg:line')
      .attr('class', 'guideline-20')
      .attr('x1', margin.left)
      .attr('x2', containerWidth - margin.right)
      .attr('y1', height - margin.bottom - 25)
      .attr('y2', height - margin.bottom - 25)
      .attr('stroke', '#464646');

      chart_label.append('svg:line')
      .attr('class', 'xborder-top-thick')
      .attr('x1', margin.left)
      .attr('x2', containerWidth - margin.right)
      .attr('y1', margin.bottom - 20)
      .attr('y2', margin.bottom - 20)
      .attr('stroke', '#464646');

      chart_label.append('svg:line')
      .attr('class', 'yborder-left')
      .attr('x1', margin.left)
      .attr('x2', margin.left)
      .attr('y1', height - margin.top)
      .attr('y2', margin.bottom - 20)
      .attr('stroke', '#464646');

      chart_label.append('svg:line')
      .attr('class', 'yborder-right')
      .attr('x1',  containerWidth - margin.right)
      .attr('x2',  containerWidth - margin.right)
      .attr('y1',  height - margin.top)
      .attr('y2',  margin.bottom - 20)
      .attr('stroke', '#464646');

      chart_label.append('svg:line')
      .attr('class', 'xaxis')
      .attr('x1', margin.left)
      .attr('x2', containerWidth - margin.right)
      .attr('y1', height - margin.bottom)
      .attr('y2', height - margin.bottom)
      .attr('stroke', '#464646');

      this.drawGraph(true, y2, x, chart);
    },
};


