var Dashboard = {
  firstLoad: true,
  prevData: {
    lastpx: 0,
    before: -200,
    signal: 0
  },
  render: function(model){
    var self = this;

    if (self.firstLoad){
      if(model.moodindexInfo.changeRatio.slice(-1) != '%'){
        model.moodindexInfo.changeRatio += '%';
      }
      Helper.populateView('#dashboard','#dashboard-template', model);
      this.prevData.latest = model.moodindexInfo.latest;
      this.prevData.lastpx = model.stockIndexInfo.lastpx;
      this.prevData.signal = model.tradingSign.signal;
      self.firstLoad = false;
    } else {
      self.updateDashboard('#dashboard','#dashboard-template', model);
    }

    self.updateData(model);

    this.renderIndicatorTooltip({
      remarks: model.tradingSign.remarks,
      date: model.tradingSign.date,
      clock: model.tradingSign.clock
    });
  },
  renderWithError: function(){
    $('#snapshot').append('<div class="empty-data" id="dashboard-no-data">暂时无法下载数据，请稍后再试</div>');
  },
  updateDashboard: function(targetId, templateId, resource){
    var targetSelector = $(targetId);
    var templateSelector = $(templateId);
    var template = Handlebars.compile(templateSelector.html());
    var html = template(resource);

    targetSelector.find('#dashboard-index').replaceWith($(html)[0]);
    targetSelector.find('#dashboard-mood').replaceWith($(html)[2]);
    targetSelector.find('#prediction-wrapper').replaceWith($(html)[4]);
  },
  renderIndicatorTooltip: function(data) {
    $('#prediction-wrapper').hover(function(){
      if(!$('#dashboard-signal').hasClass('no-data')){
        $('#indicator-tooltip').css('display', 'block');
      }
    }, function(){
      $('#indicator-tooltip').css('display', 'none');
    });

    if(data.remarks !== undefined) {
      var remarks = data.remarks.split(' ');

      var hold    = remarks[6];
      var buy     = remarks[4];
      var sell    = remarks[2];
      var c = '';
      for(var i = 0; i < hold.length; i++){
        if(!isNaN(parseInt(hold[i])) ||
           hold[i] === '.'){
            c += hold[i];
        }
      }
      var clock = data.clock.substr(0, data.clock.length-3);

      var d = {
        date: data.date,
        clock: clock,
        hold: c,
        buy: buy,
        sell: sell
      };

      Helper.populateView('#indicator-tooltip', '#indicator-template', d);
    }
  },
  renderThermoLiquid: function(model, animate){
    var liquid = $('.thermo > .thermo-wrapper > .background');
    var dottedLine = $('.thermo > .thermo-wrapper > .previous-sentiment-dotted-line');
    var before = parseFloat(model.moodindexInfo.before);
    var latest = parseFloat(model.moodindexInfo.latest);

    var minY = 25,
        maxY = 95,
        h1 = Math.min(Math.abs(before)/100*(maxY-minY)+minY,100),
        h2 = Math.min(Math.abs(latest)/100*(maxY-minY)+minY,100);

    if (animate){
      liquid.css('height', h1 + '%');
      liquid.animate({height: h2 + '%'}, 1000);
      dottedLine.css('height', h1 + '%');
    } else {
      liquid.css('height', h2 + '%');
      dottedLine.css('height', h1 + '%');
    }
  },
  glow: function(targetId, orgColor, altColor){
      $(targetId).animate({color: altColor}, 2000, function() {
         $(targetId).animate({color: orgColor}, 2000);
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
    var change = parseFloat(model.moodindexInfo.change);

    if(lastpx != this.prevData.lastpx){
      var orgColor = (sign === '+'? rise : fall);
      var altColor = (sign === '+'? riseLight: fallLight);
      var targetId = '#dashboard-index';

      this.prevData.lastpx = lastpx;
      this.glow(targetId, orgColor, altColor);
    }

    if(latest != this.prevData.latest){
      var orgColor = (change > 0 ? rise: fall);
      var altColor = (change > 0 ? riseLight: fallLight);
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

    if(parseFloat(model.moodindexInfo.change) !== parseFloat(this.prevData.change)){
      $('#changes').text(model.moodindexInfo.change);
      if(IE8){
        $('#changes').css({'-ms-filter': "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)"});
        setTimeout(function(){
          $('#changes').css({'-ms-filter': "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)"});
        }, 1000);
      } else {
        $('#changes').animate({opacity: 1}, 500);
        setTimeout(function(){
          $('#changes').animate({opacity: 0}, 1500);
        }, 2000);
      }
      this.renderThermoLiquid(model, true);
      this.prevData.change = model.moodindexInfo.change;
    } else {
      this.renderThermoLiquid(model, false);
      this.firstLoad = false;
      this.prevData.change = model.moodindexInfo.change;
      this.prevData.before = model.moodindexInfo.before;
    }
  },
};