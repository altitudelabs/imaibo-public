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
  initStockpickerModule: function(){
    var self = this;
    if (!HIDE) {
      RightPanelModel.getStockData(function(){

      });
    }
  },
  initExpertsModule: function(){
    var self = this;

    $.when(RightPanelModel.getExpertHeadlineAsync(), RightPanelModel.getExpertDataAsync())
    .done(function(headlineModel, model){
      var experts = self.states.expertsView;

      var isEmpty = RightPanelModel.model.experts.list.length == 0;

      // Populate views
      Helper.populateView(experts.el, experts.template, RightPanelModel.model.experts);
      Helper.populateView(experts.modalEl, experts.modalTemplate, RightPanelModel.model.experts);

      // Init experts modal
      if(!isEmpty){
        $('.experts-header').leanModal({ closeButton: '.modal-close', modalId: '#experts-modal' });
      }

      // Init like comments action
      $('.experts-like-action').click(function(e){
        e.preventDefault();
        var weiboId = $(e.target).attr('name');

        RightPanelModel.likeCommentAsync(weiboId)
        .then(function(res){
          console.log('Expert like action success', res);
          var content = $(e.target).html();
          var likes = parseInt(content.match(/[^()]+(?=\))/g));
          likes++;
          $(e.target).html('赞(' + likes + ')');
        }, function(res) {
          console.log('Expert like action failure', res);
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
