var IndexChart = {
  properties: {
    isDragging: false,
    mouseXPosOnDrag: 0,
    pixelDiff: 0,
  },
  components: {},
  data: {},
  prevLeft: -1,
  currLeft: 0,
  y2Max: undefined,
  setProperties: function(options) {
    var properties = {
      height: 250,
    };
    properties.verticalOffset = 5;
    properties.yOffset = 2;
    if (options) {
      for (var key in options) {
        properties[key] = options[key];
      }
    }
    this.properties = $.extend(true, {}, properties);
  },
  init: function() {
    this.setProperties();
    this.updateData();
    this.appendComponents();
    this.draw();
    this.hideScrollbar();
  },
  initWithError: function(){
    this.setProperties();
    this.draw();
    $('#price').append('<div class="empty-data" id="index-no-data">暂时无法下载数据，请稍后再试</div>');
    $('#toolbar').remove();
    $('#legend').remove();
  },
  updateData: function () {
    var self  = this;
    var props = self.properties;
    // self.data.stockLine  = ChartView.getVisibleStockLine().slice(props.startIndex,props.startIndex + props.dataSetLength);
    self.data.stockLine      = ChartView.getVisibleStockLine();
    // self.data.xLabelData     = ChartView.getXLabels(props.startIndex);
    self.data.xLabelData     = ChartView.getXLabels();
    self.data.y1             = ChartView.y1(props.height, 'moodindex', ChartView.getVolumeHeight());
    self.data.y2             = ChartView.y2(props.height, 'highpx', 'lowpx', ChartView.getVolumeHeight());
    self.data.v              = ChartView.v('volumn');
    self.data.x              = ChartView.x('rdate');
  },
  update: function (options) {
    this.setProperties(options);
    this.updateData();
    this.draw();
  },
  hideScrollbar: function(){
    IndexChart.components.scrollBar
      .style('fill-opacity', 0);
  },
  appendComponents: function () {
    for(var key in this.componentsBuilder){
      this.componentsBuilder[key].append();
    }
  },
  draw: function() {
    var self = this;


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
             .x(function(d, i) {
              return self.data.x(i); })
             .y(function(d)    { 
              return type === 'sentiment'? self.data.y1(d.moodindex):self.data.y2(d[type]); })
             .interpolate('linear');
    }

    function setLineAttr(id, line, color) {
      self.components.chart
        .select('path#' + id)
        .datum(ChartView.getVisibleStockLine())
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

    //////////////////////PRIVATE HELPER FUNCTIONS ABOVE//////////////////////
    self.componentsBuilder.chart.update();
    self.componentsBuilder.chartLabel.update();

    var chartWidth  = ChartView.getContainerWidth() - ChartView.getLeftMargin() - ChartView.getRightMargin();

    $('#chart-container').css('width', chartWidth.toString() + 'px');

    //DATA SECTION ======================================================
    for(var key in self.components){
      if(key === 'chart' || key === 'chartLabel') continue;
      if(self.componentsBuilder[key].linkData){
        self.componentsBuilder[key].linkData(); 
      }
      if(self.componentsBuilder[key].enter){
        self.componentsBuilder[key].enter();
        self.components[key].exit().remove();
      }
      if(self.componentsBuilder[key].update){
        self.componentsBuilder[key].update();
      }
    }
  
    // PLOT LINES ===================================================================
    plotLines('sentiment', '#25bcf1');
    plotLines('ma5', '#fff');
    plotLines('ma10', '#d8db74');
    plotLines('ma20',  '#94599d');
    plotLines('ma60', '#36973a');
  },
  // updateIndexByDrag: function(){
  //   if(!IndexChart.isDrawing){
  //     //calc earliest date 
  //     ChartView.updateChartElements();
  //     ChartView.getPastData();  
  //   }
  // },
  componentsBuilder: {
    chart: {
      append: function () {
        IndexChart.components.chart = d3.select('#chart').append('svg:svg')
                                                         .attr('class', 'chart')
                                                         .attr('id', 'graph');
      },
      update: function () {
        var props = IndexChart.properties;
        var width = ChartView.getChartWidth() * ChartView.getZoomFactor();
        IndexChart.components.chart
        .attr('height', props.height + 20)
        .attr('width', width)
        .select('svg').attr('width', width);
      }
    },
    chartLabel: {
      append: function () {
        IndexChart.components.chartLabel = d3.select('#chart-label').append('svg:svg');
      },
      update: function () {
        var props = IndexChart.properties;
        IndexChart.components.chartLabel
        .attr('class', 'chart')
        .attr('width', ChartView.getContainerWidth())
        .attr('height', props.height)
        .select('svg').attr('width', ChartView.getContainerWidth());
      }
    },
    topBorder: {
      append: function () {
        IndexChart.components.topBorder =  ChartView.appendBorder(IndexChart.components.chartLabel);
      },
      update: function () {
        var props = IndexChart.properties;
        IndexChart.components.topBorder
        .attr('x1', ChartView.getLeftMargin())
        .attr('x2', ChartView.getContainerWidth() - ChartView.getRightMargin())
        .attr('y1', ChartView.getTopMargin())
        .attr('y2', ChartView.getTopMargin());
      }
    },
    rightBorder: {
      append: function () {
        IndexChart.components.rightBorder =  ChartView.appendBorder(IndexChart.components.chartLabel);

      },
      update: function () {
        var props = IndexChart.properties;
        var x = ChartView.getContainerWidth() - ChartView.getRightMargin();

        IndexChart.components.rightBorder
        .attr('x1', x)
        .attr('x2', x)
        .attr('y1', props.height - ChartView.getBottomMargin() + 4) //accounting border width
        .attr('y2', ChartView.getTopMargin());
      }
    },
    bottomBorder: {
      append: function () {
        IndexChart.components.bottomBorder = ChartView.appendBorder(IndexChart.components.chartLabel);
      },
      update: function () {
        var props = IndexChart.properties;
        IndexChart.components.bottomBorder
        .attr('x1', ChartView.getLeftMargin())
        .attr('x2', ChartView.getLeftMargin() + ChartView.getChartWidth()) //shift to the left
        .attr('y1', props.height - ChartView.getBottomMargin() + 4) //offseting the border width
        .attr('y2', props.height - ChartView.getBottomMargin() + 4); //offseting the border width
      }
    },
    leftBorder: {
      append: function () {
        IndexChart.components.leftBorder = ChartView.appendBorder(IndexChart.components.chartLabel);
      },
      update: function () {
        var props = IndexChart.properties;
        IndexChart.components.leftBorder
        .attr('x1', ChartView.getLeftMargin())
        .attr('x2', ChartView.getLeftMargin())
        .attr('y1', props.height - ChartView.getBottomMargin() + 4) //accounting border width
        .attr('y2', ChartView.getTopMargin());
      }
    },
    y1Labels: {
      append: function () {
        IndexChart.components.y1Labels = IndexChart.components.chartLabel.append('g').attr('class','y1labels').selectAll('text.yrule');
      },
      linkData: function () {
        var data = ChartView.getVisibleStockLine().map(function(x) { return +x.moodindex; });
        IndexChart.components.y1Labels = IndexChart.components.y1Labels.data(IndexChart.helpers.getYLabelsData(data));
      },
      enter: function () {
        IndexChart.components.y1Labels.enter().append('text').attr('class', 'yrule');
    
      },
      update: function () {
        var props = IndexChart.properties;
        IndexChart.components.y1Labels
        .attr('x', ChartView.getLeftMargin() - 15)
        .attr('y', IndexChart.data.y1)
        .attr('text-anchor', 'middle')
        .style('fill','rgb(129, 129, 129)')
        .text(function (x) {
          return Math.floor(x);
        });
      }
    },
    y2Labels: {
      append: function () {
        IndexChart.components.y2Labels = IndexChart.components.chartLabel.append('g').attr('class','y2labels').selectAll('text.yrule');
      },
      linkData: function () {
        var data = ChartView.getVisibleStockLine().map(function(x) { return +x.price; });
        var min = d3.min(ChartView.getVisibleStockLine().map(function(x) { return +x.lowpx; }));
        var max = d3.max(ChartView.getVisibleStockLine().map(function(x) { return +x.highpx; }));

        IndexChart.components.y2Labels = IndexChart.components.y2Labels.data(IndexChart.helpers.getYLabelsData([min, max]));
      },
      enter: function () {
        IndexChart.components.y2Labels.enter().append('text').attr('class', 'yrule');
      },
      update: function () {
        var props = IndexChart.properties;
        IndexChart.components.y2Labels
        .attr('class', 'yrule')
        .attr('x', ChartView.getContainerWidth()-ChartView.getRightMargin() + 18)
        .attr('y', IndexChart.data.y2)
        .attr('text-anchor', 'middle')
        .style('fill','rgb(129, 129, 129)')
        .text(function (x) {
          return Math.floor(x);
        });
      }
    },
    volumes: {
      append: function () {
        IndexChart.components.volumes = IndexChart.components.chart.append('g').attr('class', 'volumes').selectAll('rect.bars');
      },
      linkData: function () {
        IndexChart.components.volumes = IndexChart.components.volumes.data(ChartView.getVisibleStockLine());
      },
      enter: function () {
        IndexChart.components.volumes.enter().append('rect').attr('class', 'bars');
      },
      update: function () {
        var props = IndexChart.properties;
        IndexChart.components.volumes
        .attr('x', function(d,i)    { return IndexChart.data.x(i) - ChartView.getZoomFactor(); })
        .attr('y', function(d)      { return props.height - ChartView.getBottomMargin() + props.verticalOffset - IndexChart.data.v(d.volumn); })
        .attr('width', function(d)  { return 0.8 * ChartView.getGraphWidth()/ChartView.getVisibleStockLine().length; })
        .attr('fill', '#595959')
        .attr('height', function(d) { return IndexChart.data.v(d.volumn); });
      }
    },
    candleSticks: {
      append: function () {
        IndexChart.components.candleSticks = IndexChart.components.chart.append('g').attr('class', 'candleSticks').selectAll('rect.bars');
      },
      linkData: function () {
        IndexChart.components.candleSticks = IndexChart.components.candleSticks.data(ChartView.getVisibleStockLine());
      },
      enter: function () {
        IndexChart.components.candleSticks.enter().append('rect').attr('class', 'bars');
      },
      update: function () {
        var props = IndexChart.properties;

        IndexChart.components.candleSticks
        .attr('x', function(d, i) {
         return IndexChart.data.x(i) - 2*ChartView.getZoomFactor(); })
        .attr('y', function(d) {
          var closepx = d.closepx? d.closepx:d.preclosepx;
          return IndexChart.data.y2(max(d.openpx, closepx)); 
        })
        .attr('height', function(d) {
          var closepx = d.closepx? d.closepx:d.preclosepx;
          return IndexChart.data.y2(min(d.openpx, closepx))-IndexChart.data.y2(max(d.openpx, closepx)); 
        })
        .attr('width', function(d) { return 0.8 * (ChartView.getGraphWidth())/ChartView.getVisibleStockLine().length; })
        .attr('fill', function(d) { return d.openpx < d.closepx ? '#e24439' : '#1ba767'; });
      }
    },
    lineStems: {
      append: function () {
        IndexChart.components.lineStems = IndexChart.components.chart.append('g').attr('class', 'lineStems').selectAll('line.lines');
      },
      linkData: function () {
        IndexChart.components.lineStems = IndexChart.components.lineStems.data(ChartView.getVisibleStockLine());
      },
      enter: function () {
        IndexChart.components.lineStems.enter().append('line').attr('class', 'lines');
      },
      update: function () {
        var props = IndexChart.properties;
        var offset = IndexChart.data.x.rangeBand()/2 - 0.5*ChartView.getZoomFactor() - 2*ChartView.getZoomFactor();

        IndexChart.components.lineStems
        .attr('x1', function(d, i) { return IndexChart.data.x(i) + offset; })
        .attr('x2', function(d, i) { return IndexChart.data.x(i) + offset; })
        .attr('y1', function(d) { return IndexChart.data.y2(d.highpx); })
        .attr('y2', function(d) { return IndexChart.data.y2(d.lowpx); })
        .attr('stroke', function(d){ return d.openpx < d.closepx ? '#e24439' : '#1ba767'; });
      }
    },
    xLabels: {
      append: function () {
        IndexChart.components.xLabels = IndexChart.components.chart.append('g').attr('class', 'xlabels').selectAll('text.labels');
      },
      linkData: function () {
        IndexChart.components.xLabels = IndexChart.components.xLabels.data(IndexChart.data.xLabelData);
      },
      enter: function () {
        IndexChart.components.xLabels.enter().append('text').attr('class', 'labels');
      },
      update: function () {
        var props = IndexChart.properties;
        var offset = IndexChart.data.x.rangeBand()/2 - 0.5*ChartView.getZoomFactor();
        IndexChart.components.xLabels
        .attr('x', function(d,i){ return IndexChart.data.x(d.rdate) + offset; })
        .attr('y', props.height - ChartView.getBottomMargin() + 20)
        .attr('text-anchor', 'middle')
        .text(function(d,i) {
          var today = new Date();
          if(i === 0 || today.getDate() < 10 && i === IndexChart.data.xLabelData.length-1)
            return '';
          else
            return Helper.toDate(d.rdate, 'yyyy/mm');
        });
      }
    },
    sentimentLine: {
      append: function () {
        IndexChart.components.sentimentLine = IndexChart.components.chart.append('path').attr('id', 'sentiment-line');
      }
    },
    ma5Line: {
      append: function () {
        IndexChart.components.ma5Line = IndexChart.components.chart.append('path').attr('id', 'ma5-line');
      }
    },
    ma10Line: {
      append: function () {
        IndexChart.components.ma10Line = IndexChart.components.chart.append('path').attr('id', 'ma10-line');
      }
    },
    ma20Line: {
      append: function () {
        IndexChart.components.ma20Line = IndexChart.components.chart.append('path').attr('id', 'ma20-line');
      }
    },
    ma60Line: {
      append: function () {
        IndexChart.components.ma60Line = IndexChart.components.chart.append('path').attr('id', 'ma60-line');
      }
    },
    horizontalLine: {
      append: function () {
        IndexChart.components.horizontalLine = IndexChart.components.chart.append('line').attr('id', 'horizontal');
      }
    },
    horizontalBlock: {
      append: function () {
        IndexChart.components.horizontalBlock = IndexChart.components.chartLabel.append('rect').attr('id', 'horizontal-block');
      }
    },
    horizontalText: {
      append: function () {
        IndexChart.components.horizontalText = IndexChart.components.chartLabel.append('text').attr('class', 'horizontal-text');
      }
    },
    scrollBar: {
      append: function () {
        IndexChart.components.scrollBar = ChartView.appendScrollbar(IndexChart.components.chart, 
                                                                    IndexChart.properties.height);
      },
      update: function() {
        ChartView.updateScrollbar(IndexChart.components.scrollBar);
      }
    },  
    mouseOverlay: {
      append: function () {
        var props = IndexChart.properties;
        var mousedown = false;
        IndexChart.components.mouseOverlay = IndexChart.components.chart.append('rect')
                                             .attr('class', 'mouseover-overlay')
                                             .attr('fill-opacity', 0)
                                             .attr('x', 0)
                                             .attr('id', 'abc')
                                             .call(ChartView.zoomBehavior())
                                             .datum([])   //because d3 drag requires data/datum to be valid
                                             .call(ChartView.chartDragBehavior());
                                             // .on("touchstart.zoom", null)
                                             // .on("touchmove.zoom", null)
                                             // .on("touchend.zoom", null);
      },
      update: function () {
        var props = IndexChart.properties;
        IndexChart.components.mouseOverlay
          .attr('width', ChartView.getGraphWidth())
          .attr('y', ChartView.getTopMargin() + props.yOffset)
          .attr('height', props.height-4)
          .on('mouseover', function(e) { 
            ChartView.mouseOverMouseOverlay();
            return Tooltip.show(); })
          .on('mouseout', function() { 
            ChartView.mouseOutMouseOverlay();

            IndexChart.components.horizontalText.style('fill-opacity', 0);
            IndexChart.components.horizontalLine.style('stroke-opacity', 0);
            IndexChart.components.horizontalBlock.style('fill-opacity', 0);

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

              if(yPos > 230) yPos = 230;
              var j = ChartView.xInverse((IE8?xPos-55:xPos), IndexChart.data.x);
              var cursorPriceLevel = IndexChart.data.y2.invert((IE8?yPos-243:yPos));
              var d = ChartView.getVisibleStockLine()[j];

              IndexChart.helpers.updateMAValue('5', d.ma5);
              IndexChart.helpers.updateMAValue('10', d.ma10);
              IndexChart.helpers.updateMAValue('20', d.ma20);
              IndexChart.helpers.updateMAValue('60', d.ma60);

              var length = ChartView.getVisibleStockLine().length;
              d.closepx = d.closepx? d.closepx : d.preclosepx;
              d.moodindexchg = d.moodindexchg? d.moodindexchg : ChartView.getVisibleStockLine()[j].moodindex - ChartView.getVisibleStockLine()[j-1].moodindex;

              var model = {
                  top: mouseY + 10,
                  // 10 = horizontal distance from mouse cursor
                  left: ChartView.getChartWidth() - mouseX > 135 ? mouseX + 10 : mouseX - 180 - 10,
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
              IndexChart.components.horizontalText
              .attr('x', ChartView.getContainerWidth() - 37)
              .attr('y', yPos + 3)
              .attr('text-anchor', 'left')
              .text(cursorPriceLevel.toFixed(0))
              .style('fill-opacity', 100)
              .style('fill', 'white');

              IndexChart.components.horizontalLine
              .attr('x1', 0)
              .attr('x2', ChartView.getGraphWidth())
              .attr('y1', yPos) //make it line up with the label
              .attr('y2', yPos)
              .attr('stroke', '#f65c4e')
              .style('stroke-opacity', 100);

              IndexChart.components.horizontalBlock
              .attr('rx', 4)
              .attr('ry', 4)
              .attr('x', ChartView.getChartWidth()+ChartView.getLeftMargin()+1)
              .attr('y', yPos-10)
              .attr('height', 20)
              .attr('width',  ChartView.getRightMargin())
              .attr('fill', '#f65c4e')
              .style('fill-opacity', 100);

              return Tooltip.render.index(model);
          });
          this.isDrawing = false;
          }
        }
  },
  helpers: {
    updateMAValue: function (ma, data) {
      var toggled = $('#ma' + ma + '-checkbox').is(':checked');
      if(toggled)
        $('#ma' + ma + '-legend span').text('MA' + ma + ': ' + data);
    },
    getYLabelsData: function (data) {
      var self = IndexChart;
      var max = d3.max(data);
      var min = d3.min(data);
      var labels = [];
      var diff = (max - min)/6;
      min -= diff;
      for (var i = 0; i < 8; i++) {
        labels.push(min + (i*diff));
      }
      return labels;
    }
  }
};

