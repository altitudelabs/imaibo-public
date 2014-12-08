var Toolbar = {
  el: '#toolbar',
  init: function(){
    //this.initDropdown();
    this.initZoom();
    this.initPeriod();
    this.initMa();
    this.initRsi();
  },
  initDropdown: function(){
    var dropdownMenu = $('.dropdown-menu');
    $('.link-dropdown').on('mouseenter', function(){
      console.log('initDropdown');
      dropdownMenu.css('display', 'block');
    }).on('mouseleave', function(){
      dropdownMenu.css('display', 'none');
    });
  },
  initZoom: function(){
    var zoomIn = $('#zoomin');
    var zoomOut = $('#zoomout');
    zoomIn.click(function(){
      ChartView.indexChart.redraw(1.2);

    });

    zoomOut.click(function(){
      ChartView.indexChart.redraw(1/1.2);
    });
  },
  initPeriod: function(){
    //TODO
  },
  initMa: function(){
    //TODO
    
  },
  initRsi: function(){
    //TODO
    //
    if($('#rsi-checkbox').checked){
       $('#rsi').css('display', 'block');
    }else{
       $('#rsi').css('display', 'none');
    }

    $('#rsi-checkbox').change(function(){
      if(this.checked){
       $('#rsi').css('display', 'block');
      }else{
       $('#rsi').css('display', 'none');
      }
    });
  }
};
