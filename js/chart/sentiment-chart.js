var SentimentChart = {
  build: function(){
    $('#sentiment-chart').empty();

    var data = ChartView.data,
    width = ChartView.properties.width,
    height = 200,
    margin = { top: 8, right: 45, bottom: 30, left: 45 },
    interval = 40;

    var chart = d3.select('#sentiment-chart')
    .append('svg:svg')
    .attr('class', 'chart')
    .attr('width', width)
    .attr('height', height);

    var sentimentData = data.sentiment.moodindexList.slice(0, 8);

    var y1 = d3.scale.linear()
    .domain([d3.min(sentimentData.map(function(x) { return +x.mood; })), d3.max(sentimentData.map(function(x){return +x.mood; }))])
    .range([height-margin.bottom-20, margin.top]);

    var y2 = d3.scale.linear()
    .domain([d3.min(data.sentiment.indexList.map(function(x) { return +x.price; })), d3.max(data.sentiment.indexList.map(function(x){return +x.price; }))])
    .range([height-margin.bottom, margin.top]);

    var seven_am = sentimentData[0].timestamp; //seven_am in epoch time
    var min_before_midnight = seven_am + 61140; //the same day as seven_am

    var x = d3.scale.linear()
    .domain([seven_am, min_before_midnight])
    .range([margin.left, width-margin.right ]);

    chart.append('svg:line')
    .attr('class', 'xaxis')
    .attr('x1', margin.left)
    .attr('x2', width - margin.right)
    .attr('y1', height - margin.bottom)
    .attr('y2', height - margin.bottom)
    .attr('stroke', '#464646');

    chart.append('svg:line')
    .attr('class', 'xborder-top-thick')
    .attr('x1', margin.left)
    .attr('x2', width - margin.right)
    .attr('y1', margin.top)
    .attr('y2', margin.top)
    .attr('stroke', '#464646');

    chart.append('g')
    .attr('class','xlabels')
    .selectAll('text.xrule')
    .data(x.ticks(400))
    .enter().append('svg:text')
    .attr('class', 'xrule')
    .attr('x', function(i){ return x(i); })
    .attr('y', height-margin.bottom+20)
    .attr('text-anchor', 'middle')
    .text(function(i){
      if(i%3600===0){
        var d = new Date(i*1000);
        // d.getDate() + '-' +
        return d.getHours() + ':' + (d.getMinutes() < 10? '0' + d.getMinutes(): d.getMinutes());
      }
    });

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

    chart.append('svg:line')
    .attr('class', 'yborder-left')
    .attr('x1', margin.left)
    .attr('x2', margin.left)
    .attr('y1', margin.top)
    .attr('y2', height-margin.bottom)
    .attr('stroke', '#464646');

    chart.append('svg:line')
    .attr('class', 'yborder-right')
    .attr('x1',  width - margin.right - 1)
    .attr('x2', width - margin.right - 1)
    .attr('y1', margin.top)
    .attr('y2', height-margin.bottom)
    .attr('stroke', '#464646');

    chart.append('g')
    .attr('class','y2labels')
    .selectAll('text.yrule')
    .data(y2.ticks(5))
    .enter().append('svg:text')
    .attr('class', 'yrule')
    .attr('x', width-margin.right + 18)
    .attr('y', y2)
    .attr('text-anchor', 'middle')
    .text(String);

    // chart.append('g')
    // .attr('class','ylines')
    // .selectAll('line.y1')
    // .data(y1.ticks(5))
    // .enter().append('svg:line')
    // .attr('class', 'y1')
    // .attr('x1', margin.left)
    // .attr('x2', width - margin.right)
    // .attr('y1', y1)
    // .attr('y2', y1)
    // .attr('stroke', '#464646')
    // .attr('stroke-width', '0.3px');

    var sentimentLine = d3.svg.line()
    .x(function(d,i) {
      return x(d.timestamp); })
      .y(function(d) { return y1(d.mood); })
      .interpolate('linear');

      chart.append('path')
      .datum(sentimentData)
      .attr('class','sentiment')
      .attr('d', sentimentLine)
      .attr('stroke', '#25bcf1')
      .attr('fill', 'none');

      var tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip').style('opacity', 0);


      var news_count = chart.selectAll("scatter-dots")
      .data(sentimentData)  // using the values in the ydata array
      .enter().append("text")  // create a new circle for each value
      .attr("y", function (d) { return y1(d.mood) - 10; } ) // translate y value to a pixel
      .attr("x", function (d,i) { return x(d.timestamp); } ) // translate x value
      .text(function(d, i){
        return d.newsCount;
      });


      var tes = chart.selectAll("scatter-dots")
      .data(sentimentData)  // using the values in the ydata array
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
      .x(function(d,i) { return x(d.timestamp); })
      .y(function(d)   { return y2(+d.price); })
      .interpolate('basis');

      chart.append('path')
      .datum(data.sentiment.indexList)
      .attr('class','security')
      .attr('d', securityLine)
      .attr('stroke', '#fff')
      .attr('fill', 'none');
  },
};

