var ContentView = {
  baseUrl: 'http://t3-www.imaibo.net',
  el: $('#content'),
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
  init: function(){
    this.initLinks();
    this.goTo('chartView');
  },
  initLinks: function(){
    var self = this;
    _.each(this.states, function(state, name){
      state.link.on('click', function(){
        if (name === 'aboutIndexView'){
          self.states.aboutIndexView.url = self.baseUrl + '/about-moodindex';
          window.open(self.states.aboutIndexView.url);
        } else {
          self.goTo(name);
        }
      });
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
};