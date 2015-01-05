var ChartModel = {
  model: {
    info:         {},
    daily:        {},
    minute:       {},
    sentiment:    {},
    dataReceived: 0
  },
  api: {
    production: 'http://www.imaibo.net',
    staging: 'http://t3-www.imaibo.net',
    base: '/index.php?app=moodindex&mod=IndexShow',
    indexData:     '&act=main',
    sentimentData: '&act=moodindexLine',
    latest:        '&latest=1',
    daily:         '&daily=1',
    date:          '&reqDate=',
    jsonp:         '&callback=?'
  },
  /*
   * func getIndexData()
   * ===================
   * Arguments:
   * - date: date in yyyymmdd format
   * - initial: boolean, indicates if we are only fetching new data
   * - callback: callback function
  */
  getIndexData: function(date, initial, callback){
    var self = this;
    var api  = (PRODUCTION? self.api.production : self.api.staging) + self.api.base + self.api.indexData  + '&dailyLineSdate=' + date; 
        api += (initial? self.api.daily: '');
        api += self.api.latest + '&info=1&trading=1' 
        api += self.api.jsonp;
    $.getJSON(api, function(dailyData) {
      self.model.info   = dailyData.data.info;
      self.model.minute = dailyData.data.minute;

      if(initial){ 
        self.model.daily  = dailyData.data.daily;
        //API returns data in descending order
        if(self.model.daily.stockLine[0].timestamp != dailyData.data.latestPrice.timestamp) {
          self.model.daily.stockLine.unshift(dailyData.data.latestPrice);
        }
        self.model.daily.stockLine.reverse();       
      }else{
        var latestPrice = dailyData.data.latestPrice;
        var lastData    = self.model.daily.stockLine.slice(-1).pop();

        if(lastData && lastData.timestamp !== dailyData.data.latestPrice.timestamp){
          self.model.daily.stockLine.push(dailyData.data.latestPrice);
        }
      } 

      self.tryRemoveLoaders();

      // self.randomize();

      callback();
    });
  },
  getSentimentData: function(date, initial ,callback){
    'use strict';
    
    var self = this;
    var api;
    // if (initial) {
    if (true) {
      api =  (PRODUCTION? self.api.production : self.api.staging) + self.api.base + self.api.sentimentData + self.api.jsonp;
      $.getJSON(api, function(sentimentData) {
        self.model.sentiment = sentimentData.data;

        self.model.sentiment.moodindexList = self.model.sentiment.moodindexList;
        
        self.tryRemoveLoaders();
        callback(true);
      });
    } else {
      api = (PRODUCTION? self.api.production : self.api.staging) + self.api.base + self.api.sentimentData + self.api.date + date + self.api.jsonp;
      $.getJSON(api, function(updateSentimentData) {
        var isNewData = true;

        //very rough way of checking whether there is new data  =REFACTOR
        if (updateSentimentData.data.indexList.length === self.model.sentiment.indexList.length) {
          if (updateSentimentData.data.moodindexList.length === self.model.sentiment.moodindexList.length) {
            isNewData = false;
          }
        }
        self.model.sentiment = updateSentimentData.data;
        self.tryRemoveLoaders();
        callback(isNewData);
      });
    }
    // $.getJSON('http://t3-www.imaibo.net/index.php?app=moodindex&mod=IndexShow&act=moodindexLine&reqDate='+ date +'&callback=?', function(sentimentData) {
    // $.getJSON(api, function(sentimentData) {
    //   self.model.sentiment = sentimentData.data;
    //   self.tryRemoveLoaders();
    //   callback();
    // });
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
    this.model.info.moodindexInfo.before = Math.round((Math.random()-0.5)/0.5*100*100)/100;
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
