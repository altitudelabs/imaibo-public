var ChartModel = {
  model: {
    info:         {},
    daily:        {},
    minute:       {},
    sentiment:    {},
    dataReceived: 0
  },
  getIndexData: function(callback){
    var self = this;
    $.getJSON('http://t3-www.imaibo.net/index.php?app=moodindex&mod=IndexShow&act=main&info=1&trading=1&daily=1&callback=?', function(dailyData) {
      self.model.info   = dailyData.data.info;
      self.model.daily  = dailyData.data.daily;
      self.model.minute = dailyData.data.minute;
      self.model.daily.stockLine.reverse(); //API in descending order, need to revese it.
      self.tryRemoveLoaders();

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
  }
};
