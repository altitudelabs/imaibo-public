var Dashboard = {
  prevData: {
    lastpx: 0,
    change: -200,
    change_percent: 0,
    signal: 0
  },
  render: function(model){
    var did = this;

    // Render dashboard
    Helper.populateView('#dashboard','#dashboard-template', model);
    var selector = $('.thermo > .thermo-wrapper > .background:not(.full)');
    var change_percent = Math.abs(parseFloat(model.moodindexInfo.changeRatio).toFixed());

    if(change_percent !== this.prevData.change_percent){
        selector.animate({height: change_percent.toString() + '%'}, 1000);
      //this.renderIndicatorLines(model);
      this.prevData.change_percent = change_percent;
   }else{
    selector.css('height', change_percent.toString() + '%');
   }

    did.dataChange(model); //?
    this.renderIndicatorTooltip({remarks: model.tradingSign.remarks,
                                 date: model.tradingSign.date,
                                 clock: model.tradingSign.clock});

  },
  renderIndicatorTooltip: function(data) {
    //risePerct fallPerct neutPerct
    //indicator-template

    $('#prediction-wrapper').hover(function(){
      $('#indicator-tooltip').css('display', 'block');
    }, function(){
      $('#indicator-tooltip').css('display', 'none');
    });

    var remarks = data.remarks
    var hold = remarks.slice(-4);
    var buy  = remarks.substr(0, remarks.length-10).slice(-4);
    var sell = remarks.substr(0, remarks.length-19).slice(-4);
    var clock = data.clock.substr(0, data.clock.length-3);

    var d = {
      date: data.date,
      clock: clock,
      hold: hold,
      buy: buy,
      sell: sell
    };

    console.log(d.hold, d.buy, d.sell);


    Helper.populateView('#indicator-tooltip', '#indicator-template', d);
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
  glow: function(target_id, orgColor, altColor){
      $(target_id).animate({color: altColor}, 500, function() {
         $(target_id).animate({color: orgColor}, 500);
      });
  },
  dataChange: function(model){
    var rise = '#d74e37', riseLight = '#fff';
    var fall = '#3bbb57', fallLight = '#fff';
    var neutral = 'rgb(107, 107, 107)', neutralLight = '#7f7f7f';

    var lastpx = model.stockIndexInfo.lastpx;
    var sign   = model.stockIndexInfo.sign;
    var latest = model.moodindexInfo.latest;
    var signal = model.tradingSign.signal;

    if(lastpx != this.prevData.lastpx){ 
      var orgColor = (sign === '+'? rise: fall);
      var altColor = (sign === '+'? riseLight: fallLight);
      var target_id = '#dashboard-index';

      this.prevData.lastpx = lastpx;
      this.glow(target_id, orgColor, altColor);
    }

    if(latest != this.prevData.latest){
      var orgColor = (latest > 0? rise: fall);
      var altColor = (latest > 0? riseLight: fallLight);
      var target_id = '#dashboard-mood';
      this.prevData.latest = latest;
      this.glow(target_id, orgColor, altColor);
    }

    if(signal != this.prevData.signal){
      var orgColor;
      var altColor;
      var target_id = '#dashboard-signal';
      if(signal === 0){
        orgColor = neutral;
        altColor = neutralLight;
      }else if(signal === 1){
        orgColor = rise;
        altColor = riseLight;
      }else{
        orgColor = fall;
        altColor = fallLight;
      }
      this.prevData.signal = signal;
      this.glow(target_id, orgColor, altColor);
    }

    if(this.prevData.change !== -200 && //sentiment ranges from -100 to 100. For initial page load.
       model.moodindexInfo.change !== this.prevData.change){
        $('#changes').animate({opacity: 1}, 1000, function(){
                  $('#changes').animate({opacity: 0}, 500);
        });
        this.prevData.change = model.moodindexInfo.change;
    }
  },
};
