var Tooltip = {
  el: '#tooltip',
  template: {
    index: Handlebars.compile($('#tooltip-template').html()),
    macd: Handlebars.compile($('#macd-tooltip-template').html()),
    rsi: Handlebars.compile($('#rsi-tooltip-template').html()),
  },
  render: {
    index: function(model){
      model.security.value = model.security.value.slice(0, 4);
      $(Tooltip.el).css('top', model.top);
      $(Tooltip.el).css('left', model.left);
      $(Tooltip.el).html(Tooltip.template.index(model));
    },
    macd: function(model){
      $(Tooltip.el).css('top', model.top);
      $(Tooltip.el).css('left', model.left);
      $(Tooltip.el).html(Tooltip.template.macd(model));
    },
    rsi: function(model){
      $(Tooltip.el).css('top', model.top);
      $(Tooltip.el).css('left', model.left);
      $(Tooltip.el).html(Tooltip.template.rsi(model));
    }
  },
  hide: function(){
    $(this.el).css('visibility', 'hidden');
  },
  show: function(){
    $(this.el).css('visibility', 'visible');
  }
};
