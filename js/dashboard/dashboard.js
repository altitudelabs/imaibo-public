var Dashboard = {
  firstLoad: true,
  prevData: {
    lastpx: 0,
    change: -200,
    signal: 0
  },
  render: function(model){
    var self = this;

    // Render dashboard
    Helper.populateView('#dashboard','#dashboard-template', model);

    self.updateData(model);
    self.renderThermoLiquid(model);

    this.renderIndicatorTooltip({
      remarks: model.tradingSign.remarks,
      date: model.tradingSign.date,
      clock: model.tradingSign.clock
    });

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

    // console.log(d.hold, d.buy, d.sell);

    Helper.populateView('#indicator-tooltip', '#indicator-template', d);
  },
  renderThermoLiquid: function(model){
    var selector = $('.thermo > .thermo-wrapper > .background');
    var change = parseFloat(model.moodindexInfo.change);

    var minY = 25,
        maxY = 90,
        h = Math.abs(change)/100 * (maxY-minY) + minY;

    if(this.prevData.change !== -200){
      selector.animate({height: h + '%'}, 1000);
    } else {
      selector.css('height', h + '%');
    }
  },
  glow: function(targetId, orgColor, altColor){
      $(targetId).animate({color: altColor}, 500, function() {
         $(targetId).animate({color: orgColor}, 500);
      });
  },
  updateData: function(model){
    var rise = '#d74e37', riseLight = '#fff';
    var fall = '#3bbb57', fallLight = '#fff';
    var neutral = 'rgb(107, 107, 107)', neutralLight = '#7f7f7f';

    var lastpx = model.stockIndexInfo.lastpx;
    var sign   = model.stockIndexInfo.sign;
    var latest = model.moodindexInfo.latest;
    var signal = model.tradingSign.signal;

    if(lastpx != this.prevData.lastpx){
      var orgColor = (sign === '+'? rise : fall);
      var altColor = (sign === '+'? riseLight: fallLight);
      var targetId = '#dashboard-index';

      this.prevData.lastpx = lastpx;
      this.glow(targetId, orgColor, altColor);
    }

    if(latest != this.prevData.latest){
      var orgColor = (latest > 0 ? rise: fall);
      var altColor = (latest > 0 ? riseLight: fallLight);
      var targetId = '#dashboard-mood';
      this.prevData.latest = latest;
      this.glow(targetId, orgColor, altColor);
    }

    if(signal != this.prevData.signal){
      var orgColor;
      var altColor;
      var targetId = '#dashboard-signal';
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
      this.glow(targetId, orgColor, altColor);
    }

    if(!this.firstLoad && parseFloat(model.moodindexInfo.change) !== parseFloat(this.prevData.change)){
        $('#changes').animate({opacity: 1}, 1000, function(){
          $('#changes').animate({opacity: 0}, 300);
        });
        this.prevData.change = model.moodindexInfo.change;
    } else {
      this.firstLoad = !this.firstLoad;
      this.prevData.change = model.moodindexInfo.change;
    }
  },
};