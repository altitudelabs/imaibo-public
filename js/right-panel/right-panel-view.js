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
      template: $('#experts-template')
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
  populateView: /*
                 * Populate HandlebarJS template.
                 * ==============================
                 * arguments:
                 *  - target_selector: DOM object of your target div. i.e. $('#expertsView')
                 *  - template_selector: DOM object of your template. i.e. $('#experts-template')
                 *  - resource: the data you are passing in. e.g. {name: 'Ray'}
                 */
  function (target_selector, template_selector, resource){
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
    this.initLinks();
    this.render();
    RightPanelModel.getExpertData();
    RightPanelModel.getStockData();
    // this.disableBodyScroll();
  },
  render: function(){
    console.log(HIDE);
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
