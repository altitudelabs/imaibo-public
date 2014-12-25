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
    this.el.addClass('collapsed');
    this.collapsed.el.removeClass('collapsed');
    $('#content').css('width', 'calc(100% - 55px)');
    setTimeout(function(){
      ChartView.rebuild();
    }, 400);
  },

  /*
   * Populate HandlebarJS template.
   * ==============================
   * arguments:
   *  - target_selector: DOM object of your target div. i.e. $('#expertsView')
   *  - template_selector: DOM object of your template. i.e. $('#experts-template')
   *  - resource: the data you are passing in. e.g. {name: 'Ray'}
   */
  populateView: function (target_selector, template_selector, resource){
    var template = Handlebars.compile(template_selector.html());
    target_selector.html(template(resource));
  },

  expandView: function(){
    var self = this;
    $('#content').css('width', 'calc(100% - 325px)');

    setTimeout(function(){
      self.collapsed.el.removeClass('uncollapsed');
      self.el.removeClass('collapsed');
      self.collapsed.el.addClass('collapsed');
    }, 500);

    setTimeout(function(){
      ChartView.rebuild();
    }, 400);
  },
  init: function(){
    var self = this;
    this.initLinks();
    this.render();

    // Init stockpicker module
    RightPanelModel.getStockData();

    // Init experts module
    $.when(RightPanelModel.getExpertHeadlineAsync(), RightPanelModel.getExpertDataAsync())
    .done(function(headlineModel, model){
      var experts = self.states.expertsView;

      // Populate views
      self.populateView(experts.el, experts.template, RightPanelModel.model.experts);
      self.populateView(experts.modalEl, experts.modalTemplate, RightPanelModel.model.experts);

      // Init experts modal
      $('.experts-header').leanModal({ closeButton: '.modal-close', modalId: '#experts-modal' });

      // Init like comments action
      $('.experts-like-action').click(function(e){
        e.preventDefault();
        var weiboId = $(e.target).attr('name');

        RightPanelModel.likeCommentAsync(weiboId)
        .then(function(res){
          console.log('Expert like action success', res);
        }, function(res) {
          console.log('Expert like action failure', res);
        });
      });
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
