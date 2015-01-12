var Toolbar = {
  el: '#toolbar',
  init: function(){
    //this.initDropdown();
    this.initZoom();
    this.initRsi();
    this.initMacd();
    this.initFreq();
  },
  render: function(model){
    var temp = model.stockLine.slice(-1).pop();
    var ma = ['5', '10', '20', '60'];
    var t = [];
    ma.forEach(function(res){
      t.push({
        maId: 'ma'+res+'-checkbox',
        maLabelId: 'ma'+res+'-label',
        maLabel: 'MA'+res
      });
    });

    Helper.populateView('#ma-dropdown-menu', '#ma-template', t);
    //bind checkbox listeners to each MA line
    toggleMA('5');
    toggleMA('10');
    toggleMA('20');
    toggleMA('60');

    //2015 01 07. Problem 6. Requires 5, 10, 20 to be checked on default
    $("#ma5-checkbox").click();
    $("#ma10-checkbox").click();
    $("#ma20-checkbox").click();


    //bind checkbox listeners to each MA line
    function toggleMA(val){
      var ma = 'ma' + val,
          $checkbox = $('#' + ma + '-checkbox');
          $row = $('.' + ma + '-checkbox');

      $row.click(function(e) {
        var cb = $(this).find(':checkbox')[0];
        //if the click wasn't from the checkbox already, toggle it
        if(e.target != cb) cb.click();
      });
      $checkbox.change(function(e){
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
        $('#legend').prepend('<li id="sentiment-legend">'                                 +
                             '<div id="sentiment-legend-line" class="legend-line"></div>' +
                             '<span>心情指数</span>'                                       +
                             '</li>');

        legends.forEach(function(ma) {
          if(!isNaN(ma)){
            $('#legend').prepend('<li id="ma' + ma + '-legend">'                                    +
                                    '<div id="ma' + ma + '-legend-line" class="legend-line"></div>' +
                                    '<span>MA' + ma + ': ' + temp['ma'+ma] + '</span>'              +
                                 '</li>');
          }
        });
        if(IE8){
          d3.select('#'+ ma + '-line').style('stroke-opacity', this.checked? '1':'0');
        }else{
          d3.select('#' + ma + '-line').style('opacity', this.checked? 1:0);
        }
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
      ChartView.redraw(1.2);
      // IndexChart.redraw(1.2);
      // RsiChart.redraw(1.2);
      // MacdChart.redraw(1.2);
    });

    zoomOut.click(function(){
      ChartView.redraw(1/1.2);

      // IndexChart.redraw(1/1.2);
      // RsiChart.redraw(1/1.2);
      // MacdChart.redraw(1/1.2);
    });
  },
  initRsi: function(){
    $('#rsi-checkbox').prop('checked', false); // fix button checks persists after refreshing in Firefox

    $('#rsi-checkbox-row').click(function(e) {
      var cb = $(this).find(':checkbox')[0];
      //if the click wasn't from the checkbox already, toggle it
      if(e.target != cb) cb.click();
    });

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
  },
  initMacd: function() {
    $('#macd-checkbox').prop('checked', false);

    $('#macd-checkbox-row').click(function(e) {
      var cb = $(this).find(':checkbox')[0];
      //if the click wasn't from the checkbox already, toggle it
      if(e.target != cb) cb.click();
    });

    if($('#macd-checkbox').checked){
       $('#macd').css('display', 'block');
    }else{
       $('#macd').css('display', 'none');
    }

    $('#macd-checkbox').change(function(){
      if(this.checked){
       $('#macd').css('display', 'block');
      }else{
       $('#macd').css('display', 'none');
      }
    });
  },
  initFreq: function() {
    $('#minute-radio-row').click(function(e) {
      var rb = $(this).find(':radio')[0];
      if(e.target != rb) rb.click();
    });

    $('#day-radio-row').click(function(e) {
      var rb = $(this).find(':radio')[0];
      if(e.target != rb) rb.click();
    });

    $('#week-radio-row').click(function(e) {
      var rb = $(this).find(':radio')[0];
      if(e.target != rb) rb.click();
    });
  }
};
