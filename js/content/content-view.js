/**
 * ContentView toggles between tabs on left-panel
 * - tab 1 contains charts
 * - tab 2 is a hyperlink to 什么是心情指数
 */
var ContentView = {
  baseUrl: 'http://www.imaibo.net',
  el: $('#content'),

  // Defines states (or subviews) that are contained in view
  states: {
    chartView: {
      el: $('#chart-view'),
      link: $('.link-chart-view')
    },
    aboutIndexView: {
      el: $('#about-index-view'),
      link: $('.link-about-index-view'),
    }
  },

  /*
   * init() adds links for various states (ie. tabs) in ContentView and goes to default view
   */
  init: function() {
    this.initLinks();
    this.goTo('chartView');
  },

  /*
   * initLinks() renders the appropriate view when a tab is clicked
   */
  initLinks: function() {
    var self = this;
    _.each(this.states, function(state, name){
      state.link.on('click', function() {
        if (name === 'aboutIndexView'){
          self.states.aboutIndexView.url = self.baseUrl + '/moodindex/moodindexDesc';
          window.open(self.states.aboutIndexView.url);
        } else {
          self.goTo(name);
        }
      });
    });
  },

  /*
   * goTo() transitions to a given state
   *
   * @param toState: state to transition to
   */
  goTo: function(toState) {
    _.each(this.states, function(state, stateName) {
      if (stateName === toState) {
        state.link.addClass('active');
        state.el.show();
      } else {
        state.link.removeClass('active');
        state.el.hide();
      }
    });
  }
};