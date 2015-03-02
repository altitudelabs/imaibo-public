/**
 * RightPanel coordinates views for right panel (ie. experts view, news view and stockpicker view)
 */
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

  // Defines states (or subviews) that are contained in view
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

  /*
   * collapseView() collapses right panel
   */
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

  /*
   * expandView() expands right panel
   */
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

  /*
   * init() inits right panel
   */
  init: function() {
    this.initLinks();
    this.render();
    stockpickerView.init();
    expertsView.init();
    newsView.init();
  },

  /*
   * render() renders the default view
   */
  render: function(){
    this.goTo('chooseStockView');
  },

  /*
   * initLinks() renders the appropriate view when a tab is clicked
   */
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

  /*
   * goTo() transitions to a given state
   *
   * @param toState: state to transition to
   */
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
