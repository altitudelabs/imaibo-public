var RightPanel = {
  data: {},
  el: $('#right-panel'),
  collapsed: {
    el: $('#right-panel-collapsed'),
    link: $('.link-right-panel-collapsed'),
    icon: $('.vertical-collapse'),
  },
  uncollapsed: {
    icon: $('.vertical-uncollapse'),
  },
  contentView: '',
  states: {
    chooseStockView: {
      el: $('#stockpicker-view'),
      link: $('.link-stockpicker-view'),
      template: $('#stockpicker-template'),
      table: $('#stockpicker-table-body'),
      loginWrapper: $('#stock-login'),
      loginTemplate: $('#stock-login-template')
    },
    expertsView: {
      el: $('#experts-view'),
      link: $('.link-experts-view'),
      template: $('#experts-template'),
      modalEl: $('#experts-modal'),
      modalTemplate: $('#experts-modal-template')
    },
    newsView: {
      el: $('#news-view'),
      link: $('.link-news-view')
    }
  },
  noStocks: false,
  collapseView: function(){
    // Remove sticky columns
    StickyColumns.stop();

    // Collapse right panel
    this.el.addClass('collapsed');
    this.collapsed.el.removeClass('collapsed');
    $('#content').css('width', 'calc(100% - 55px)');

    // Rebuild chart after animation
    setTimeout(function(){
      ChartView.rebuild();
    }, 400);
  },

  /*
   * Populate HandlebarJS template.
   * ==============================
   * arguments:
   *  - targetSelector: DOM object of your target div. i.e. $('#expertsView')
   *  - templateSelector: DOM object of your template. i.e. $('#experts-template')
   *  - resource: the data you are passing in. e.g. {name: 'Ray'}
   *  - returnHtml: return HTML instead of replacing HTML in target selector
   */
  populateView: function (targetSelector, templateSelector, resource, returnHtml){
    var template = Handlebars.compile(templateSelector.html());
    if (returnHtml) {
      return template(resource);
    } else {
      targetSelector.html(template(resource));
    }
  },
  expandView: function(){
    var self = this;
    $('#content').css('width', 'calc(100% - 325px)');

    setTimeout(function(){
      self.collapsed.el.removeClass('uncollapsed');
      self.el.removeClass('collapsed');
      self.collapsed.el.addClass('collapsed');

      // Rebuild chart
      ChartView.rebuild();

      // Start sticky columns
      StickyColumns.start();
    }, 500);
  },
  init: function(){
    this.initLinks();
    this.render();
    this.initStockpickerModule();
    this.initExpertsModule();
    this.initNewsModule();
  },
  /* Stockpicker module */
  initStockpickerModule: function(){
    if (!HIDE) {
      this.renderStockpickerView(true);
    }
  },
  canFindStockFromList: function(stockId) {
    var lengthOfStocks = RightPanelModel.model.stock.list.length;

    // faster algorithm to be impletmented later
    for (var i = 0; i < lengthOfStocks; i++) {
      if (RightPanelModel.model.stock.list[i].stockId == stockId)
        return true;
    }

    return false;
  },
  updateStockpickerSettingsPanel: function(model) {
    var self = this;
    var numberOfTable = model.length;

    for (var i = 0; i < numberOfTable; i++) {
      var template;
      if (i == 0)
        template = '<td class="add-stock-name white"></td><td class="add-stock-price"></td><td class="add-stock-change"></td><td class="add-stock-change-ratio"></td>';
      else
        template = '<td class="add-stock-name"></td><td class="add-stock-price"></td><td class="add-stock-change"></td><td class="add-stock-change-ratio"></td><td class="add-stock-button"><span class="not-selected"></span></td>';

      var selectorName = '#stocktable' + (i + 1) + ' tbody';
      var stockTable = d3.select(selectorName)
                         .selectAll('tr')
                         .data(model[i]);

      // Enter loop
      stockTable.enter().append('tr')
                        .attr("class", function(d) {
                          if (d.pxchg == 0)
                            return "add-security-row neutral";
                          if (d.sign === '+')
                            return "add-security-row rise";
                          else
                            return "add-security-row fall";
                        })
                        .html(template);

      // Exit loop
      stockTable.exit().remove();

      // Update loop
      if (i == 0)
        stockTable.select('.add-stock-name').html(function(d) { return d.stockName; });
      else
        stockTable.select('.add-stock-name').html(function(d) { 
          var htmlCode = '<a href="'+ d.url + '" target="_blank" class="white">' + d.stockName + '</a>'
          return htmlCode;
        });
      stockTable.select('.add-stock-price').html(function(d) { return d.lastpx; });
      stockTable.select('.add-stock-change').html(function(d) { return d.pxchg; });
      stockTable.select('.add-stock-change-ratio').html(function(d) { return d.pxchgratio; });
      if (typeof _MID_ !== 'undefined' && _MID_ !== 0 && _MID_ !== '') { // if logged in
        stockTable.select('.add-stock-button span').attr('class', function(d) {
          if (self.canFindStockFromList(d.stockId))
            return 'selected ' + 'Id' + d.stockId;
          else
            return 'not-selected ' + 'Id' + d.stockId;
        });
      }
      stockTable.select('.add-stock-button span').on('click', function(d) { 
        if (typeof _MID_ === 'undefined' || _MID_ === 0 || _MID_ === '') {
          login_show();
        }
        else {
          var selectorName = '.add-stock-button span.Id' + d.stockId; 
          var spanObjects = d3.selectAll(selectorName); // select all elements with that stockId so as to change all their buttons
          var thisSpanObject = d3.select(this);

          var errorHandler = function(errorObject) {
            $('#alert-box').html(errorObject.msg)
                           .fadeIn("slow")
                           .fadeOut(3000);
          };

          var AddSuccessHandler = function() {
            spanObjects.classed("not-selected", false);
            spanObjects.classed("selected", true);

            self.renderStockpickerView(false);
          };

          var DeleteSuccessHandler = function() {
            spanObjects.classed("not-selected", true);
            spanObjects.classed("selected", false);

            self.renderStockpickerView(false);
          };

          if (thisSpanObject.classed("selected"))
            RightPanelModel.deleteStock(d.stockId, DeleteSuccessHandler, errorHandler);
          if (thisSpanObject.classed("not-selected"))
            RightPanelModel.addStock(d.stockId, AddSuccessHandler, errorHandler);
        }
      });
    }
  },
  initStockpickerSettingsPanel: function() {
    var self = this;

    $.when(
      RightPanelModel.getIndexStocksAsync(),
      RightPanelModel.getCggsStocksAsync(),
      RightPanelModel.getHotStocksAsync(),
      RightPanelModel.getMarketStocksAsync())
     .done(function(indexStocks, cggsStocks, hotStocks, marketStocks) {
      var error = RightPanelModel.model.getAddPanelStocksError;

      if(!error) {
        self.updateStockpickerSettingsPanel(RightPanelModel.model.addPanelStocks);
      } 
    });
  },
  updateSearchResult: function(key) {
    var self = this;

    var successHandler = function(searchResult) {
      $( ".search-empty" ).remove();
      var template = '<span class="stock-name"></span><span class="ticker"></span><span class="not-selected search-add-stock-button"></span>';

      var searchBlocks = d3.select('#search-result')
                           .selectAll('div')
                           .data(searchResult); // model.stock = data

      // Enter loop
      searchBlocks.enter().append('div')
                          .attr("class", "search-block")
                          .html(template);

      // Exit loop
      searchBlocks.exit().remove();

      // Update loop
      searchBlocks.select('.stock-name').html(function(d){ 
        return '<a href="' + d.url + '" target="_blank">' + d.stockName + '</a>'; 
      });
      searchBlocks.select('.ticker').html(function(d){ return '(SZ' + d.stockCode + ")"; });
      if (typeof _MID_ !== 'undefined' && _MID_ !== 0 && _MID_ !== '') { // if logged in
        searchBlocks.select('.search-add-stock-button').attr('class', function(d) {
          if (self.canFindStockFromList(d.stockId))
            return 'selected search-add-stock-button';
          else
            return 'not-selected search-add-stock-button';
        });
      }
      searchBlocks.select('.search-add-stock-button').on('click', function(d) { 
        if (typeof _MID_ === 'undefined' || _MID_ === 0 || _MID_ === '') {
          login_show();
        }
        else {
          var selectorName = '.add-stock-button span.Id' + d.stockId; 
          var AddPanelSpanObjects = d3.selectAll(selectorName); // select all elements with that stockId so as to change all their buttons
          var thisSpanObject = d3.select(this);

          var errorHandler = function(errorObject) {
            $('#alert-box').html(errorObject.msg)
                           .fadeIn("slow")
                           .fadeOut(3000);
          };

          var AddSuccessHandler = function() {
            AddPanelSpanObjects.classed("not-selected", false);
            AddPanelSpanObjects.classed("selected", true);

            thisSpanObject.classed("not-selected", false);
            thisSpanObject.classed("selected", true);

            self.renderStockpickerView(false);
          };

          var DeleteSuccessHandler = function() {
            AddPanelSpanObjects.classed("not-selected", true);
            AddPanelSpanObjects.classed("selected", false);

            thisSpanObject.classed("selected", false);
            thisSpanObject.classed("not-selected", true);

            self.renderStockpickerView(false);
          };

          if (thisSpanObject.classed("selected"))
            RightPanelModel.deleteStock(d.stockId, DeleteSuccessHandler, errorHandler);
          if (thisSpanObject.classed("not-selected"))
            RightPanelModel.addStock(d.stockId, AddSuccessHandler, errorHandler);
        }
      });
    };

    var failHandler = function(code) {
      if (code == 0) // 0 = not found, 1 = no keywords, others = other errors
        $('#search-result').html('<div class="search-empty">没有结果</div>');
      else if (code == 1)
        $('#search-result').html('<div class="search-empty">请输入关键词</div>');
      else
        $('#search-result').html('<div class="search-empty">暂时无法下载数据，请稍后再试</div>');
    };

    RightPanelModel.getSearchResult(key, successHandler, failHandler);

    $('#search-result').css('display', 'block');
  },
  initStockpickerSearchAutocomplete: function() {
    var self =  this;

    $('#stock-search').on('input propertychange paste focus', function() {
      var key = $('#stock-search').val();

      if (key)
        self.updateSearchResult(key);
      else
        $('#search-result').css('display', 'none');
    });

    $('#search-button').on('click', function() {
        self.updateSearchResult($('#stock-search').val());
    });

    $(document).mouseup(function(e) {
      var $searchWrapper = $('#search-wrapper');

      // if the target of the click isn't the container nor a descendant of the container
      if (!$searchWrapper.is(e.target) && $searchWrapper.has(e.target).length === 0)
        $('#search-result').css('display', 'none');
    });
  },
  renderStockpickerView: function(initial) {
    var self = this;
    var stock = self.states.chooseStockView;

    var successHandler = function(model) {
      if (initial) {
        self.updateStockpickerView(model);

        if (model.stock.isLogin) {
          self.hideStockpickerLoginPanel();
        } 
        else {
          $('#login').click(function() {
            if (typeof _MID_ === 'undefined' || _MID_ === 0 || _MID_ === '') {
              login_show();
            }
          });
        }

        self.showStockpickerView();
        // When view is rendered, also render settings panel and autocomplete
        self.initStockpickerSettingsPanel();
        self.initStockpickerSearchAutocomplete();
        // Makes stockpicker view refresh every x seconds
        self.refreshStockpickerView();
      } 
      else {
        self.updateStockpickerView(model);
      }

      // Refresh sticky columns after height change
      StickyColumns.start();
    };

    var errorHandler = function(model) {
      $('#stock-table').append('<tr>暂时无法下载数据，请稍后再试</tr>');

      // Refresh sticky columns after height change
      StickyColumns.start();
    };

    RightPanelModel.getStockData(successHandler, errorHandler);
  },
  hideStockpickerLoginPanel: function() {
    $('#stock-login').remove();
    $('#suggestion').remove();
  },
  showStockpickerView: function() {
    $('#stockpicker-view').css('opacity', '1');
    $('.panel-loader').remove();
  },
  updateStockpickerView: function(model) {
    var self = this;

    if (model.stock.list.length == 0) {
      $('#stockpicker-table-body').html('<tr><td colspan="5" style="text-align:center;">暂无自选股</td></tr>');
      self.noStocks = true;
      return;
    }
    else if (self.noStocks == true) {
      $('#stockpicker-table-body').empty();
      self.noStocks = false;
    }

    var template = '<td><div class="indicator"></div></td> \
                    <td class="zxg-ticker"><a href="{{stockUrl}}">{{stockName}}</a></td> \
                    <td class="zxg-price">{{lastpx}}</td> \
                    <td class="zxg-price-change-abs">{{pxchg}}</td> \
                    <td class="zxg-price-change-rel">{{pxchgratio}}</td>';

    var table = d3.select('#stockpicker-table-body')
                  .selectAll('tr')
                  .data(model.stock.list); // model.stock = data

    // Enter loop
    table.enter().append('tr')
                 .html(template);

    // Exit loop
    table.exit().remove();

    // Update loop
    table.attr('class', function(d) {
      if (d.sign === '+'){
        return 'rise';
      } 
      else if (d.sign === '-') {
        return 'fall';
      } 
      else {
        return 'neutral';
      }
    });

    table.select('.zxg-ticker').html(function(d) {
      return '<a href="' + d.stockUrl + '" target="_blank" class="white">' + d.stockName + '</a>';
    });
    table.select('.zxg-price').html(function(d){ return d.lastpx; });
    table.select('.zxg-price-change-abs').html(function(d){ return d.pxchg; });
    table.select('.zxg-price-change-rel').html(function(d){ return d.pxchgratio; });
  },
  updateStockDataOnly: function() {
    var self = this;

    var successHandler = function(model) {
      if (model.stock.list.length == 0) {
        $('#stockpicker-table-body').html('<tr><td colspan="5" style="text-align:center;">暂无自选股</td></tr>');
        self.noStocks = true;
        return;
      }
      else if (self.noStocks == true) {
        $('#stockpicker-table-body').empty();
        self.noStocks == false;
      }

      var template = '<td><div class="indicator"></div></td> \
                    <td class="zxg-ticker"><a href="{{stockUrl}}">{{stockName}}</a></td> \
                    <td class="zxg-price">{{lastpx}}</td> \
                    <td class="zxg-price-change-abs">{{pxchg}}</td> \
                    <td class="zxg-price-change-rel">{{pxchgratio}}</td>';

      var table = d3.select('#stockpicker-table-body')
                    .selectAll('tr')
                    .data(model.stock.list); // model.stock = data

      // Enter loop
      table.enter().append('tr')
                   .html(template);

      // Exit loop
      table.exit().remove();

      // Update loop
      table.attr('class', function(d) {
        if (d.sign === '+') {
          return 'rise';
        } 
        else if (d.sign === '-') {
          return 'fall';
        } 
        else {
          return 'neutral';
        }
      });

      table.select('.zxg-ticker').html(function(d) {
        return '<a href="' + d.stockUrl + '" target="_blank" class="white">' + d.stockName + '</a>';
      });
      table.select('.zxg-price').html(function(d){ return d.lastpx; });
      table.select('.zxg-price-change-abs').html(function(d){ return d.pxchg; });
      table.select('.zxg-price-change-rel').html(function(d){ return d.pxchgratio; });

      // Refresh sticky columns after height change
      StickyColumns.start();
    }

    var errorHandler = function(model) {
      $('#stock-table').append('<tr>暂时无法下载数据，请稍后再试</tr>');

      // Refresh sticky columns after height change
      StickyColumns.start();
    };

    RightPanelModel.getStockData(successHandler, errorHandler);
  },
  refreshStockpickerView: function() {
    // renderStockpickerView cannot be used as the function to refresh
    // if renderStockpickerView is used, 
    // when refreshStockpickerView is called during refresh and the user tried to add stock,
    // refreshStockpickerView is called twice which may cause some problems
    var self = this;
    var refreshRate = 5000;

    setInterval(function(){ self.updateStockDataOnly(); }, refreshRate);
  },
  /* Experts module */
  initExpertsModule: function() {
    var self = this;

    $.when(RightPanelModel.getExpertHeadlineAsync(), RightPanelModel.getExpertDataAsync())
     .done(function(headlineModel, model) {
      var experts = self.states.expertsView;
      var error = RightPanelModel.model.expertError || RightPanelModel.model.expertHeadlineError;

      if(!error) {
        // Populate views
        Helper.populateView(experts.el, experts.template, RightPanelModel.model.experts);
        Helper.populateView(experts.modalEl, experts.modalTemplate, RightPanelModel.model.experts);

        // Init experts modal
        $('.experts-header').leanModal({ closeButton: '.modal-close', modalId: '#experts-modal' });

        // Init like comments action
        $('.experts-like-action').click(function(e) {
          e.preventDefault();
          var weiboId = $(e.target).attr('name');

          // If user not logged in, show login panel
          if (typeof _MID_ === 'undefined' || _MID_ === 0 || _MID_ === '') {
            login_show();
          } 
          else {
            // Otherwise, like comment
            RightPanelModel.likeCommentAsync(weiboId)
            .then(function(res) {
              var content = $(e.target).html();
              var likes = parseInt(content.match(/[^()]+(?=\))/g));
              likes++;
              $(e.target).html('赞(' + likes + ')');
            }, function(res) {
              // handle error
            });
          }

        });
      } 
      else {
        $('#experts-view').append('<div class="empty-data-right-panel" id="right-panel-data">暂时无法下载数据，请稍后再试</div>');
      }

      // Remove loader
      $('#experts-view').css('visibility', 'visible');
      $('.panel-loader').remove();

      // Refresh sticky columns after height change
      StickyColumns.start();
    });
  },
  /* News module */
  updateAllPress: function(model) {
    // SET DATE
    $('#news-view .date').html(model.allPress[0].rdate);

    // CREATE NEWS BLOCKS
    var template = '<div class="content">{{title}}</div><div class="sentiment-news"><span class="label">心情分数</span><span class="arrow"></span><span class="percentage">{{newsMood}}%</span></div><div class="time-and-source"><div class="time">{{time}}</div><div class="source">来自{{source}}</div></div>';

    var newsBlocks = d3.select('#news-blocks')
                       .selectAll('div')
                       .data(model.allPress);

    // Enter loop
    newsBlocks.enter().append('div')
                      .attr("class", function(d) {
                        if(d.sent === '+')
                          return "news-block rise";
                        else 
                          return "news-block fall";
                      })
                      .html(template);

    // Exit loop
    newsBlocks.exit().remove();

    // Update loop
    newsBlocks.select('.content').html(function(d) {
      var htmlCode = '<a href="'+ d.url + '" target="_blank">' + d.title + '</a>';
      return htmlCode;
    });
    newsBlocks.select('.time').html(function(d){ return d.clock.substr(0, 5); });
    newsBlocks.select('.percentage').html(function(d){ return d.newsMood + '%'; });
    newsBlocks.select('.source').html(function(d){ return '来自' + d.source; });
  },
  updatePressByTime: function(model) {
    var newsBlockTemplate = '<div class="content">{{title}}</div><div class="sentiment-news"><span class="label">心情分数</span><span class="arrow"></span><span class="percentage">{{newsMood}}%</span></div><div class="time-and-source"><div class="time">{{time}}</div><div class="source">来自{{source}}</div></div>';
    var timeBlockTemplate = '<div class="calendar-and-date"><span class="calendar"></span><span class="date">{{date}}</span><span class="arrow-sign"></span><span class="number-of-msg">共{{length}}条新闻</span></div><div class="news-blocks"></div>';

    // CREATE TIME BLOCKS
    var timeBlock = d3.select('#press-by-time')
                      .selectAll('div')
                      .data(d3.keys(model.pressByTime));

    timeBlock.enter().append('div')
                     .attr("id", function(d) { return "time" + d.replace(/(-|:|\s)+/g, ''); })
                     .attr("class", "time-block")
                     .html(timeBlockTemplate);

    timeBlock.exit().remove();

    timeBlock.select('.date').html(function(d) { return d});

    // SET TIME BLOCKS
    _.each(model.pressByTime, function(object, name) {
      var timeBlockString = '#time' + name.replace(/(-|:|\s)+/g, '');
      var newsBlocksString = timeBlockString + ' .news-blocks';
      var numberOfMsgString = timeBlockString + ' .number-of-msg';

      // SET NUMBER OF MSG IN EACH TIME BLOCK
      $(numberOfMsgString).html("共" + object.length + "条新闻");

      // CREATE NEWS BLOCKS INSIDER EACH TIME BLOCK
      var newsBlocks = d3.select(newsBlocksString)
                         .selectAll('div')
                         .data(object);

      newsBlocks.enter().append('div')
                        .attr("class", function(d) {
                          if(d.sent === '+')
                            return "news-block rise";
                          else 
                            return "news-block fall";
                        })
                        .html(newsBlockTemplate);

      newsBlocks.exit().remove();

      newsBlocks.select('.content').html(function(d) {
        var htmlCode = '<a href="'+ d.url + '" target="_blank">' + d.title + '</a>'
        return htmlCode;
      });
      newsBlocks.select('.time').html(function(d){ return d.clock.substr(0, 5); });
      newsBlocks.select('.percentage').html(function(d){ return d.newsMood + '%'; });
      newsBlocks.select('.source').html(function(d){ return "来自" + d.source; });
    });
    
    this.setTimebarListener();
  },
  setTimebarListener: function() {
    var self = this;

    $('#press-by-time .calendar-and-date').click(function() { 
      $(this).siblings().stop().slideToggle('slow');

      // Refresh sticky columns after height change
      StickyColumns.start();
    });
  },
  initNewsModule: function() {
    var self = this;

    $.when(RightPanelModel.getAllPressAsync(), RightPanelModel.getPressByTimeAsync())
     .done(function(allPress, pressByTime) {
      if(!RightPanelModel.model.getAllPressError)
        self.updateAllPress(RightPanelModel.model);
      else {
        $('#all-press .calendar-and-date').remove();
        $('#all-press').append('<div class="empty-data-right-panel" id="right-panel-data">暂时无法下载数据，请稍后再试</div>');
      }

      if(!RightPanelModel.model.getPressByTimeError)
        self.updatePressByTime(RightPanelModel.model);
      else
        $('#press-by-time').append('<div class="empty-data-right-panel" id="right-panel-data">暂时无法下载数据，请稍后再试</div>');

      // Refresh sticky columns after height change
      StickyColumns.start();
    });
  },
  render: function(){
    if(HIDE) { //app.js
      this.goTo('expertsView');
    }
    else {
      this.goTo('chooseStockView');
    }
  },
  initNewsTabs: function() {
    var showTab = 1; // show the first tab by default
    var $defaultLi = $('ul#news-tabs li').eq(showTab).addClass('active');
    $($defaultLi.find('a').attr('href')).siblings().hide();
 
    $('ul#news-tabs li').click(function() {
      var $this = $(this), clickTab = $this.find('a').attr('href');

      $this.addClass('active');
      $this.siblings('.active').removeClass('active');

      $(clickTab).show();
      $(clickTab).siblings().hide();

      // Refresh sticky columns after height change
      StickyColumns.start();
 
      return false;
    });
  },
  initLinks: function(){
    var self = this;

    _.each(this.states, function(state, name){
      state.link.on('click', function(){
        self.expandView();
        $('.vertical-uncollapse').css('display', 'none');
        self.goTo(name);
      });
    });

    this.collapsed.link.on('click', function(){
      self.collapseView();
      $('.vertical-uncollapse').css('display', 'inline-flex');
    });

    this.collapsed.icon.on('click', function(){
      self.collapseView();
      $('.vertical-uncollapse').css('display', 'inline-flex');
    });

    this.uncollapsed.icon.on('click', function(){
      self.expandView();
      $('.vertical-uncollapse').css('display', 'none');
    });

    $('#right-panel-option-container').hover(function() {
      $('#stock-add-panel').css('display', 'inline');
    }, function() {
      $('#stock-add-panel').css('display', 'none');
    });

    self.initNewsTabs();

  },
  goTo: function(toState){
    var self = this;
    _.each(this.states, function(state, stateName){
      if(stateName === toState) {
        state.link.addClass('active');
        state.el.show();
      } else {
        state.link.removeClass('active');
        state.el.hide();
      }
    });
  },
  disableBodyScroll: function () {
    $('#stockpicker-table-body').on('mouseenter', function (event){
      $('html').addClass('noscroll');
    });
    $('#stockpicker-table-body').on('mouseleave', function (event){
      $('html').removeClass('noscroll');
    });
  }
}
