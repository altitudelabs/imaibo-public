var RightPanel = {
  el: $('#right-panel'),
  collapsed: {
    el: $('#right-panel-collapsed'),
    link: $('.link-right-panel-collapsed'),
    icon: $('.vertical-collapse'),
  },
  uncollapsed: {
    icon: $('.vertical-uncollapse'),
  },
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
  collapseView: function() {

    // Collapse right panel
    this.el.addClass('collapsed');
    this.collapsed.el.removeClass('collapsed');
    $('#content').addClass('full');

    // Rebuild chart after animation
    setTimeout(function() {
      ChartView.rebuild();
    }, 400);
  },
  expandView: function() {
    var self = this;
    // cannot set width directly as there may be problems with sticky kit
    $('#content').removeClass('full');

    setTimeout(function() {
      self.collapsed.el.removeClass('uncollapsed');
      self.el.removeClass('collapsed');
      self.collapsed.el.addClass('collapsed');

      // Rebuild chart
      ChartView.rebuild();

    }, 500);
  },
  init: function() {
    this.initLinks();
    this.render();
    stockpickerView.init();
    expertsView.init();
    newsView.init();
  },
  render: function(){
    this.goTo('chooseStockView');
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
  }
}
