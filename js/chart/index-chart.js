var IndexChart = {
  init: function () {
    this.horizontalScroll();
    this.disableBodyScroll();
    ChartView.setProperties();
    this.build();
  },
  horizontalScroll: function () {
    'use strict';

    //should optimize should not
    $('.container').on('mousewheel', function (event){
      event.preventDefault();
      var original = $('.container').scrollLeft();
      $('.container').scrollLeft ( original - event.originalEvent.deltaY)
    });
  },
  disableBodyScroll: function () {
    $('#stockpicker-table-body').on('mouseenter', function (event){
      $('html').addClass('noscroll');
    });
    $('#stockpicker-table-body').on('mouseleave', function (event){
      $('html').removeClass('noscroll');
    });
  },
  drawGraph: function(isNew, y1, y2, x, v, chart) {
    //not a fan of this.
    //it builds up the memory stack
    var prop = ChartView.properties,
        chartWidth = prop.chartWidth(),
        height     = prop.height,
        graphWidth = chartWidth * prop.zoomFactor,
        margin     = prop.margin,
        data       = ChartView.data || this.data,
        interval   = prop.interval,
        zoomFactor = prop.zoomFactor,
        xlabels,
        gvolume,
        gcandlesticks,
        glinestems,
        tooltip;

    if(isNew){
      xlabels = chart.append('g').attr('class','xlabels');
      gvolume = chart.append('g').attr('class','volume');
      gcandlesticks = chart.append('g').attr('class','candlesticks');
      glinestems = chart.append('g').attr('class','linestems');
      tooltip =  chart.append('rect').attr('class', 'mouseover-overlay')
      .attr('fill', 'transparent');
    }else{
      xlabels = chart.selectAll('g.xlabels');
      gvolume = chart.selectAll('g.volume');
      gcandlesticks = chart.selectAll('g.candlesticks');
      glinestems =  chart.selectAll('g.linestems');
      tooltip =   chart.selectAll('rect.mouseover-overlay');

      chart.selectAll('g.xlabels')
      .selectAll('text.xrule')
      .remove();

      chart
      .selectAll('g.volume > rect')
      .remove();

      chart
      .selectAll('g.candlesticks > rect')
      .remove();

      chart
      .selectAll('g.linestems > line')
      .remove();

      chart
      .selectAll('svg > .line')
      .remove();
    }

    //x-axis labels
    xlabels
    .selectAll('text.xrule')
    .data(data.daily.stockLine)
    .enter().append('svg:text')
    .attr('class', 'xrule')
    .attr('x', function(d,i){ return x(i); })
    .attr('y', height-margin.bottom+20)
    .attr('text-anchor', 'middle')
    .text(function(d,i){ return i%interval===0 ? Helper.toDate(d.rdate) : ''; });

    //sentimetal rect bars
    gvolume
    .attr('class','volume')
    .selectAll('rect')
    .data(data.daily.stockLine)
    .enter().append('svg:rect')
    .attr('x', function(d,i) { return x(i) - 2.8*zoomFactor; })
    .attr('y', function(d) { return height - margin.bottom - v(d.volumn); })
    .attr('height', function(d) { return v(d.volumn); })
    .attr('width', function(d) { return 0.8 * graphWidth/data.daily.stockLine.length; })
    .attr('fill', '#595959');

    //rectangles of the candlesticks graph
    gcandlesticks
    .attr('class','candlesticks')
    .selectAll('rect')
    .data(data.daily.stockLine)
    .enter().append('svg:rect')
    .attr('x', function(d, i) { return x(i) - 2.8*zoomFactor; })
    .attr('y', function(d) { return y2(max(d.openpx, d.closepx)); })
    .attr('height', function(d) { return y2(min(d.openpx, d.closepx))-y2(max(d.openpx, d.closepx)); })
    .attr('width', function(d) { return 0.8 * (graphWidth - margin.right)/data.daily.stockLine.length; })
    .attr('fill', function(d) { return d.openpx > d.closepx ? '#f65c4e' : '#3bbb57'; });

    //verticle lines of the candlesticks graph
    glinestems
    .attr('class','linestems')
    .selectAll('line.stem')
    .data(data.daily.stockLine)
    .enter().append('svg:line')
    .attr('class', 'stem')
    .attr('x1', function(d, i) { return x(i) - 2.8*zoomFactor + 0.4 * (graphWidth - margin.left - margin.right)/data.daily.stockLine.length; })
    .attr('x2', function(d, i) { return x(i) - 2.8*zoomFactor + 0.4 * (graphWidth - margin.left - margin.right)/data.daily.stockLine.length; })
    .attr('y1', function(d) { return y2(d.highpx); })
    .attr('y2', function(d) { return y2(d.lowpx); })
    .attr('stroke', function(d){ return d.openpx > d.closepx ? '#f65c4e' : '#3bbb57'; })

    //tooltips
    tooltip
    .attr('class', 'mouseover-overlay')
    .attr('fill', 'transparent')
    .attr('x', 0)
    .attr('y', margin.top)
    .attr('width', graphWidth)
    .attr('height', height-margin.top-margin.bottom)
    .on('mouseover', function(e){
      return Tooltip.show(); })
      .on('mouseout', function(){
        return Tooltip.hide(); })
        .on('mousemove', function(){
          var xPos = d3.mouse(this)[0],
          yPos = d3.mouse(this)[1],
          j = ChartView.xInverse(xPos, x),
          cursorPriceLevel = y2.invert(yPos)
          d = d2 = data.daily.stockLine[j];

          var model = {
            top: d3.event.layerY-5,
            left: chartWidth-d3.event.layerX>150 ? d3.event.layerX+80 : d3.event.layerX-105,
            date: d.rdate,
            price: cursorPriceLevel,
            security: d,
            sentiment: {
              price: d2.moodindex,
              change: d2.moodindexchg
            }
          };
          return Tooltip.render.index(model);
        });

        //sentimentLine
        plotLine('#25bcf1',  'sentimentLine');

        //add all MA lines
        plotLine('#fff',  'ma5');
        plotLine('#d8db74', 'ma10');
        plotLine('#94599d', 'ma20');
        plotLine('#36973a', 'ma60');

        var line = d3.svg.line()
        .x(function(d, i){ return x(i); })
        .y(function(d){ return y2(0); });

        chart.append('path')
        .datum(data.daily.stockLine)
        .attr('class','line')
        .attr('d', line)
        .attr('stroke', '#fff')
        .attr('fill', 'true')
        .attr('id', 'dotted');



        /*
         * args:
         *  - color: string, in hex.
         *          e.g. '#fff', '#9f34a1'
         *  - id: what you want to id your line as. Don't put '#'
         e.g 'ma5', 'ma10'. NOT 'ma5-line'
         */
        function plotLine(color ,id){
          var _id = (id == 'sentimentLine'? 'sentimentLine': id+'-line'); // _id concats into, e.g, ma5-line
          var line = d3.svg.line()
          .x(function(d, i){ return x(i); })
          .y(function(d){
            var isMA = id.slice(0,2) == 'ma';
            return isMA? y2(d[id]): y1(d.moodindex);
          })
          .interpolate('linear');

          chart.append('path')
          .datum(data.daily.stockLine)
          .attr('class','line')
          .attr('d', line)
          .attr('stroke', color)
          .attr('fill', 'none')
          .attr('id', _id);

          if(id != 'sentimentLine'){
            var checkbox = $('#' + id + '-checkbox');
            d3.select('#'+ id + '-line').style('opacity', checkbox.is(':checked')? 1:0);
          }
        }
  },
  build: function () {

    $('#chart').empty();
    $('#chart-label').empty();

    var data = ChartView.data || this.data;

    data.sentiment.indexList.length = data.daily.stockLine.length;

    var containerWidth = ChartView.properties.width;
    var chartWidth = ChartView.properties.chartWidth();
    var graphWidth = chartWidth * ChartView.properties.zoomFactor;
    var height = ChartView.properties.height;
    var margin = ChartView.properties.margin;
    var volumeHeight = ChartView.properties.volumeHeight;
    var interval = ChartView.properties.interval;

    var chart = d3.select('#chart')
    .append('svg:svg')
    .attr('class', 'chart')
    .attr('id', 'graph')
    .attr('width', graphWidth)
    .attr('height', height);

    $('#chart-container').slimScroll({
      height: (height+40).toString() + 'px',
      width: chartWidth.toString() + 'px',
      color: '#ffcc00',
    });

    $('.slimScrollDiv').css('position', 'absolute')
    .css('top', '0')
    .css('left', '50px')
    .css('width', (containerWidth).toString() + 'px');

    var chart_label = d3.select('#chart-label')
    .append('svg:svg')
    .attr('class', 'chart')
    .attr('width', containerWidth + 120)
    .attr('height', height);

    var y1 = d3.scale.linear()
    .domain([d3.min(data.daily.stockLine.map(function(x) { return +x.moodindex; })), d3.max(data.daily.stockLine.map(function(x){return +x.moodindex; }))])
    .range([height-margin.bottom, margin.top]);

    var y2 = d3.scale.linear()
    .domain([d3.min(data.daily.stockLine.map(function(x) { return +x.lowpx; })), d3.max(data.daily.stockLine.map(function(x){return +x.highpx; }))])
    .range([height-margin.bottom, margin.top]);

    var x = ChartView.x(graphWidth);

    var v = d3.scale.linear()
    .domain([0, d3.max(data.daily.stockLine.map(function(d){ return +d.volumn;}))])
    .range([0, volumeHeight]);

    var border = {
      margin: {},
    };
    border.margin.top = margin.top - 35;

    chart_label.append('svg:line')
    .attr('class', 'xaxis')
    .attr('x1', margin.left)
    .attr('x2', margin.left + chartWidth) //shift to the left
    .attr('y1', height - margin.bottom)
    .attr('y2', height - margin.bottom)
    .attr('stroke', '#464646')
    .attr('stroke-width', '2px');

    chart_label.append('svg:line')
    .attr('class', 'border-left')
    .attr('x1', margin.left)
    .attr('x2', margin.left)
    .attr('y1', height - margin.bottom)
    .attr('y2', margin.top)
    .attr('stroke', '#464646')
    .attr('stroke-width', '2px');

    chart_label.append('svg:line')
    .attr('class', 'border-right')
    .attr('x1', containerWidth - margin.right )
    .attr('x2', containerWidth - margin.right )
    .attr('y1', height - margin.bottom)
    .attr('y2', margin.top)
    .attr('stroke', '#464646')
    .attr('stroke-width', '2px');

    //top border
    chart_label.append('svg:line')
    .attr('class', 'border-top')
    .attr('x1', margin.left)
    .attr('x2', containerWidth - margin.right )
    .attr('y1', margin.top)
    .attr('y2', margin.top)
    .attr('stroke', '#464646')
    .attr('stroke-width', '2px');

    //x-axis labels
    chart.append('g')
    .attr('class','xlabels')
    .selectAll('text.xrule')
    .data(data.daily.stockLine)
    .enter().append('svg:text')
    .attr('class', 'xrule')
    .attr('x', function(d,i){ return x(i); })
    .attr('y', height-margin.bottom+20)
    .attr('text-anchor', 'middle')
    .text(function(d,i){ return i%interval===0 ? Helper.toDate(d.rdate) : ''; });


    // left y-axis labels
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

    // right y-axis labels
    chart_label.append('g')
    .attr('class','y2labels')
    .selectAll('text.yrule')
    .data(y2.ticks(5))
    .enter().append('svg:text')
    .attr('class', 'yrule')
    .attr('x', containerWidth-margin.right + 22)
    .attr('y', y2)
    .attr('text-anchor', 'middle')
    .text(String);

    $('.xlabels > text').click(function(){
      var x = this.getAttribute('x');
      $('#xlabelLine').remove();
      $('#xlabelLineActive').remove();
      chart.append('svg:line')
      .attr('class', 'xlabelLine')
      .attr('id', 'xlabelLine')
      .attr('x1', x)
      .attr('x2', x)
      .attr('y1', height-margin.bottom) //make it line up with the label
      .attr('y2', margin.top)
      .attr('stroke', '#44b6ea');

      chart.append('g')
      .attr('id','xlabelLineActive')
      .append('svg:rect')
      .attr('x', parseFloat(x) - 50)
      .attr('y', height-margin.top)
      .attr('height', 30)
      .attr('width',  100)
      .attr('fill', '#44b6ea')
    });

    $('.y2labels > text').click(function(){
      $('#y2labelLine').remove();
      $('#y2labelLineActive').remove();
      var y = parseFloat(this.getAttribute('y')) - 5;

      chart.append('g')
      .attr('id','y2labelLineActive')
      .append('svg:rect')
      .attr('x', width-margin.right-5)
      .attr('y', y-5)
      .attr('height', 15)
      .attr('width',  50)
      .attr('fill', '#f65c4e')

      chart.append('svg:line')
      .attr('class', 'y2labelLine')
      .attr('id', 'y2labelLine')
      .attr('x1', margin.left-100)
      .attr('x2', width - margin.right)
      .attr('y1', y) //make it line up with the label
      .attr('y2', y)
      .attr('stroke', '#df5748');
    });

    var latest_daily = data.daily.stockLine.slice(-1)[0];

    $('#ma60-label').text(' MA60=' + latest_daily.ma60);
    $('#ma20-label').text(' MA20=' + latest_daily.ma20);
    $('#ma10-label').text(' MA10=' + latest_daily.ma10);
    $('#ma5-label').text(' MA5=' + latest_daily.ma5);

    this.drawGraph(true, y1, y2, x, v, chart);

  },
  redraw: function (zoomFactor) {
    ChartView.setProperties({
      zoomFactor: ChartView.properties.zoomFactor * zoomFactor
    });
    var data = ChartView.data;
    var chartWidth = ChartView.properties.chartWidth();
    var graphWidth = chartWidth * ChartView.properties.zoomFactor;
    var height = ChartView.properties.height;
    var margin = ChartView.properties.margin;
    var volumeHeight = ChartView.properties.volumeHeight;
    var interval = ChartView.properties.interval;

    $('.slimScrollDiv').css('width', (graphWidth).toString() + 'px');

    var y1 = d3.scale.linear()
    .domain([d3.min(data.daily.stockLine.map(function(x) { return +x.moodindex; })), d3.max(data.daily.stockLine.map(function(x){return +x.moodindex; }))])
    .range([height-margin.bottom, margin.top]);

    var y2 = d3.scale.linear()
    .domain([d3.min(data.daily.stockLine.map(function(x) { return +x.lowpx; })), d3.max(data.daily.stockLine.map(function(x){return +x.highpx; }))])
    .range([height-margin.bottom, margin.top]);

    var x = ChartView.x(graphWidth);

    var v = d3.scale.linear()
    .domain([0, d3.max(data.daily.stockLine.map(function(d){ return +d.volumn;}))])
    .range([0, volumeHeight]);

    $('.slimScrollDiv').css('width', graphWidth);

    var chart = d3.select('#chart')
    .attr('width', graphWidth)
    .select('svg')
    .attr('width', graphWidth);
    this.drawGraph(false, y1, y2, x, v, chart);
  },
};
