var DashboardView = {
  init: function() {
    this.initExpert();
    this.initStock();
    $('#week-radio')[0].checked = true;
  },
  initExpert: function() {
    $('.like').hover(function(){
       $(this).addClass('active');
    },
    function(){
      $(this).removeClass('active');
    });

    $('.discussion').hover(function(){
      $(this).addClass('active');
    },
    function(){
      $(this).removeClass('active');
    });
  },
  initStock: function() {
    $('.vertical-collapse.uncollapse').click(function(){
      $(this).css('background-image', '../assets/chart/collapse-rightwards-press.png');
    });

  }

};
