var Tooltip = {
  el: {
    index: '#index-tooltip',
    macd: '#macd-tooltip',
    rsi: '#rsi-tooltip'
  },
  template: {
    index: Handlebars.compile($('#tooltip-template').html()),
    macd: Handlebars.compile($('#macd-tooltip-template').html()),
    rsi: Handlebars.compile($('#rsi-tooltip-template').html()),
  },
  render: {
    index: function(model){
      model.security.value = model.security.value.slice(0, 4);
      $(Tooltip.el.index).css('top', model.top);
      $(Tooltip.el.index).css('left', model.left);
      $(Tooltip.el.index).html(Tooltip.template.index(model));
    },
    macd: function(model){
      $(Tooltip.el.macd).css('top', model.top);
      $(Tooltip.el.macd).css('left', model.left);
      $(Tooltip.el.macd).html(Tooltip.template.macd(model));
    },
    rsi: function(model){
      $(Tooltip.el.rsi).css('top', model.top);
      $(Tooltip.el.rsi).css('left', model.left);
      $(Tooltip.el.rsi).html(Tooltip.template.rsi(model));
    }
  },
  hide: {
    index: function(){
      $(Tooltip.el.index).css('visibility', 'hidden');
    },
    macd: function(){
      $(Tooltip.el.macd).css('visibility', 'hidden');
    },
    rsi: function(){
      $(Tooltip.el.rsi).css('visibility', 'hidden');
    }
  },
  show: {
    index: function(){
      $(Tooltip.el.index).css('visibility', 'visible');
    },
    macd: function(){
      $(Tooltip.el.macd).css('visibility', 'visible');
    },
    rsi: function(){
      $(Tooltip.el.rsi).css('visibility', 'visible');
    }
  }
};
