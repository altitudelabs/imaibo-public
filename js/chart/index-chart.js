var IndexChart = {
  properties: {
    isDragging: false,
    mouseXPosOnDrag: 0,
    pixelDiff: 0,
  },
  isDrawing: false,
  setProperties: function(options) {
    var properties = {
      height: 250,
      interval: 30,
    };
    if (options) {
      for (var key in options) {
        properties[key] = options[key];
      }
    }
    this.properties = $.extend(true, {}, properties);
  },
  init: function() {
    this.setProperties();
    this.drawContainer();
    this.drawGraph();
    this.setDragability();
  },
  initWithError: function(){
    this.setProperties();
    this.drawContainer();
    $('#price').append('<div class="empty-data" id="index-no-data">暂时无法下载数据，请稍后再试</div>');
    $('#toolbar').remove();
    $('#legend').remove();
  },
  drawContainer: function () {
    $('#chart').empty();
    $('#chart-label').empty();

    var com = this.components = {};

    var data = ChartView.data;

    // data.sentiment.indexList.length = data.daily.stockLine.length;

    //Inheriting from ChartView
    var containerWidth = ChartView.properties.width;
    var margin     = ChartView.properties.margin;
    var chartWidth = containerWidth - margin.left - margin.right;
    var zoomFactor = ChartView.properties.zoomFactor;
    var graphWidth = chartWidth * zoomFactor;
    var volumeHeight = ChartView.properties.volumeHeight;
    var interval = ChartView.properties.interval;

    //index chart defined.
    var height = this.properties.height;

    com.chart = d3.select('#chart')
              .append('svg:svg')
              .attr('class', 'chart')
              .attr('id', 'graph')
              .attr('height', height);

    com.chartLabel = d3.select('#chart-label')
              .append('svg:svg')
              .attr('class', 'chart')
              .attr('width', containerWidth + 120)
              .attr('height', height);

    var chartLabel = com.chartLabel;
    var chart = com.chart;

    data = ChartView.data.daily.stockLine;

    // var x = ChartView.x(data, 'rdate');


    // chart_label.append('svg:line')
    // .attr('class', 'horizontal-line')
    // .attr('x1', margin.left)
    // .attr('x2', margin.left + chartWidth) //shift to the left
    // .attr('y1', height - margin.bottom)
    // .attr('y2', height - margin.bottom)
    // .attr('stroke', '#25bcf1')
    // .attr('stroke-width', '2px')
    // .on('mouseover', function(e){ return Tooltip.show(); })
    // .on('mousemove', function() {
    //   var xPos = d3.mouse(this)[0],
    //    yPos = d3.mouse(this)[1];
    // });

    chartLabel.append('svg:line')
    .attr('class', 'border bottom')
    .attr('x1', margin.left)
    .attr('x2', margin.left + chartWidth) //shift to the left
    .attr('y1', height - margin.bottom + 4) //offseting the border width
    .attr('y2', height - margin.bottom + 4) //offseting the border width
    .attr('stroke', 'rgb(77, 77, 77)')
    .attr('stroke-width', '2px');

    chartLabel.append('svg:line')
    .attr('class', 'border-left')
    .attr('x1', margin.left)
    .attr('x2', margin.left)
    .attr('y1', height - margin.bottom + 4) //accounting border width
    .attr('y2', margin.top)
    .attr('stroke', 'rgb(77, 77, 77)')
    .attr('stroke-width', '2px');

    chartLabel.append('svg:line')
    .attr('class', 'border-right')
    .attr('x1', containerWidth - margin.right )
    .attr('x2', containerWidth - margin.right )
    .attr('y1', height - margin.bottom + 4) //accounting border width
    .attr('y2', margin.top)
    .attr('stroke', 'rgb(77, 77, 77)')
    .attr('stroke-width', '2px');

    //top border
    chartLabel.append('svg:line')
    .attr('class', 'border-top')
    .attr('x1', margin.left)
    .attr('x2', containerWidth - margin.right )
    .attr('y1', margin.top)
    .attr('y2', margin.top)
    .attr('stroke', 'rgb(77, 77, 77)')
    .attr('stroke-width', '2px');

    chartLabel.append('g').attr('class','y1labels');
    chartLabel.append('g').attr('class', 'y2labels');

    chart.append('g').attr('class', 'volumes');
    chart.append('g').attr('class', 'candlesticks');
    chart.append('g').attr('class', 'linestems');
    chart.append('g').attr('class', 'xlabels');
    chart.append('g').attr('class', 'horizontal-line')

    chart.append('path').attr('id', 'sentiment-line');
    chart.append('path').attr('id', 'ma5-line');
    chart.append('path').attr('id', 'ma10-line');
    chart.append('path').attr('id', 'ma20-line');
    chart.append('path').attr('id', 'ma60-line');

    chartLabel.append('rect').attr('id', 'horizontal-block');
    chart.append('line').attr('id', 'horizontal');
    chartLabel.append('text').attr('class', 'horizontal-text');

    chart.append('rect').attr('class', 'mouseover-overlay');

  },
  drawGraph: function(isNew) {
    this.isDrawing = true;
    //////////////////////PRIVATE HELPER FUNCTIONS BELOW//////////////////////
    /*
     * args:
     *  - color: string, in hex.
     *           e.g. '#fff', '#9f34a1'
     *  - id: what you want to id your line as. Don't put '#'
     *        e.g 'ma5', 'ma10'. NOT 'ma5-line'
     */
    function plotLines(type, color) {
      var id = type + '-line'; //e.g. sentiment-line, ma5-line
      var line = getLine(type);
      
      setLineAttr(id, line, color);
      if(type !== 'sentiment') setCheckboxListener(type);
    }

    function getLine(type) {
      return d3.svg.line()
             .x(function(d, i) { return x(i-1); })
             .y(function(d)    { 
              return type === 'sentiment'? y1(d.moodindex):y2(d[type]); })
             .interpolate('linear');
    }

    var self = this;
    function setLineAttr(id, line, color) {
      self.components.chart
        .select('path#' + id)
        .datum(ChartView.data.daily.stockLine)
        .attr('d', line)
        .attr('stroke', color)
        .attr('fill', 'none')
        .attr('id', id);
    }

    function setCheckboxListener(type){
        var checkbox = $('#' + type + '-checkbox');
        if (IE8)
          d3.select('#'+ type + '-line').style('stroke-opacity', checkbox.checked? '1':'0');
        else
          d3.select('#'+ type + '-line').style('opacity', checkbox.is(':checked')? 1:0); 
    }

    function updateMAValue(ma, data){
      var toggled = $('#ma' + ma + '-checkbox').is(':checked');

      if(toggled)
        $('#ma' + ma + '-legend span').text('MA' + ma + ': ' + data);
    }
    //////////////////////PRIVATE HELPER FUNCTIONS ABOVE//////////////////////

    // $('#chart').empty();
    // $('#chart-label').empty();

    //not a fan of this.
    //it builds up the memory stack
    var prop    = ChartView.properties,
    width       = prop.width,
    height      = this.properties.height,
    chartHeight = height - prop.margin.top - prop.margin.bottom,
    chartWidth  = prop.width - prop.margin.left - prop.margin.right,
    graphWidth  = chartWidth * prop.zoomFactor,
    margin      = prop.margin,
    stockLine   = ChartView.data.daily.stockLine,
    interval    = this.properties.interval,
    zoomFactor  = prop.zoomFactor,
    x           = ChartView.x(stockLine, 'rdate'),
    v           = ChartView.v(stockLine, 'volumn'),
    volumeHeight= ChartView.properties.volumeHeight,
    y1          = ChartView.y1(stockLine, this.properties.height, 'moodindex', volumeHeight),
    y2          = ChartView.y2(stockLine, this.properties.height, 'highpx', 'lowpx', volumeHeight),
    xLabelData  = ChartView.getXLabels(),
    gvolume,
    gcandlesticks,
    glinestems,
    tooltip,
    horizontal,
    horizontalText,
    horizontalBlock;

    var com = this.components;
    var chart = com.chart
                .attr('width', graphWidth)
                .select('svg').attr('width', graphWidth);
                              // .attr('height', height);

    var chartLabel = com.chartLabel
                      .attr('width', width)
                      .select('svg').attr('width', width);
                                    // .attr('height', height);

    $('#chart-container').css('width', chartWidth.toString() + 'px');

    //DATA SECTION ======================================================
    var y1Labels = this.components.chartLabel
                    .select('g.y1labels')
                    .selectAll('text.yrule')
                    .data(y1.ticks(5));

    var y2Labels = this.components.chartLabel
                    .select('g.y2labels')
                    .selectAll('text.yrule')
                    .data(y2.ticks(8));


    var volume = this.components.chart
                  .select('g.volumes')
                  .selectAll('rect.bars')
                  .data(stockLine);

    var candlesticks = this.components.chart
                    .select('g.candlesticks')
                    .selectAll('rect.bars')
                    .data(stockLine);

    var linestems = this.components.chart
                      .select('g.linestems')
                      .selectAll('line.lines')
                      .data(stockLine);

    var xLabels = this.components.chart
                  .select('g.xlabels')
                  .selectAll('text.labels')
                  .data(xLabelData);

    var tooltip = this.components.chart
                    .select('rect.mouseover-overlay')
                    .attr('fill-opacity', '0');

    var horizontal = this.components.chart
                      .select('line#horizontal');

    var horizontalBlock = this.components.chartLabel
                          .select('rect#horizontal-block');

    var horizontalText = this.components.chartLabel
                          .select('text.horizontal-text');


    //ENTER LOOP ================================================================

    y1Labels.enter().append('text').attr('class', 'yrule');
    y2Labels.enter().append('text').attr('class', 'yrule');
    volume.enter().append('rect').attr('class', 'bars').transition().duration(1000).attr('fill', 'red').transition().duration(1000).attr('fill', 'rgb(107, 107, 107)');
    candlesticks.enter().append('rect').attr('class', 'bars');
    linestems.enter().append('line').attr('class', 'lines');
    xLabels.enter().append('text').attr('class', 'labels');

    //EXIT LOOP =================================================================

    y1Labels.exit().remove();
    y2Labels.exit().remove();
    volume.exit().remove();
    candlesticks.exit().remove();
    linestems.exit().remove();
    xLabels.exit().remove();


    //UPDATE LOOP ===============================================================

    y1Labels
      .attr('x', margin.left - 15)
      .attr('y', y1)
      .attr('text-anchor', 'middle')
      .style('fill','rgb(129, 129, 129)')
      .text(String);

    y2Labels
      .attr('class', 'yrule')
      .attr('x', width-margin.right + 18)
      .attr('y', y2)
      .attr('text-anchor', 'middle')
      .style('fill','rgb(129, 129, 129)')
      .text(String);

      //shifts the graph to the left but a slight margin
      var xOffset = 10*zoomFactor;
      var verticalOffset = 5; //pixel perfect

      volume
        .attr('x', function(d,i)    { return x(i) - xOffset; })
        .attr('y', function(d)      { return margin.top + chartHeight + verticalOffset - v(d.volumn); })
        .attr('height', function(d) { return v(d.volumn); })
        .attr('width', function(d)  { return 0.8 * graphWidth/stockLine.length; })
        .attr('fill', '#595959');

      candlesticks
        .attr('x', function(d, i) { return x(i) - xOffset; })
        .attr('y', function(d) {
          var closepx = d.closepx? d.closepx:d.preclosepx;
          return y2(max(d.openpx, closepx)); 
        })
        .attr('height', function(d) {
          var closepx = d.closepx? d.closepx:d.preclosepx;
          return y2(min(d.openpx, closepx))-y2(max(d.openpx, closepx)); 
        })
        .attr('width', function(d) { return 0.8 * (graphWidth)/stockLine.length; })
        .attr('fill', function(d) { return d.openpx < d.closepx ? '#e24439' : '#1ba767'; });

      var barCenter = x.rangeBand()/2;
      var offset = barCenter - 0.5*zoomFactor - xOffset;

      linestems
        .attr('x1', function(d, i) { return x(i) + offset; })
        .attr('x2', function(d, i) { return x(i) + offset; })
        .attr('y1', function(d) { return y2(d.highpx); })
        .attr('y2', function(d) { return y2(d.lowpx); })
        .attr('stroke', function(d){ return d.openpx < d.closepx ? '#e24439' : '#1ba767'; });
        
      xLabels
        .attr('x', function(d,i){ return x(d.rdate) + offset; })
        .attr('y', margin.top + chartHeight + 20)
        .attr('text-anchor', 'middle')
        .text(function(d,i) {
          var today = new Date();
          if(today.getDate() < 10 && i === xLabelData.length-1)
            return '';
          else
            return Helper.toDate(d.rdate, 'yyyy/mm');
        });

      // PLOT LINES ===================================================================
      plotLines('sentiment', '#25bcf1');
      plotLines('ma5', '#fff');
      plotLines('ma10', '#d8db74');
      plotLines('ma20',  '#94599d');
      plotLines('ma60', '#36973a');

      // TOOLTIP =====================================================================
      var yOffset = 2; //for pixel perfect. set tooltip.attr('fill-opacity', 100) to see.
      tooltip
        .attr('x', 0)
        .attr('id', 'abc')
        .attr('y', margin.top + yOffset)
        .attr('width', graphWidth)
        .attr('height', chartHeight + margin.top);

      tooltip
        .on('mouseover', function(e) { return Tooltip.show(); })
        .on('mouseout', function()   { 
          horizontalText.style('fill-opacity', 0);
          horizontal.style('stroke-opacity', 0);
          horizontalBlock.style('fill-opacity', 0);

          return Tooltip.hide(); 
        })
        .on('mousemove', function() {
            var xPos, yPos, mouseX, mouseY;

            if(IE8) {
              xPos = event.clientX;
              yPos = event.clientY;
              mouseX = xPos;
              mouseY = yPos;
            }
            else {
              xPos = d3.mouse(this)[0];
              yPos = d3.mouse(this)[1];
              mouseX = d3.event.pageX;
              mouseY = d3.event.pageY;
            }

            var j = ChartView.xInverse((IE8?xPos-55:xPos), x);
            var cursorPriceLevel = y2.invert((IE8?yPos-243:yPos));
            var d = stockLine[j];

            updateMAValue('5', d.ma5);
            updateMAValue('10', d.ma10);
            updateMAValue('20', d.ma20);
            updateMAValue('60', d.ma60);

            var length = stockLine.length;
            d.closepx = d.closepx? d.closepx : d.preclosepx;
            d.moodindexchg = d.moodindexchg? d.moodindexchg : stockLine[j].moodindex - stockLine[j-1].moodindex;

            var model = {
                top: mouseY + 10,
                // 10 = horizontal distance from mouse cursor
                left: chartWidth - mouseX > 135 ? mouseX + 10 : mouseX - 180 - 10,
                // if the right edge touches the right y axis
                // 180 = width of tooltip, 10 = vertical distance from cursor
                date: d.rdate,
                price: cursorPriceLevel,
                security: d,
                sentiment: {
                  price: d.moodindex,
                  change: d.moodindexchg
                }
            };

            horizontalText
            .attr('x', width - 37)
            .attr('y', yPos + 3)
            .attr('text-anchor', 'left')
            .text(cursorPriceLevel.toFixed(0))
            .style('fill-opacity', 100)
            .style('fill', 'white');

            horizontal
            .attr('x1', 0)
            .attr('x2', graphWidth)
            .attr('y1', yPos) //make it line up with the label
            .attr('y2', yPos)
            .attr('stroke', '#f65c4e')
            .style('stroke-opacity', 100);

            horizontalBlock
            .attr('rx', 4)
            .attr('ry', 4)
            .attr('x', chartWidth+margin.left+1)
            .attr('y', yPos-10)
            .attr('height', 20)
            .attr('width',  margin.right)
            .attr('fill', '#f65c4e')
            .style('fill-opacity', 100);

            return Tooltip.render.index(model);
        });
        this.isDrawing = false;
  },
  setDragability: function() {
    // var props = this.properties;

    // $('#chart').on('mousedown', function(event) {
    //     props.isDragging = true;
    //     props.mouseXPosOnDrag = event.pageX;
    // });

    // $('#chart').on('mousemove', function(event) {
    //   if (props.isDragging) {
    //     var el = $('.scroller'), scrolled = el.scrollLeft();
    //     props.pixelDiff = event.clientX - props.mouseXPosOnDrag;
    //     el.scrollLeft(scrolled + (props.mouseXPosOnDrag - event.pageX));

    //     if(el.scrollLeft() === 0) {
    //       ChartView.updateIndexByDrag();
    //       setTimeout(function(){}, 1000);
    //     }
    //   }
    // });

    // $('#chart').on('mouseup', function(event) {
    //   props.isDragging = false;
    // });
  },
  dragBackAnimation: function(){
    $('#graph').animate({'margin-left': '20'}, 500, 'swing', function(){
      $(this).animate({'margin-left': '0'}, 500);
    });
  },
};

