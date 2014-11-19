var Tooltip = {
  el: '#tooltip',
  template: Handlebars.compile($('#tooltip-template').html()),
  render: function(model){
    $(this.el).css('top', model.top);
    $(this.el).css('left', model.left);
    $(this.el).html(this.template(model));
  },
  hide: function(){
    $(this.el).css('visibility', 'hidden');
  },
  show: function(){
    $(this.el).css('visibility', 'visible');
  }
};