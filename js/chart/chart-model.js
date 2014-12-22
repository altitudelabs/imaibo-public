var ChartModel = {
  model: {
    info:         {},
    daily:        {},
    minute:       {},
    sentiment:    {},
    dataRecieved: 0
  },
  getIndexData: function(call){
    var self = ask = this;
    $.getJSON('http://t3-www.imaibo.net/index.php?app=moodindex&mod=IndexShow&act=main&info=1&trading=1&daily=1&callback=?', function(dailyData) {
      self.model.info   = dailyData.data.info;
      self.model.daily  = dailyData.data.daily;
      self.model.minute = dailyData.data.minute;
      self.model.daily.stockLine.reverse(); //API in descending order, need to revese it.

      ask.CanIRemoveLoaders();// ?

      var me_maybe = self.model;
      call(me_maybe); //xoxo
    });
  },
  getSentimentData: function(date, callback){
    var self = ask = this;
    $.getJSON('http://t3-www.imaibo.net/index.php?app=moodindex&mod=IndexShow&act=moodindexLineUpdate&reqDate='+ date +'&callback=?', function(sentimentData) {
      self.model.sentiment = sentimentData.data;
      ask.CanIRemoveLoaders(); // ?
      callback(self.model);
    });
  },
  removeLoaders: function(){
    $('.loader').fadeOut(500);
    $('#loading').remove();
    $('.btn-buy-sell-wrapper > .btn').removeClass('disabled');
  },
  CanIRemoveLoaders: function(){
    if(++this.model.dataRecieved > 1){
      this.removeLoaders();
      this.model.dataRecieved = 0;
    }
  }
};
