var ChartModel = {
  model: {
    info:         {},
    daily:        {},
    minute:       {},
    sentiment:    {},
    dataReceived: 0
  },
  getIndexData: function(date, callback){
    var self = this;
    $.getJSON('http://t3-www.imaibo.net/index.php?app=moodindex&mod=IndexShow&act=main&dailyLineSdate='+date+'&latest=1&info=1&trading=1&daily=1&callback=?', function(dailyData) {
      self.model.info   = dailyData.data.info;
      self.model.daily  = dailyData.data.daily;
      self.model.minute = dailyData.data.minute;
      self.model.daily.stockLine.reverse(); //API in descending order, need to revese it.
      self.tryRemoveLoaders();

      // self.randomize();

      callback(self.model);
    });
  },
  getSentimentData: function(date, callback){
    var self = this;
    $.getJSON('http://t3-www.imaibo.net/index.php?app=moodindex&mod=IndexShow&act=moodindexLineUpdate&reqDate='+ date +'&callback=?', function(sentimentData) {
      self.model.sentiment = sentimentData.data;
      self.tryRemoveLoaders();
      callback(self.model);
    });
  },
  showContent: function(){
    $('#price').css('visibility', 'visible');
    $('#macd').css('visibility', 'visible');
    $('#rsi').css('visibility', 'visible');
    $('#sentiment').css('visibility', 'visible');
    $('#about-index-view').css('visibility', 'visible');
  },
  removeLoaders: function(){
    $('.loader').fadeOut(500);
    $('#loading').remove();
  },
  tryRemoveLoaders: function(){
    this.model.dataReceived++;
    if(this.model.dataReceived > 1){
      this.removeLoaders();
      this.showContent();
      this.model.dataReceived = 0;
    }
  },
  randomize: function(){
    console.log(this.model.info);

    // Randomize stock price
    var stockIndexSign = Math.random() > 0.5;
    if (stockIndexSign){
      this.model.info.stockIndexInfo.sign = '+';
      this.model.info.stockIndexInfo.lastpx += Math.round(Math.random()*100*100)/100;
      this.model.info.stockIndexInfo.pxchg = +Math.round(Math.random()*100*100)/100;
    } else {
      this.model.info.stockIndexInfo.sign = '-';
      this.model.info.stockIndexInfo.lastpx -= Math.round(Math.random()*100*100)/100;
      this.model.info.stockIndexInfo.pxchg = -Math.round(Math.random()*100*100)/100;
    }

    // Randomize mood index
    this.model.info.moodindexInfo.change = Math.round((Math.random()-0.5)/0.5*100*100)/100;
    this.model.info.moodindexInfo.latest = (parseFloat(this.model.info.moodindexInfo.latest) + this.model.info.moodindexInfo.change).toFixed(2);

    // Randomize trading sign
    var tradingSign = Math.random();
    this.model.info.tradingSign.prob = 0.6 + Math.round(Math.random()*40)/100;
    if(tradingSign < 0.3){
      this.model.info.tradingSign.signal = -1;
    } else if (tradingSign < 0.6){
      this.model.info.tradingSign.signal = 0;
    } else {
      this.model.info.tradingSign.signal = 1;
    }

    console.log('Mood', this.model.info.moodindexInfo.latest, this.model.info.moodindexInfo.change);
    console.log('Trading Sign', this.model.info.tradingSign.prob, this.model.info.tradingSign.signal);
  }
};
