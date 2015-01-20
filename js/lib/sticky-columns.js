var StickyColumns = {
  active: false,
  start: function(){
    if (!this.active) {
      this.active = true;
      $('#right-panel, #content').stick_in_parent();
      // $('.container').scrollLeft(ChartView.properties.scrollDistance);
    } 
    else {
      this.recalc();
    }
  },
  stop: function(){
    $('#right-panel, #content').trigger('sticky_kit:detach');
    this.active = false;
  },
  recalc: function(){
    $('#right-panel, #content').trigger('sticky_kit:recalc');
    // $('.container').scrollLeft(ChartView.properties.scrollDistance);
  }
};