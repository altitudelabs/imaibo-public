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
  initStockpickerSettingsPanel: function(){
    // Dummy data
    var s1 = { name: '最多持仓', stock: [{stockId: 1}, {stockId: 2}, {stockId: 3}, {stockId: 4}] };
    var s2 = { name: '最多买入', stock: [{stockId: 1}, {stockId: 2}, {stockId: 3}, {stockId: 4}] };
    var s3 = { name: '最多卖出', stock: [{stockId: 1}, {stockId: 2}, {stockId: 3}, {stockId: 4}] };
    var s4 = { name: '重仓股', stock: [{stockId: 1}, {stockId: 2}, {stockId: 3}, {stockId: 4}] };

    var model = {
      category: [
        { name: '上证', subcategory: [s1, s2, s3, s4] },
        { name: '草根股神', subcategory: [s1, s2, s3, s4] },
        { name: '热门股', subcategory: [s1, s2, s3, s4] },
        { name: '行情股', subcategory: [s1, s2, s3, s4] }
      ]
    };

    Helper.populateView('#stock-add-panel', '#stock-add-panel-template', model);

    $('.add-security-row').click(function(e) {
      if (_MID_ == 0 || _MID_ == '') {
        login_show();
      } else {
        var cb = $(this).find(':checkbox')[0];

        if(!cb.checked){
          var stockId = $(cb).data('id')
          RightPanelModel.addStock(stockId, function(){
            cb.checked = true;
          });
        } else {
          var stockId = $(cb).data('id')
          RightPanelModel.deleteStock(stockId, function(){
            cb.checked = false;
          });
        }
      }
    });
  },
  initStockpickerSearchAutocomplete: function() {
    $('#stock-search').on('input propertychange paste', function() {
        console.log($('#stock-search').val());
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
            if (_MID_ == 0 || _MID_ == '') {
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

      // Refresh sticky columns
      StickyColumns.start();
    };

    var errorHandler = function(model) {
      $('#stock-table').append('<tr>暂时无法下载数据，请稍后再试</tr>');
    };

    RightPanelModel.getStockData(successHandler, errorHandler);
  },
  hideStockpickerLoginPanel: function() {
    $('#stock-login').remove();
    $('#suggestion').remove();
    $('#stockpicker-view > .wrapper:first-child').css('height', '0');
  },
  showStockpickerView: function() {
    $('#stockpicker-view').css('opacity', '1');
    $('.panel-loader').remove();
  },
  updateStockpickerView: function(model) {
    var template = '<td><div class="indicator"></div></td> \
                    <td class="zxg-ticker white"><a href="{{stockUrl}}">{{stockName}}</a></td> \
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
      return '<a href="' + d.stockUrl + '">' + d.stockName + '</a>';
    });

    table.select('.zxg-price').html(function(d){ return d.lastpx; });
    table.select('.zxg-price-change-abs').html(function(d){ return d.pxchg; });
    table.select('.zxg-price-change-rel').html(function(d){ return d.pxchgratio; });

    StickyColumns.start();
  },
  refreshStockpickerView: function() {
    var self = this;
    var refreshRate = 5000;
    setInterval(function(){
      self.renderStockpickerView(false);
    },refreshRate);
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

        // Refresh sticky columns
        StickyColumns.start();

        // Init experts modal
        $('.experts-header').leanModal({ closeButton: '.modal-close', modalId: '#experts-modal' });

        // Init like comments action
        $('.experts-like-action').click(function(e) {
          e.preventDefault();
          var weiboId = $(e.target).attr('name');

          // If user not logged in, show login panel
          if (_MID_ == 0 || _MID_ == '') {
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
      var htmlCode = '<a href="'+ d.url + '" target="_blank">' + d.title + '</a>'
      return htmlCode;
    });
    newsBlocks.select('.time').html(function(d){ return d.clock.substr(0, 5); });
    newsBlocks.select('.percentage').html(function(d){ return d.newsMood + '%'; });
    newsBlocks.select('.source').html(function(d){ return '来自' + d.source; });

    StickyColumns.recalc();
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
    StickyColumns.recalc();
  },
  setTimebarListener: function() {
    var self = this;
    $('#press-by-time .calendar-and-date').click(function() { 
      $(this).siblings().stop().slideToggle('slow');
    });
  },
  initNewsModule: function() {
    var self = this;

    $.when(RightPanelModel.getAllPressAsync(), RightPanelModel.getPressByTimeAsync())
     .done(function(allPress, pressByTime) {
      var error = RightPanelModel.model.getAllPressError || RightPanelModel.model.getPressByTimeError;

      if(!error) {
        self.updateAllPress(RightPanelModel.model);
        self.updatePressByTime(RightPanelModel.model);
      } 
      else {
        $('#all-press').append('<div class="empty-data-right-panel" id="right-panel-data">暂时无法下载数据，请稍后再试</div>');
      }
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
 
    $('ul#news-tabs li')
    .click(function() {
        var $this = $(this), clickTab = $this.find('a').attr('href');

        $this.addClass('active');
        $this.siblings('.active').removeClass('active');

        $(clickTab).show();
        $(clickTab).siblings().hide();
 
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
