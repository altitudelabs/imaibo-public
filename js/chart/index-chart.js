var IndexChart = {
  properties: {
    isDragging: false,
    mouseXPosOnDrag: 0,
    pixelDiff: 0,
  },
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
    this.drawGraph(true);
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

    var chart = d3.select('#chart')
    .append('svg:svg')
    .attr('class', 'chart')
    .attr('id', 'graph')
    .attr('height', height);

    // $('#chart-container').slimScroll({
    //   height: (height+20).toString() + 'px',
    //   width: chartWidth.toString() + 'px',
    //   color: '#ffcc00',
    // });

    // $('#price .slimScrollDiv').css('position', 'absolute')
    // .css('top', '9px')
    // .css('left', '45px')
    // .css('width', chartWidth.toString() + 'px');

    var chart_label = d3.select('#chart-label')
    .append('svg:svg')
    .attr('class', 'chart')
    .attr('width', containerWidth + 120)
    .attr('height', height);

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

    chart_label.append('svg:line')
    .attr('class', 'xaxis')
    .attr('x1', margin.left)
    .attr('x2', margin.left + chartWidth) //shift to the left
    .attr('y1', height - margin.bottom + 4) //offseting the border width
    .attr('y2', height - margin.bottom + 4) //offseting the border width
    .attr('stroke', 'rgb(77, 77, 77)')
    .attr('stroke-width', '2px');

    chart_label.append('svg:line')
    .attr('class', 'border-left')
    .attr('x1', margin.left)
    .attr('x2', margin.left)
    .attr('y1', height - margin.bottom + 4) //accounting border width
    .attr('y2', margin.top)
    .attr('stroke', 'rgb(77, 77, 77)')
    .attr('stroke-width', '2px');

    chart_label.append('svg:line')
    .attr('class', 'border-right')
    .attr('x1', containerWidth - margin.right )
    .attr('x2', containerWidth - margin.right )
    .attr('y1', height - margin.bottom + 4) //accounting border width
    .attr('y2', margin.top)
    .attr('stroke', 'rgb(77, 77, 77)')
    .attr('stroke-width', '2px');

    //top border
    chart_label.append('svg:line')
    .attr('class', 'border-top')
    .attr('x1', margin.left)
    .attr('x2', containerWidth - margin.right )
    .attr('y1', margin.top)
    .attr('y2', margin.top)
    .attr('stroke', 'rgb(77, 77, 77)')
    .attr('stroke-width', '2px');

    if(!ChartView.data.indexError) {
      var y1 = ChartView.y1(data, height ,'moodindex');
      var y2 = ChartView.y2(data, height, 'highpx', 'lowpx');
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
      .style('fill','rgb(129, 129, 129)')
      .text(String);

      // right y-axis labels
      chart_label.append('g')
      .attr('class','y2labels')
      .selectAll('text.yrule')
      .data(y2.ticks(5))
      .enter().append('svg:text')
      .attr('class', 'yrule')
      .attr('x', containerWidth-margin.right + 18)
      .attr('y', y2)
      .attr('text-anchor', 'middle')
      .style('fill','rgb(129, 129, 129)')
      .text(String);
    }


    // Update MA labels
    // pointless to update to the same thing everytime, so I comment them out
    //$('#ma60-label').text(' MA60');
    //$('#ma20-label').text(' MA20');
    //$('#ma10-label').text(' MA10');
    //$('#ma5-label').text(' MA5');
  },
  drawGraph: function(isNew) {
    //////////////////////PRIVATE HELPER FUNCTIONS BELOW//////////////////////
    /*
     * args:
     *  - color: string, in hex.
     *           e.g. '#fff', '#9f34a1'
     *  - id: what you want to id your line as. Don't put '#'
     *        e.g 'ma5', 'ma10'. NOT 'ma5-line'
     */
    function plotLine(color ,id) {
      var _id = (id == 'sentimentLine'? 'sentimentLine': id + '-line'); // _id concats into, e.g, ma5-line
      var line = d3.svg.line()
                       .x(function(d, i) { return x(i); })
                       .y(function(d) {
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

      if(id != 'sentimentLine') {
        var checkbox = $('#' + id + '-checkbox');
        if (IE8)
          d3.select('#'+ id + '-line').style('stroke-opacity', checkbox.checked? '1':'0');
        else
          d3.select('#'+ id + '-line').style('opacity', checkbox.is(':checked')? 1:0);
      }
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
    data        = ChartView.data,
    interval    = this.properties.interval,
    zoomFactor  = prop.zoomFactor,
    x           = ChartView.x(data.daily.stockLine, 'rdate'),
    v           = ChartView.v(data.daily.stockLine, 'volumn'),
    y1          = ChartView.y1(data.daily.stockLine, this.properties.height, 'moodindex'),
    y2          = ChartView.y2(data.daily.stockLine, this.properties.height, 'highpx', 'lowpx'),
    xlabels,
    gvolume,
    gcandlesticks,
    glinestems,
    tooltip,
    horizontal,
    horizontalText,
    horizontalBlock;

    var chart = d3.select('#chart').attr('width', graphWidth)
                  .select('svg').attr('width', graphWidth);
                              // .attr('height', height);

    var chart_label = d3.select('#chart-label').attr('width', width)
                        .select('svg').attr('width', width);
                                    // .attr('height', height);

    $('#chart-container').css('width', chartWidth.toString() + 'px');

    if(isNew) {
      xlabels = chart.append('g').attr('class','xlabels');
      gvolume = chart.append('g').attr('class','volume');
      gcandlesticks = chart.append('g').attr('class','candlesticks');
      glinestems = chart.append('g').attr('class','linestems');

      horizontal = chart.append('svg:line')
                              .attr('class', 'ylabelLine')
                              .attr('id', 'ylabelLine');
      horizontalBlock = chart_label.append('svg:rect')
                                   .attr('id','horizontal-block');
      horizontalText  = chart_label.append('text')
                                   .attr('id', 'horizontal-text');

      tooltip = chart.append('rect')
                     .attr('class', 'mouseover-overlay')
                     .attr('id', 'index-overlay')
                     .attr('fill', 'transparent');
    }
    else {
      xlabels = chart.selectAll('g.xlabels');
      gvolume = chart.selectAll('g.volume');
      gcandlesticks = chart.selectAll('g.candlesticks');
      glinestems = chart.selectAll('g.linestems');

      horizontal = chart.selectAll('line.ylabelLine');
      horizontalBlock = chart_label.select('#horizontal-block');
      horizontalText  = chart_label.select('#horizontal-text');

      chart.selectAll('g.xlabels').selectAll('text.xrule').remove();
      chart.selectAll('g.volume > rect').remove();
      chart.selectAll('g.candlesticks > rect').remove();
      chart.selectAll('g.linestems > line').remove();
      chart.selectAll('svg > .line').remove();

      //need refinements
      tooltip = chart.selectAll('rect.mouseover-overlay#index-overlay');
      tooltip.remove();
      tooltip = chart.append('rect')
                     .attr('class', 'mouseover-overlay')
                     .attr('id', 'index-overlay')
                     .attr('fill', 'transparent');
    }

    // SET X-AXIS LABELS BELOW
    var months = [];
    var xLabelData = data.daily.stockLine.filter(function (e, i) {
      var month = new Date(e.timestamp * 1000).getMonth();
      if (!months.length){ months.push(month); }
      if (months.indexOf(month) === -1) {
        months.push(month);
        return true;
      }
      return false;
    });

    xlabels
    .selectAll('text.xrule')
    .data(xLabelData)
    .enter().append('svg:text')
    .attr('class', 'xrule')
    .attr('x', function(d,i){ return x(d.rdate); })
    .attr('y', height-margin.bottom+15)
    .attr('text-anchor', 'middle')
    .text(function(d,i) {
      var today = new Date();

      if(today.getDate() < 10 && i === xLabelData.length-1)
        return '';
      else
        return Helper.toDate(d.rdate, 'yyyy/mm');
    });

    // SENTTIMENTAL RECT BARS BELOW
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

    // RECTANGLES OF THE CANDLESTICKS GRAPH BELOW
    gcandlesticks
    .attr('class','candlesticks')
    .selectAll('rect')
    .data(data.daily.stockLine)
    .enter().append('svg:rect')
    .attr('x', function(d, i) { return x(i) - 2.8*zoomFactor; })
    .attr('y', function(d) {
      var closepx = d.closepx? d.closepx:d.preclosepx;
      return y2(max(d.openpx, closepx)); 
    })
    .attr('height', function(d) {
      var closepx = d.closepx? d.closepx:d.preclosepx;
      return y2(min(d.openpx, closepx))-y2(max(d.openpx, closepx)); 
    })
    .attr('width', function(d) { return 0.8 * (graphWidth)/data.daily.stockLine.length; })
    .attr('fill', function(d) { return d.openpx < d.closepx ? '#e24439' : '#1ba767'; });

    // VERTICAL LINES OF THE CANDLESTICKS GRAPH BELOW
    glinestems
    .attr('class','linestems')
    .selectAll('line.stem')
    .data(data.daily.stockLine)
    .enter().append('svg:line')
    .attr('class', 'stem')
    .attr('x1', function(d, i) { return x(i) - 2.8 * zoomFactor + 0.4 * (graphWidth - margin.left - margin.right) / data.daily.stockLine.length; })
    .attr('x2', function(d, i) { return x(i) - 2.8 * zoomFactor + 0.4 * (graphWidth - margin.left - margin.right) / data.daily.stockLine.length; })
    .attr('y1', function(d) { return y2(d.highpx); })
    .attr('y2', function(d) { return y2(d.lowpx); })
    .attr('stroke', function(d){ return d.openpx < d.closepx ? '#e24439' : '#1ba767'; });

    // ADD SENTIMENTLINE AND MA LINES (before appending horizontal line so that they are below the red line)
    plotLine('#25bcf1',  'sentimentLine');
    plotLine('#fff',  'ma5');
    plotLine('#d8db74', 'ma10');
    plotLine('#94599d', 'ma20');
    plotLine('#36973a', 'ma60');

    // SET TOOLTIP INITIAL PROPERTIES BELOW
    tooltip
    .attr('fill-opacity', 0)
    .attr('x', 0)
    .attr('y', margin.top)
    .attr('width', graphWidth)
    .attr('height', height - margin.top - margin.bottom);

    // SET EVENT HANDLERS BELOW
    tooltip
    .on('mouseover', function(e) { 
      return Tooltip.show(); 
    })
    .on('mouseout', function() {
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
      var d = data.daily.stockLine[j];

      updateMAValue('5', d.ma5);
      updateMAValue('10', d.ma10);
      updateMAValue('20', d.ma20);
      updateMAValue('60', d.ma60);

      var length = data.daily.stockLine.length;
      d.closepx = d.closepx? d.closepx : d.preclosepx;
      d.moodindexchg = d.moodindexchg? d.moodindexchg : data.daily.stockLine[j].moodindex - data.daily.stockLine[j-1].moodindex;

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

      var opacity = (yPos > 10 && yPos < 226) ? 100:0;

      horizontalText
      .attr('x', width - 37)
      .attr('y', yPos + 3)
      .attr('text-anchor', 'left')
      .text(cursorPriceLevel.toFixed(0))
      .style('fill-opacity', opacity)
      .style('fill', 'white');

      horizontal
      .attr('x1', 0)
      .attr('x2', graphWidth)
      .attr('y1', yPos) //make it line up with the label
      .attr('y2', yPos)
      .attr('stroke', '#f65c4e')
      .style('stroke-opacity', opacity);

      horizontalBlock
      .attr('rx', 4)
      .attr('ry', 4)
      .attr('x', chartWidth+margin.left+1)
      .attr('y', yPos-10)
      .attr('height', 20)
      .attr('width',  margin.right)
      .attr('fill', '#f65c4e')
      .style('fill-opacity', opacity);

      return Tooltip.render.index(model);
    });
  },
  setDragability: function() {
    var props = this.properties;

    $('#chart').on('mousedown', function(event) {
        props.isDragging = true;
        props.mouseXPosOnDrag = event.clientX;
    });

    $('#chart').on('mousemove', function(event) {
      if (props.isDragging) {
        props.pixelDiff = event.clientX - props.mouseXPosOnDrag;
      }
    });

    $('#chart').on('mouseup', function(event) {
      props.isDragging = false;
    });
  }
};

