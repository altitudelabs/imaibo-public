var MacdChart = {
  build: function(){
    $('#macd-chart').empty();

    var data = ChartView.data;
    var width = ChartView.defaults.width,
    height = 200,
    margin = { top: 30, right: 70, bottom: 30, left: 50 },
    interval = 40;

    var chart = d3.select('#macd-chart')
    .append('svg:svg')
    .attr('class', 'chart')
    .attr('width', width)
    .attr('height', height);

    var y1_diff = d3.max(data.daily.stockLine.map(function(x) {return Math.abs((+x.diff)); }));
    var y2_diff = d3.max(data.daily.stockLine.map(function(x) {return Math.abs((+x.macd)); }));

    var y1 = d3.scale.linear()
    .domain([y1_diff*-1, y1_diff])
    .range([ height-margin.top,  margin.bottom]);

    var y2 = d3.scale.linear()
    .domain([y2_diff*-1, y2_diff])
    .range([ height-margin.top,  margin.bottom]);

    var x = ChartView.x();

    chart.append('svg:line')
    .attr('class', 'xborder-top-thick')
    .attr('x1', margin.left)
    .attr('x2', width - margin.right)
    .attr('y1', margin.bottom - 20)
    .attr('y2', margin.bottom - 20)
    .attr('stroke', '#464646');

    chart.append('svg:line')
    .attr('class', 'yborder-left')
    .attr('x1', margin.left)
    .attr('x2', margin.left)
    .attr('y1',  height - margin.top)
    .attr('y2', margin.bottom - 20)
    .attr('stroke', '#464646');

    chart.append('svg:line')
    .attr('class', 'yborder-right')
    .attr('x1',  width - margin.right - 1)
    .attr('x2', width - margin.right - 1)
    .attr('y1',  height - margin.top)
    .attr('y2', margin.bottom - 20)
    .attr('stroke', '#464646');

    chart.append('svg:line')
    .attr('class', 'xaxis')
    .attr('x1', margin.left)
    .attr('x2', width - margin.right)
    .attr('y1', height - margin.bottom)
    .attr('y2', height - margin.bottom)
    .attr('stroke', '#464646');

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

    chart.append('g')
    .attr('class','y1labels')
    .selectAll('text.yrule')
    .data(y1.ticks(5))
    .enter().append('svg:text')
    .attr('class', 'yrule')
    .attr('x', margin.left - 15)
    .attr('y', y1)
    .attr('text-anchor', 'middle')
    .text(String);

    chart.append('g')
    .attr('class','y2labels')
    .selectAll('text.yrule')
    .data(y2.ticks(5))
    .enter().append('svg:text')
    .attr('class', 'yrule')
    .attr('x', width-margin.right + 15)
    .attr('y', y2)
    .attr('text-anchor', 'middle')
    .text(String);

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
        .attr('class','sentiment')
        .attr('d', line)
        .attr('stroke', color)
        .attr('fill', 'none');
    }


    //rectangles of the candlesticks graph
    chart.selectAll('bar')
    .data(data.daily.stockLine)
    .enter().append('svg:rect')
    .attr('x', function(d, i) { return x(i); })
    .attr('y', function(d) { return y1(max(d.diff, 0)); })
    .attr('height', function(d) {
      return Math.abs(y1(d.diff) - y1(0)); })
      .attr('width',function(d) { return 0.8 * (width - margin.right)/data.daily.stockLine.length; })
      .attr('fill', function(d) { return d.diff > 0 ? '#f65c4e' : '#3bbb57'; });


      $('#macd-checkbox').change(function(){
        $('#macd').css('display', $(this).is(':checked')? 'block':'none');
      });

      var tooltip =  chart.append('rect').attr('class', 'mouseover-overlay');
      tooltip.attr('class', 'mouseover-overlay')
      .attr('fill', 'transparent')
      .attr('x', margin.left)
      .attr('y', 10)
      .attr('width', width-margin.left-margin.right)
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
              top: d3.mouse(this)[1] + height*2 + 100 + ($('#rsi-checkbox').is(':checked')? 250: 0),
              left: width-d3.event.layerX>150 ? d3.event.layerX + 50 : d3.event.layerX-155,
              date: Helper.toDate(d.rdate),
              macd: d.macd,
              diff: d.diff,
              dea: d.dea
            };
            return Tooltip.render.macd(model);
          });
  }
};

