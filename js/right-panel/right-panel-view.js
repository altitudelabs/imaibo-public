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
  contentView: '',
  states: {
    chooseStockView: {
      el: $('#stockpicker-view'),
      link: $('.link-stockpicker-view')
    },
    expertsView: {
      el: $('#experts-view'),
      link: $('.link-experts-view')
    },
    newsView: {
      el: $('#news-view'),
      link: $('.link-news-view')
    }
  },
  collapseView: function(){
    this.el.addClass('collapsed');
    this.collapsed.el.removeClass('collapsed');
  },
  expandView: function(){
    this.el.removeClass('collapsed');
    this.collapsed.el.addClass('collapsed');
  },
  init: function(){
    this.initLinks();
    this.render();
  },
  render: function(){
    this.goTo('chooseStockView');
  },
  initLinks: function(){
    var self = this;

    _.each(this.states, function(state, name){
      state.link.on('click', function(){
        self.expandView();
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
  }
}
