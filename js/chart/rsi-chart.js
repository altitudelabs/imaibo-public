var RsiChart = {
  properties: {},
  data: {},
  components: {},
  setProperties: function(options) {
    var properties = {
      height: 130,
      interval: 40,
    };
    properties.chartHeight = properties.height - ChartView.properties.margin.top - ChartView.properties.margin.bottom;
    properties.graphWidth = ChartView.properties.chartWidth * ChartView.properties.zoomFactor;
    if (options) {
      for (var key in options) {
        properties[key] = options[key];
      }
    }

    this.properties = $.extend(true, {}, properties);
  },
  init: function(){
    if(ChartView.data.indexError) return;
    this.setProperties();
    this.updateData();
    this.appendComponents();
    this.draw();
    this.initCloseAction();
  },
  update: function () {
    this.setProperties();
    this.updateData();
    this.appendComponents();
    this.draw();
  },
  updateData: function () {
    var self  = this;

    self.data.stockLine      = ChartView.data.visibleStockLine;
    self.data.xLabelData     = ChartView.getXLabels();

    var allDataArray = [];
    for (var i = 0; i < self.data.stockLine.length; i++) {
      allDataArray.push(parseInt(self.data.stockLine[i].rsi6));
      allDataArray.push(parseInt(self.data.stockLine[i].rsi12));
      allDataArray.push(parseInt(self.data.stockLine[i].rsi24));
    }
    var y2Range = self.helpers.getRangeWithBuffer(d3.min(allDataArray), d3.max(allDataArray));

    self.data.y2 = ChartView.buildY(y2Range[0], y2Range[1], self.properties.chartHeight);
    self.data.x  = ChartView.x('rdate');
    
  },
  initCloseAction: function() {
    $('#rsi > .wrapper > .buttons > .close').on('click', function() {
      $('#rsi').slideUp(500);
      $('#rsi-checkbox').attr('checked', false);
    });
  },
  appendComponents: function () {
    var self = this;
    $('#rsi-chart').empty();
    $('#rsi-chart-label').empty();
    self.componentsBuilder.chart.append();
    self.componentsBuilder.chartLabel.append();
    self.componentsBuilder.topBorder.append();
    self.componentsBuilder.rightBorder.append();
    self.componentsBuilder.bottomBorder.append();
    self.componentsBuilder.leftBorder.append();
    self.componentsBuilder.xLabels.append();
    self.componentsBuilder.y2Labels.append();
    self.componentsBuilder.guideLine30.append();
    self.componentsBuilder.guideLine70.append();
      // RSI lines
    this.components.chart.append('path').attr('class', 'rsi6');
    this.components.chart.append('path').attr('class', 'rsi12');
    this.components.chart.append('path').attr('class', 'rsi24');

  },
  draw: function() {
    var self = this;
    $('#rsi-chart-container').css('width', ChartView.properties.chartWidth);

    //DATA SECTION ======================================================
    for (var key in self.components) {
      if (self.componentsBuilder[key].linkData) {
        self.componentsBuilder[key].linkData();
      }
    }

    //ENTER LOOP ======================================================
    for (var key in self.components) {
      if (self.componentsBuilder[key].enter) {
        self.componentsBuilder[key].enter();
      }
    }
    
    //UPDATE LOOP ===============================================================
    for (var key in self.components) {
      if (self.componentsBuilder[key].update) {
        self.componentsBuilder[key].update();
      }
    }
    
    //EXIT LOOP ===============================================================
    for (var key in self.components) {
      if (self.componentsBuilder[key].enter) {
        self.components[key].exit().remove();
      }
    }
    
    // Draw RSI lines
    function plotRSI(rsi, color){
      var line = d3.svg.line()
        .x(function(d,i) { return self.data.x(i); })
        .y(function(d)   {
          if(rsi ===  6) return self.data.y2(d.rsi6);
          if(rsi === 12) return self.data.y2(d.rsi12);
          if(rsi === 24) return self.data.y2(d.rsi24);
        })
        .interpolate('linear');

      self.components.chart.select('path.rsi' + rsi)
        .datum(self.data.stockLine)
        .attr('d', line)
        .attr('stroke', color)
        .attr('fill', 'none');
    }

    plotRSI(6,'#fff');
    plotRSI(12,'#d8db74');
    plotRSI(24,'#784e7a');

  },
  drawContainer: function(){
    var self = this;

    self.componentsBuilder.chart.update();
    self.componentsBuilder.chartLabel.update();
    self.componentsBuilder.topBorder.update();
    self.componentsBuilder.rightBorder.update();
    self.componentsBuilder.bottomBorder.update();
    self.componentsBuilder.leftBorder.update();
  },
  componentsBuilder: {
    chart: {
      append: function () {
        RsiChart.components.chart = d3.select('#rsi-chart')
                                      .append('svg:svg')
                                      .attr('class', 'chart');
      },
      update: function () {
        RsiChart.components.chart
        .attr('height', RsiChart.properties.chartHeight)
        .attr('width', RsiChart.properties.graphWidth)
        .select('svg')
        .attr('width', RsiChart.properties.graphWidth);
      }
    },
    chartLabel: {
      append: function () {
        RsiChart.components.chartLabel = d3.select('#rsi-chart-label')
                                           .append('svg:svg')
                                           .attr('class', 'chart');
      },
      update: function () {
        RsiChart.components.chartLabel         
        .attr('width', ChartView.getContainerWidth())
        .attr('height', RsiChart.properties.chartHeight)
        .select('svg').attr('width', ChartView.getContainerWidth());
      }
    },
    topBorder: {
      append: function () {
        RsiChart.components.topBorder = RsiChart.components.chartLabel.append('svg:line')
                                                .attr('class', 'xborder-top-thick')
                                                .attr('stroke', 'rgb(77, 77, 77)')
                                                .attr('stroke-width', '2px');
      },
      update: function () {
        RsiChart.components.topBorder
        .attr('x1', ChartView.properties.margin.left)
        .attr('x2', ChartView.properties.chartWidth + ChartView.properties.margin.left)
        .attr('y1', ChartView.properties.margin.top)
        .attr('y2', ChartView.properties.margin.top);
      }
    },
    rightBorder: {
      append: function () {
        RsiChart.components.rightBorder = RsiChart.components.chartLabel.append('svg:line')
                                                  .attr('class', 'yborder-right')
                                                  .attr('stroke', 'rgb(77, 77, 77)')
                                                  .attr('stroke-width', '2px');
      },
      update: function () {
        RsiChart.components.rightBorder
        .attr('x1', ChartView.properties.chartWidth + ChartView.properties.margin.left)
        .attr('x2', ChartView.properties.chartWidth + ChartView.properties.margin.left)
        .attr('y1', RsiChart.properties.chartHeight - ChartView.properties.margin.bottom)
        .attr('y2', ChartView.properties.margin.top);
      }
    },
    bottomBorder: {
      append: function () {
        RsiChart.components.bottomBorder = RsiChart.components.chartLabel.append('svg:line')
                                                   .attr('class', 'xaxis')
                                                   .attr('stroke', 'rgb(77, 77, 77)')
                                                   .attr('stroke-width', '2px');
      },
      update: function () {
        RsiChart.components.bottomBorder
        .attr('x1', ChartView.properties.margin.left)
        .attr('x2', ChartView.properties.chartWidth + ChartView.properties.margin.left)
        .attr('y1', RsiChart.properties.chartHeight - ChartView.properties.margin.bottom)
        .attr('y2', RsiChart.properties.chartHeight - ChartView.properties.margin.bottom);
      }
    },
    leftBorder: {
      append: function () {
        RsiChart.components.leftBorder = RsiChart.components.chartLabel.append('svg:line')
                                                 .attr('class', 'yborder-left')
                                                 .attr('stroke', 'rgb(77, 77, 77)')
                                                 .attr('stroke-width', '2px');
      },
      update: function () {
        RsiChart.components.leftBorder
        .attr('x1', ChartView.properties.margin.left)
        .attr('x2', ChartView.properties.margin.left)
        .attr('y1', RsiChart.properties.chartHeight - ChartView.properties.margin.bottom)
        .attr('y2', ChartView.properties.margin.top);
      }
    },
    guideLine30: {
      append: function () {
        RsiChart.components.guideLine30 = RsiChart.components.chartLabel.append('svg:line')
                                                  .attr('class', 'guideline-30')
                                                  .attr('stroke', 'rgb(50, 50, 50)')
                                                  .attr('stroke-width', '1px')
                                                  .attr('shape-rendering', 'crispEdges');
      },
      update: function () {
        RsiChart.components.guideLine30
        .attr('x1', ChartView.properties.margin.left)
        .attr('x2', ChartView.properties.chartWidth + ChartView.properties.margin.left)
        .attr('y1', RsiChart.data.y2(30))
        .attr('y2', RsiChart.data.y2(30));
      }
    },
    guideLine70: {
      append: function () {
        RsiChart.components.guideLine70 = RsiChart.components.chartLabel.append('svg:line')
                                                  .attr('class', 'guideline-70')
                                                  .attr('stroke', 'rgb(50, 50, 50)')
                                                  .attr('stroke-width', '1px')
                                                  .attr('shape-rendering', 'crispEdges');
      },
      update: function () {
        RsiChart.components.guideLine70
        .attr('x1', ChartView.properties.margin.left)
        .attr('x2', ChartView.properties.chartWidth + ChartView.properties.margin.left)
        .attr('y1', RsiChart.data.y2(70))
        .attr('y2', RsiChart.data.y2(70));
      }
    },
    y2Labels: {
      append: function () {
        RsiChart.components.y2Labels = RsiChart.components.chartLabel.append('g')
                                               .attr('class','y2labels')
                                               .selectAll('text.yrule');
      },
      linkData: function () {
        RsiChart.components.y2Labels = RsiChart.components.y2Labels.data(RsiChart.data.y2.ticks(3));
      },
      enter: function () {
        RsiChart.components.y2Labels.enter().append('text').attr('class', 'yrule');
      },
      update: function () {
        RsiChart.components.y2Labels
        .attr('x', ChartView.properties.width - ChartView.properties.margin.right + 15)
        .attr('y', RsiChart.data.y2)
        .attr('text-anchor', 'middle')
        .text(String);
      }
    },
    xLabels: {
      append: function () {
        RsiChart.components.xLabels = RsiChart.components.chart.append('g')
                                              .attr('class','xlabels')
                                              .selectAll('text.xrule');
      },
      linkData: function () {
        RsiChart.components.xLabels = RsiChart.components.xLabels.data(ChartView.getXLabels());
      },
      enter: function () {
        RsiChart.components.xLabels.enter().append('svg:text').attr('class', 'xrule');
      },
      update: function () {
        RsiChart.components.xLabels
        .attr('x', function(d,i){ return RsiChart.data.x(d.rdate); })
        .attr('y', RsiChart.properties.chartHeight-ChartView.properties.margin.bottom+15)
        .attr('text-anchor', 'middle')
        .text(function(d,i) {
          var today = new Date();
          if(i === 0 || today.getDate() < 10 && i === RsiChart.data.xLabelData.length-1)
            return '';
          else
            return Helper.toDate(d.rdate, 'yyyy/mm');
        });
      }
    },
    mouseOverlay: {
      append: function () {
      // Tooltip
        RsiChart.components.mouseOverlay = RsiChart.components.chart.append('rect')
        .attr('class','mouseover-overlay')
        .attr('fill', 'transparent')
        .attr('fill-opacity', 0);
      },
      update: function () {
        RsiChart.components.mouseOverlay
        .attr('x', 0)
        .attr('y', Chartview.properties.margin.top)
        .attr('width', RsiChart.properties.graphWidth)
        .attr('height', RsiChart.properties.height-Chartview.properties.margin.top-Chartview.properties.margin.bottom - 25)
        .on('mouseover', function(e){
          $('html').css('overflow', 'hidden');
          return Tooltip.show(); })
        .on('mouseout', function(){
          $('html').css('overflow', 'visible');
          return Tooltip.hide(); })
        .on('mousemove', function(){
          var xPos, mouseX, mouseY;

          if(IE8) {
            /* TO BE FIXED:
            xPos = eventX;
            leftOffset = eventX - 60;
            top = event.offsetY + 300;
            */
          }
          else {
            xPos = d3.mouse(this)[0];
            mouseX = d3.event.pageX;
            mouseY = d3.event.pageY;
          }

          var j = ChartView.xInverse((IE8?xPos-55:xPos), RsiChart.data.x);
          var d = RsiChart.data.stockLine[j];

          var model = {
            top: mouseY + 10,
            // 10 = horizontal distance from mouse cursor
            left: ChartView.properties.chartWidth - mouseX > 135 ? mouseX + 10 : mouseX - 180 - 10,
            // if the right edge touches the right y axis
            // 180 = width of tooltip, 10 = vertical distance from cursor
            date: Helper.toDate(d.rdate),
            rsi6: d.rsi6,
            rsi12: d.rsi12,
            rsi24: d.rsi24,
          };
          return Tooltip.render.rsi(model);
        });
      }
    }
  },
  helpers: {
    getRangeWithBuffer: function (min, max) {
      return [min - ((max - min)*0.5), max + ((max - min)*0.5)];
    }
  }
};


