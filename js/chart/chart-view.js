var ChartView = {
  defaults: {
    width: 0,
  },
  renderDashboard: function(model){
    this.render(model, '#dashboard-template', '#dashboard');
    var selector = $('.thermo > .thermo-wrapper > .background');
    var change_percent = parseFloat(model.moodindexInfo.changeRatio).toFixed();

    if(change_percent >= 25)
      selector.animate({height: '25%'});
    if(change_percent >= 50)
      selector.animate({height: '50%'});
    if(change_percent >= 75)
      selector.animate({height: '75%'});
    if(change_percent >= 100)
      selector.animate({height: '100%'});




  },
  renderToolbar: function(model){
    var temp = model.stockLine.slice(-1).pop();
    var ma = ['5', '10', '20', '60'];
    var t = [];
    ma.forEach(function(res){
      t.push({
        ma_id: 'ma'+res+'-checkbox',
        ma_label_id: 'ma'+res+'-label',
        ma_label: 'MA'+res+'=' + temp['ma'+res]
      });
    });

    this.render({data: t}, '#ma-template', '#ma-dropdown-menu');
    //bind checkbox listeners to each MA line
    toggleMA('5');
    toggleMA('10');
    toggleMA('20');
    toggleMA('60');


    //bind checkbox listeners to each MA line
    function toggleMA(val){
      var ma = 'ma' + val;
      $('#' + ma + '-checkbox').change(function(){
        /*
         * see http://jsperf.com/boolean-int-conversion/3 for ternary operators speed
         * Chrome benefits greatly using explicit rather than implicit.
         * but on average implicit ternary operator is pretty fast
         */
        var legends = $('#legend').attr('ma');
        $('#legend > li').remove();
        legends = legends.split(',');

        //remove item if already exist
        var item = $.inArray(val, legends);
        if(item != -1){  //if does not exist
          legends.splice(item, 1);
        }else{
          legends.push(val);
        }

        legends = legends.map(function(item){
          return parseInt(item, 10);
        });

        legends.sort(function(a, b){ return b - a; });
        $('#legend').attr('ma', legends.join(','));

        //sentimentLine always exist
        $('#legend').prepend('<li id="sentiment-legend">'                                    +
                             '<div id="sentiment-legend-line" class="legend-line"></div>' +
                             '<span>心情指数</span>'                                        +
                             '</li>');

        legends.forEach(function(ma) {
          if(!isNaN(ma)){
            $('#legend').prepend('<li id="ma' + ma + '-legend">'                                    +
                                 '<div id="ma' + ma + '-legend-line" class="legend-line"></div>' +
                                 '<span>MA' + ma + '</span>'                                     +
                                 '</li>');
          }
        });

        d3.select('#' + ma + '-line').style('opacity', this.checked? 1:0);
        $('#' + ma + '-legend').css('opacity', this.checked? 1:0);
      });
    }
  },
  render: function(model, template_id, target_id){
    var template = Handlebars.compile($(template_id).html());
    $(target_id).html(template(model));
  },
  init: function(){
    // set default width
    this.defaults.width = $('#content').width();
    $('.loader').css('width', this.defaults.width);
    $('.loader').css('height', '441px');

    // set up toolbar
    Toolbar.init();

    var self = this;

    function draw(){
      ChartModel.get(function(model){
        self.data = model;
        self.indexChart.init();
        self.buildSentimentChart();
        self.buildRSIChart();
        self.buildMacdChart();
        self.renderDashboard(self.data.info);
        self.renderToolbar(self.data.daily);
      });
    }
    draw();


    $(window).on('resize', function() { self.rebuild(); });
    $('#chart-view').on('resize', function(){ self.rebuild(); });
    $('#rsi > .wrapper > .buttons > .close').on('click', function() {
      $('#rsi').slideUp(500);
      $('#rsi-checkbox').attr('checked', false);
    });

    $('#macd > .wrapper > .buttons > .close').on('click', function() {
      $('#macd').slideUp(500);
      $('#macd-checkbox').attr('checked', false);
    });



  },
  rebuild: function () {
    this.defaults.width = $('#content').width();
    var snapshot = $('#snapshot');
    if(snapshot.width() >= 900){
      snapshot.css('height','81px');
        $('.btn-buy-sell-wrapper').css('float','right');
    } else if(snapshot.width() >=600) {
      snapshot.css('height','150px');
        $('.btn-buy-sell-wrapper').css('float','none');
    }
    this.indexChart.init();
    this.buildSentimentChart();
    this.buildRSIChart();
    this.buildMacdChart();
  },
  data: {
    daily:{},
    sentiment: {}
  },
  indexChart: {
    properties: {
    },
    init: function () {
      this.horizontalScroll();

      this.setProperties();

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
    setProperties: function (options) {
      //review
      var properties = {
        width: ChartView.defaults.width - 122,
        height: 400,
        margin: { top: 30, right: 0, bottom: 30, left: 0 },
        volumeHeight: 50,
        interval: 40,
        zoomFactor: ChartView.indexChart.properties.zoomFactor || 1
      };

      if (options) {
        for (var key in options) {
          properties[key] = options[key];
        }
      }
      this.properties = $.extend(true, {}, properties);
    },
    drawGraph: function(isNew, y1, y2, x, v, chart) {
      //not a fan of this.
      //it builds up the memory stack
      var prop = this.properties,
      containerWidth = prop.width,
      height         = prop.height,
      graphWidth     = containerWidth * prop.zoomFactor,
      margin         = prop.margin,
      data           = ChartView.data || this.data,
      interval       = prop.interval,
      zoomFactor     = prop.zoomFactor,
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
      .text(function(d,i){ return i%interval===0 ? toDate(d.rdate) : ''; });

      //sentimetal rect bars 
      gvolume
      .attr('class','volume')
      .selectAll('rect')
      .data(data.daily.stockLine)
      .enter().append('svg:rect')
      .attr('x', function(d,i) { return x(i); })
      .attr('y', function(d) { return height - margin.bottom - v(d.volumn); })
      .attr('height', function(d) { return v(d.volumn); })
      .attr('width', function(d) { return 0.8 * (containerWidth * zoomFactor - margin.left - margin.right)/data.daily.stockLine.length; })
      .attr('fill', '#4d4d4d');

      //rectangles of the candlesticks graph
      gcandlesticks
      .attr('class','candlesticks')
      .selectAll('rect')
      .data(data.daily.stockLine)
      .enter().append('svg:rect')
      .attr('x', function(d, i) { return x(i); })
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
      .attr('x1', function(d, i) { return x(i) + 0.4 * (containerWidth * zoomFactor - margin.left - margin.right)/data.daily.stockLine.length; })
      .attr('x2', function(d, i) { return x(i) + 0.4 * (containerWidth * zoomFactor - margin.left - margin.right)/data.daily.stockLine.length; })
      .attr('y1', function(d) { return y2(d.highpx); })
      .attr('y2', function(d) { return y2(d.lowpx); })
      .attr('stroke', function(d){ return d.openpx > d.closepx ? '#f65c4e' : '#3bbb57'; })

      var xInverse = function(xPos){
        var leftEdges = x.range(), // starting position of each column bar
        width = x.rangeBand(), //rangeBand = width of each column bar
        j;

        //while mouse's x position is greater than the right most edge of the column
        //increment j

        //if mouse is in the first column, return 0
        //if mouse is in the last column, 

        for (j = 0; xPos > (leftEdges[j] + width); j++) {} 
        return j;
      };

      //tooltips
      tooltip
      .attr('class', 'mouseover-overlay')
      .attr('fill', 'transparent')
      .attr('x', margin.left)
      .attr('y', margin.top)
      .attr('width', graphWidth-margin.left-margin.right)
      .attr('height', height-margin.top-margin.bottom)
      .on('mouseover', function(e){
        return Tooltip.show(); })
        .on('mouseout', function(){ 
          return Tooltip.hide(); })
          .on('mousemove', function(){
            var xPos = d3.mouse(this)[0],
            j = xInverse(xPos),
            d = d2 = data.daily.stockLine[j];

            var model = {
              top: d3.event.layerY-5,
              left: containerWidth-d3.event.layerX>150 ? d3.event.layerX+100 : d3.event.layerX-155,
              date: d.rdate,
              security: d,
              sentiment: {
                price: d2.moodindex,
                change: d2.change
              }
            };
            return Tooltip.render(model);
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
    //builds and draw the graph's initial state
    build: function () {

      $('#chart').empty();
      $('#chart-label').empty();

      var data = ChartView.data || this.data;

      data.sentiment.indexList.length = data.daily.stockLine.length;

      var containerWidth = this.properties.width;
      var graphWidth = this.properties.width * this.properties.zoomFactor;
      var height = this.properties.height;
      var margin = this.properties.margin;
      var volumeHeight = this.properties.volumeHeight;
      var interval = this.properties.interval;


      var chart = d3.select('#chart')
      .append('svg:svg')
      .attr('class', 'chart')
      .attr('width', graphWidth)
      .attr('height', height);

      var chart_label = d3.select('#chart-label')
      .append('svg:svg')
      .attr('class', 'chart')
      .attr('width', containerWidth + 100)
      .attr('height', height);

      var y1 = d3.scale.linear()
      .domain([d3.min(data.daily.stockLine.map(function(x) { return +x.moodindex; })), d3.max(data.daily.stockLine.map(function(x){return +x.moodindex; }))])
      .range([height-margin.bottom, margin.top]);

      var y2 = d3.scale.linear()
      .domain([d3.min(data.daily.stockLine.map(function(x) { return +x.lowpx; })), d3.max(data.daily.stockLine.map(function(x){return +x.highpx; }))])
      .range([height-margin.bottom, margin.top]);

      var x = d3.scale.ordinal()
      .domain(data.daily.stockLine.map(function(x) { return x.rdate; }))
      .rangeBands([margin.left, graphWidth-margin.right]); //inversed the x axis because api came in descending order

      var v = d3.scale.linear()
      .domain([0, d3.max(data.daily.stockLine.map(function(d){ return +d.volumn;}))])
      .range([0, volumeHeight]);

      // // Returns nearest data index given a mouse x position
      // var xInverse = function(xPos){

      //   var leftEdges = x.range(),
      //   width = x.rangeBand(),
      //   j;
      //   for (j = 0; xPos > (leftEdges[j] + width); j++) {}
      //   return j;
      // };

      chart_label.append('svg:line')
      .attr('class', 'xaxis')
      .attr('x1', margin.left)
      .attr('x2', containerWidth - margin.right + 122)
      .attr('y1', height - margin.bottom - 25)
      .attr('y2', height - margin.bottom - 25)
      .attr('stroke', '#464646');

      //border
      chart_label.append('svg:line')
      .attr('class', 'xaxis')
      .attr('x1', 0)
      .attr('x2', containerWidth)
      .attr('y1', height - margin.bottom - 25)
      .attr('y2', height - margin.bottom - 25)
      .attr('stroke', '#464646')
      .attr('stroke-width', '0.5px');

      chart_label.append('svg:line')
      .attr('class', 'border-left')
      .attr('x1', margin.left + 50)
      .attr('x2', margin.left + 50)
      .attr('y1', height - margin.bottom)
      .attr('y2', 0)
      .attr('stroke', '#464646');

      chart_label.append('svg:line')
      .attr('class', 'border-right')
      .attr('x1', containerWidth - margin.right + 50)
      .attr('x2', containerWidth - margin.right + 50)
      .attr('y1', height - margin.bottom)
      .attr('y2', 0)
      .attr('stroke', '#464646');

      //top border
      chart_label.append('svg:line')
      .attr('class', 'border-top')
      .attr('x1', margin.left + 50)
      .attr('x2', containerWidth - margin.right + 50)
      .attr('y1', margin.top - 15)
      .attr('y2', margin.top - 15)
      .attr('stroke', '#464646');

      chart_label.append('svg:line')
      .attr('class', 'border-top')
      .attr('x1', 0)
      .attr('x2', containerWidth + 100)
      .attr('y1', margin.top - 15)
      .attr('y2', margin.top - 15)
      .attr('stroke', '#464646')
      .attr('stroke-width', '0.5px');


      //Horizontal guide lines
      // chart_label.append('g')
      // .attr('class','ylines')
      // .selectAll('line.y1')
      // .data(y1.ticks(5))
      // .enter().append('svg:line')
      // .attr('class', 'y1')
      // .attr('x1', margin.left)
      // .attr('x2', containerWidth + 100)
      // .attr('y1', y1)
      // .attr('y2', y1)
      // .attr('stroke', '#464646');


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
      .text(function(d,i){ return i%interval===0 ? toDate(d.rdate) : ''; });


      // left y-axis labels
      chart_label.append('g')
      .attr('class','y1labels')
      .selectAll('text.yrule')
      .data(y1.ticks(5))
      .enter().append('svg:text')
      .attr('class', 'yrule')
      .attr('x', 20)
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
      .attr('x', containerWidth-margin.right + 80)
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


      //Horizontal guide lines
      // chart_label.append('g')
      // .attr('class','ylines')
      // .selectAll('line.y1')
      // .data(y1.ticks(5))
      // .enter().append('svg:line')
      // .attr('class', 'y1')
      // .attr('x1', margin.left)
      // .attr('x2', containerWidth + 100)
      // .attr('y1', y1)
      // .attr('y2', y1)
      // .attr('stroke', '#464646');

      $('#ma60-label').text(' MA60=' + ChartModel.calcMovingAvg(60, 2));
      $('#ma20-label').text(' MA20=' + ChartModel.calcMovingAvg(20, 2));
      $('#ma10-label').text(' MA10=' + ChartModel.calcMovingAvg(10, 2));
      $('#ma5-label').text(' MA5=' + ChartModel.calcMovingAvg(5, 2));

      this.drawGraph(true, y1, y2, x, v, chart);

    },
  redraw: function (zoomFactor) {
    this.setProperties({
      zoomFactor: this.properties.zoomFactor * zoomFactor
    });
    var data = ChartView.data;
    var containerWidth = this.properties.width;
    var graphWidth = this.properties.width * this.properties.zoomFactor;
    var height = this.properties.height;
    var margin = this.properties.margin;
    var volumeHeight = this.properties.volumeHeight;
    var interval = this.properties.interval;

    var self = this;

    var y1 = d3.scale.linear()
    .domain([d3.min(data.daily.stockLine.map(function(x) { return +x.moodindex; })), d3.max(data.daily.stockLine.map(function(x){return +x.moodindex; }))])
    .range([height-margin.bottom, margin.top]);

    var y2 = d3.scale.linear()
    .domain([d3.min(data.daily.stockLine.map(function(x) { return +x.lowpx; })), d3.max(data.daily.stockLine.map(function(x){return +x.highpx; }))])
    .range([height-margin.bottom, margin.top]);

    var x = d3.scale.ordinal()
    .domain(data.daily.stockLine.map(function(x) { return x.rdate; }))
    .rangeBands([margin.left, graphWidth-margin.right]);

    var v = d3.scale.linear()
    .domain([0, d3.max(data.daily.stockLine.map(function(d){ return +d.volumn;}))])
    .range([0, volumeHeight]);

    var chart = d3.select('#chart')
    .attr('width', graphWidth)
    .select('svg')
    .attr('width', graphWidth);
       this.drawGraph(false, y1, y2, x, v, chart);
  },
  },
  buildSentimentChart: function(){
    $('#sentiment-chart').empty();

    var data = ChartView.data,
  width = this.defaults.width,
  height = 200,
  margin = { top: 30, right: 50, bottom: 30, left: 50 },
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
  .range([margin.left, width-margin.right]);

  chart.append('svg:line')
  .attr('class', 'xaxis')
  .attr('x1', margin.left)
  .attr('x2', width - margin.right)
  .attr('y1', height - margin.bottom)
  .attr('y2', height - margin.bottom)
  .attr('stroke', '#464646');

  chart.append('svg:line')
  .attr('class', 'xborder-bottom')
  .attr('x1', 0)
  .attr('x2', width)
  .attr('y1', height - margin.bottom)
  .attr('y2', height - margin.bottom)
  .attr('stroke', '#464646')
  .attr('stroke-width', '0.5px');

  chart.append('svg:line')
  .attr('class', 'xborder-top')
  .attr('x1', 0)
  .attr('x2', width)
  .attr('y1', margin.bottom - 20)
  .attr('y2', margin.bottom - 20)
  .attr('stroke', '#464646')
  .attr('stroke-width', '0.5px');

  chart.append('svg:line')
  .attr('class', 'xborder-top-thick')
  .attr('x1', margin.left)
  .attr('x2', width - margin.right)
  .attr('y1', margin.bottom - 20)
  .attr('y2', margin.bottom - 20)
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
      return d.getDate() + '-' + d.getHours() + ':' + (d.getMinutes() < 10? '0' + d.getMinutes(): d.getMinutes());
    }
  });

  chart.append('g')
  .attr('class','y1labels')
  .selectAll('text.yrule')
  .data(y1.ticks(5))
  .enter().append('svg:text')
  .attr('class', 'yrule')
  .attr('x', 10)
  .attr('y', y1)
  .attr('text-anchor', 'middle')
  .text(String);

  chart.append('svg:line')
  .attr('class', 'yborder-left')
  .attr('x1', margin.left)
  .attr('x2', margin.left)
  .attr('y1',  height - margin.top)
  .attr('y2', margin.bottom - 20)
  .attr('stroke', '#464646');

  chart.append('svg:line')
  .attr('class', 'yborder-right')
  .attr('x1',  width - margin.right)
  .attr('x2', width - margin.right)
  .attr('y1',  height - margin.top)
  .attr('y2', margin.bottom - 20)
  .attr('stroke', '#464646');

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

    var news = d3.select('body').append('div')
    .attr('class', 'news-bubble').style('opacity', 0);

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

      tooltip.html('<div class="tooltip-date"> 日期： ' + toDate(d.rdate) + '   ' + d.clock.slice(0, -3) + '</div>' + 
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


    //draw on another graph, overlay the divs

    var securityLine = d3.svg.line()
    .x(function(d,i) { return x(d.timestamp); })
    .y(function(d) { return y2(+d.price); })
    .interpolate('basis');

    chart.append('path')
    .datum(data.sentiment.indexList)
    .attr('class','security')
    .attr('d', securityLine)
    .attr('stroke', '#fff')
    .attr('fill', 'none');
},
buildRSIChart: function(){
  // rsi-chart
  $('#rsi-chart').empty();

  var data = ChartView.data;
  var width = this.defaults.width,
  height = 200,
  margin = { top: 30, right: 50, bottom: 30, left: 50 },
  interval = 40;

  var chart = d3.select('#rsi-chart')
  .append('svg:svg')
  .attr('class', 'chart')
  .attr('width', width)
  .attr('height', height);

  var y2 = d3.scale.linear()
  .domain([d3.min(data.daily.stockLine.map(function(x) {return +x.rsi6; })), d3.max(data.daily.stockLine.map(function(x){return +x.rsi6; }))])
  .range([height-margin.top, margin.bottom]);

  var x = d3.scale.ordinal()
  .domain(data.daily.stockLine.map(function(x) { return x.rdate; }))
  .rangeBands([margin.left, width-margin.right]); //inversed the x axis because api came in descending order

  chart.append('svg:line')
  .attr('class', 'xborder-bottom')
  .attr('x1', 0)
  .attr('x2', width)
  .attr('y1', height - margin.bottom)
  .attr('y2', height - margin.bottom)
  .attr('stroke', '#464646')
  .attr('stroke-width', '0.5px');

  chart.append('svg:line')
  .attr('class', 'xborder-top')
  .attr('x1', 0)
  .attr('x2', width)
  .attr('y1', margin.bottom - 20)
  .attr('y2', margin.bottom - 20)
  .attr('stroke', '#464646')
  .attr('stroke-width', '0.5px');

  chart.append('svg:line')
  .attr('class', 'guideline-80')
  .attr('x1', margin.left)
  .attr('x2', width - margin.right)
  .attr('y1', margin.bottom + 10)
  .attr('y2', margin.bottom + 10)
  .attr('stroke', '#464646');

  chart.append('svg:line')
  .attr('class', 'guideline-20')
  .attr('x1', margin.left)
  .attr('x2', width - margin.right)
  .attr('y1', height - margin.bottom - 25)
  .attr('y2', height - margin.bottom - 25)
  .attr('stroke', '#464646');


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
  .attr('x1',  width - margin.right)
  .attr('x2', width - margin.right)
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
  .text(function(d,i){ return i%interval===0 ? toDate(d.rdate) : ''; });

  chart.append('g')
  .attr('class','y2labels')
  .selectAll('text.yrule')
  .data(y2.ticks(5))
  .enter().append('svg:text')
  .attr('class', 'yrule')
  .attr('x', width-margin.right + 20)
  .attr('y', y2)
  .attr('text-anchor', 'middle')
  .text(String);

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
    .attr('class','sentiment')
    .attr('d', line)
    .attr('stroke', color)
    .attr('fill', 'none');
  }

  plotRSI(6,'#fff');
  plotRSI(12,'#d8db74');
  plotRSI(24,'#784e7a');

},
buildMacdChart: function(){
  $('#macd-chart').empty();

  var data = ChartView.data;
  var width = this.defaults.width,
  height = 200,
  margin = { top: 30, right: 50, bottom: 30, left: 50 },
  interval = 40;

  var chart = d3.select('#macd-chart')
  .append('svg:svg')
  .attr('class', 'chart')
  .attr('width', width)
  .attr('height', height);

  var y2 = d3.scale.linear()                                   // times 2 to make sure the histogram will not cover the graph
  .domain([d3.min(data.daily.stockLine.map(function(x) {return (+x.macd)*2; })), d3.max(data.daily.stockLine.map(function(x){return (+x.macd)*2; }))])
  .range([ height-margin.top,  margin.bottom]);

  var x = d3.scale.ordinal()
  .domain(data.daily.stockLine.map(function(x) { return x.rdate; }))
  .rangeBands([ margin.left, width-margin.right]); //inversed the x axis because api came in descending order

  chart.append('svg:line')
  .attr('class', 'xborder-bottom')
  .attr('x1', 0)
  .attr('x2', width)
  .attr('y1', height - margin.bottom)
  .attr('y2', height - margin.bottom)
  .attr('stroke', '#464646')
  .attr('stroke-width', '0.5px');

  chart.append('svg:line')
  .attr('class', 'xborder-top')
  .attr('x1', 0)
  .attr('x2', width)
  .attr('y1', margin.bottom - 20)
  .attr('y2', margin.bottom - 20)
  .attr('stroke', '#464646')
  .attr('stroke-width', '0.5px');

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
  .attr('x1',  width - margin.right)
  .attr('x2', width - margin.right)
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
  .text(function(d,i){ return i%interval===0 ? toDate(d.rdate) : ''; });

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
  plotMACD('dif', '#236a82');

  function plotMACD(type, color){
    var line = d3.svg.line()
    .x(function(d,i) { return x(i); })
    .y(function(d)   {
      return type === 'dea'? y2(d.dea): y2(d.diff); })
      .interpolate('linear');

      chart.append('path')
      .datum(data.daily.stockLine)
      .attr('class','sentiment')
      .attr('d', line)
      .attr('stroke', color)
      .attr('fill', 'none');
  }

  var gcandlesticks = chart.append('g').attr('class','candlesticks');

  //rectangles of the candlesticks graph
  gcandlesticks
  .attr('class','candlesticks')
  .selectAll('rect')
  .data(data.daily.stockLine)
  .enter().append('svg:rect')
  .attr('x', function(d, i) { return x(i); })
  .attr('y', function(d) { return y2(d.macd); })
  .attr('height', function(d) {
    return Math.abs(d.dea-d.diff); })
    .attr('width', function(d) { return 0.8 * (width - margin.right)/data.daily.stockLine.length; })
    .attr('fill', function(d) { return d.dea > d.diff ? '#f65c4e' : '#3bbb57'; });


    $('#macd-checkbox').change(function(){
      $('#macd').css('display', $(this).is(':checked')? 'block':'none');
    });;



}
};

