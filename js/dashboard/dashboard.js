var Dashboard = {
  render: function(model){
    // Render dashboard
    Helper.populateView('#dashboard','#dashboard-template', model);
    var selector = $('.thermo > .thermo-wrapper > .background');
    var change_percent = parseFloat(model.moodindexInfo.changeRatio).toFixed();

    if(change_percent >= 25)
      selector.animate({height: '25%'});
    if(change_percent >= 50)
      selector.animate({height: '50%'});
    if(change_percent >= 75)
      selector.animate({height: '75%'});
    if(change_percent >= 100)
      selector.animate({height: '100%'});
  },
  renderIndicatorLines: function(model){

    // Set thermometer liquid height
    var $thermoLiquid = $('.thermo > .thermo-wrapper > .background'),
    moodLevel = parseFloat(model.moodindexInfo.latest),
    minY = 25,
    maxY = 100;

    var h = Math.min(Math.abs(moodLevel)/100, 100) * (maxY-minY) + minY;
    $thermoLiquid.animate({height: h + '%'});
  },


};
