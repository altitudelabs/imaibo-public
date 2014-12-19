var Toolbar = {
  el: '#toolbar',
  init: function(){
    //this.initDropdown();
    this.initZoom();
    this.initRsi();
  },
  render: function(model){
    var temp = model.stockLine.slice(-1).pop();
    var ma = ['5', '10', '20', '60'];
    var t = [];
    ma.forEach(function(res){
      t.push({
        ma_id: 'ma'+res+'-checkbox',
        ma_label_id: 'ma'+res+'-label',
        ma_label: 'MA'+res+'=' + temp['ma'+res]
      });
    });

    Helper.populateView('#ma-dropdown-menu', '#ma-template', t);
    //bind checkbox listeners to each MA line
    toggleMA('5');
    toggleMA('10');
    toggleMA('20');
    toggleMA('60');


    //bind checkbox listeners to each MA line
    function toggleMA(val){
      var ma = 'ma' + val;
      $('#' + ma + '-checkbox').change(function(){
        /*
         * see http://jsperf.com/boolean-int-conversion/3 for ternary operators speed
         * Chrome benefits greatly using explicit rather than implicit.
         * but on average implicit ternary operator is pretty fast
         */
        var legends = $('#legend').attr('ma');
        $('#legend > li').remove();
        legends = legends.split(',');

        //remove item if already exist
        var item = $.inArray(val, legends);
        if(item != -1){  //if does not exist
          legends.splice(item, 1);
        }else{
          legends.push(val);
        }

        legends = legends.map(function(item){
          return parseInt(item, 10);
        });

        legends.sort(function(a, b){ return b - a; });
        $('#legend').attr('ma', legends.join(','));

        //sentimentLine always exist
        $('#legend').prepend('<li id="sentiment-legend">'                                    +
                             '<div id="sentiment-legend-line" class="legend-line"></div>' +
                             '<span>心情指数</span>'                                        +
                             '</li>');

        legends.forEach(function(ma) {
          if(!isNaN(ma)){
            $('#legend').prepend('<li id="ma' + ma + '-legend">'                                    +
                                 '<div id="ma' + ma + '-legend-line" class="legend-line"></div>' +
                                 '<span>MA' + ma + '</span>'                                     +
                                 '</li>');
          }
        });

        d3.select('#' + ma + '-line').style('opacity', this.checked? 1:0);
        $('#' + ma + '-legend').css('opacity', this.checked? 1:0);
      });
    }
  },
  initDropdown: function(){
    var dropdownMenu = $('.dropdown-menu');
    $('.link-dropdown').on('mouseenter', function(){
      dropdownMenu.css('display', 'block');
    }).on('mouseleave', function(){
      dropdownMenu.css('display', 'none');
    });
  },
  initZoom: function(){
    var zoomIn = $('#zoomin');
    var zoomOut = $('#zoomout');
    zoomIn.click(function(){
      IndexChart.redraw(1.2);
      RsiChart.redraw(1.2);
      MacdChart.redraw(1.2);
    });

    zoomOut.click(function(){
      IndexChart.redraw(1/1.2);
      RsiChart.redraw(1/1.2);
      MacdChart.redraw(1/1.2);
    });
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
