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
  },
  /* Stockpicker module */
  initStockpickerModule: function(){
    if (!HIDE) {
      this.renderStockpickerView(true);
    }
  },
  renderStockpickerView: function(initial){
    var self = this;
    var stock = self.states.chooseStockView;

    var successHandler = function(model){
      if (initial){
        self.updateStockpickerView(model);
        if(model.stock.isLogin) self.hideStockpickerLoginPanel();
        self.showStockpickerView();
        self.refreshStockpickerView();
      } else {
        self.updateStockpickerView(model);
      }
    };

    var errorHandler = function(model){
      $('#stock-table').append('<tr>暂时无法下载数据，请稍后再试</tr>');
    };

    RightPanelModel.getStockData(successHandler, errorHandler);
  },
  hideStockpickerLoginPanel: function(){
    $('#stock-login').remove();
    $('#suggestion').remove();
    $('#stockpicker-view > .wrapper:first-child').css('height', '0');
  },
  showStockpickerView: function(){
    $('#stockpicker-view').css('opacity', '1');
    $('.panel-loader').remove();
  },
  updateStockpickerView: function(model) {
    var initialHtml = '<td><div class="indicator"></div></td> \
                      <td class="zxg-ticker white"><a href="{{stockUrl}}">{{stockName}}</a></td> \
                      <td class="zxg-price">{{lastpx}}</td> \
                      <td class="zxg-price-change-abs">{{pxchg}}</td> \
                      <td class="zxg-price-change-rel">{{pxchgratio}}</td>';

    var table = d3.select('#stockpicker-table-body')
      .selectAll('tr')
      .data(model.stock.list);

    // Enter loop
    table.enter().append('tr')
      .html(initialHtml);

    // Exit loop
    table.exit().remove();

    // Update loop
    table.attr('class', function(d){
      if (d.sign === '+'){
        return 'rise';
      } else if (d.sign === '-') {
        return 'fall';
      } else {
        return 'neutral';
      }
    });

    table.select('.zxg-ticker').html(function(d){
      return '<a href="' + d.stockUrl + '">' + d.stockName + '</a>';
    });

    table.select('.zxg-price').html(function(d){ return d.lastpx; });
    table.select('.zxg-price-change-abs').html(function(d){ return d.pxchg; });
    table.select('.zxg-price-change-rel').html(function(d){ return d.pxchgratio; });

    StickyColumns.recalc();
  },
  refreshStockpickerView: function(){
    var self = this;
    var refreshRate = 5000;
    setInterval(function(){
      self.renderStockpickerView(false);
    },refreshRate);
  },
  /* Experts module */
  initExpertsModule: function(){
    var self = this;

    $.when(RightPanelModel.getExpertHeadlineAsync(), RightPanelModel.getExpertDataAsync())
    .done(function(headlineModel, model){
      var experts = self.states.expertsView;

      var error = RightPanelModel.model.expertError;

      // Populate views
      if(!error){
        Helper.populateView(experts.el, experts.template, RightPanelModel.model.experts);
        Helper.populateView(experts.modalEl, experts.modalTemplate, RightPanelModel.model.experts);

      // Init experts modal
        $('.experts-header').leanModal({ closeButton: '.modal-close', modalId: '#experts-modal' });
      }else{
        $('#experts-view').append('<div class="empty-data" id="right-panel-data">暂时无法下载数据，请稍后再试</div>');
      }

      // Init like comments action
      $('.experts-like-action').click(function(e){
        e.preventDefault();
        var weiboId = $(e.target).attr('name');

        RightPanelModel.likeCommentAsync(weiboId)
        .then(function(res){
          var content = $(e.target).html();
          var likes = parseInt(content.match(/[^()]+(?=\))/g));
          likes++;
          $(e.target).html('赞(' + likes + ')');
        }, function(res) {
        });
      });

      // Remove loader
      $('#experts-view').css('visibility', 'visible');
      $('.panel-loader').remove();
    });
  },
  render: function(){
    if(HIDE){ //app.js
      this.goTo('expertsView');
    }else{
      this.goTo('chooseStockView');
    }
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
      $('#stock').css('display', 'inline');
    }, function() {
      $('#stock').css('display', 'none');
    });

  },
  goTo: function(toState){
    var self = this;
    _.each(this.states, function(state, stateName){
      if(stateName === toState) {
        state.link.addClass('active');
        state.el.show();

        // Refresh sticky columns
        StickyColumns.recalc();
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
