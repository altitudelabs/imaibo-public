var ChartModel = {
  model: {
    info:         {},
    daily:        {},
    minute:       {},
    sentiment:    {},
    indexError:   true,
    sentimentError: true,
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
      // dailyData = { data: {indexList: [{yo: 1}]}};
      self.errorCheck(self.api.indexData, dailyData);
      if(!self.model.indexError) {
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
        // sentimentData = { data: {indexList: [{yo: 1}]}};
        self.errorCheck(self.api.sentimentData, sentimentData);
        if(!self.model.sentimentError) {
          self.model.sentiment = sentimentData.data;

          self.model.sentiment.moodindexList = self.model.sentiment.moodindexList;
          
        }
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
  },
  errorCheck: function(api, json) {
    function isObject(val) {
      if (val === null) { return false;}
      return typeof val === 'object';
    }
    if(api === this.api.sentimentData) {
      //do not use (!json.data)
      //cases such as empty string '' will be falsely accepted
      if(json.data === undefined){
        this.log(0, api + ' has no \'data\'');
      }else if(!isObject(json.data)){
        this.log(0, api + ' "data" variable is not an object');
      }else if(json.data.indexList === undefined){
        this.log(0, api + ' data.indexList does not exist');
      }else if(json.data.indexList.constructor !== Array){
        this.log(0, api + ' data.indexList is not an array');
      }else if(json.data.indexList.length === 0){
        this.log(0, api + ' array data.indexList is empty');
      }else if(json.data.indexList[0].price === undefined){
        this.log(0, api + ' data.indexList does not have variable "price"');
      }else if(json.data.indexList[0].volumn === undefined){
        this.log(0, api + ' data.indexList does not have variable "volumn"');
      }else if(json.data.indexList[0].timestamp === undefined){
        this.log(0, api + ' data.indexList does not have variable "timestamp"');
      }else if(json.data.indexList[0].rdate === undefined){
        this.log(0, api + ' data.indexList does not have variable "rdate"');
      }else {
        this.model.sentimentError = false;
      }
      if(json.data.moodindexList === undefined){
        this.log(0, api + ' data.moodindexList does not exist');
      }
    }

    if(api === this.api.indexData){
      if(json.data === undefined){
        this.log(0, api + ' has no \'data\'');
      }else if(!isObject(json.data)){
        this.log(0, api + ' "data" variable is not an object');
      }else if(json.data.info === undefined){
        this.log(0, api + ' data.info does not exist');
      }else if(json.data.info.stockIndexInfo === undefined){
        this.log(0, api + ' data.info.stockIndexInfo does not exist');
      }else if(json.data.info.moodindexInfo === undefined){
        this.log(0, api + ' data.info.moodindexInfo does not exist');
      }else if(json.data.info.tradingSign === undefined){
        this.log(0, api + ' data.info.tradingSign does not exist');
      }else if(json.data.daily === undefined){
        this.log(0, api + ' data.daily does not exist');
      }else {
        this.model.indexError = false;
      }
    }
  },
  log: function(code, message) {
    if(PRODUCTION) return;
    var now = new Date();
    console.log('%c [' +  now.toTimeString() +'] ' + message, 'color: red; font-size: 1.5em;');
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
