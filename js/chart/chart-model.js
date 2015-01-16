'use strict'

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
    production:     'http://www.imaibo.net',
    staging:        'http://t3-www.imaibo.net',
    base:           '/index.php?app=moodindex&mod=IndexShow',
    indexData:      '&act=main',
    sentimentData:  '&act=moodindexLine',
    latest:         '&latest=1',
    daily:          '&daily=1',
    minute:         '&minute=1',
    weekly:         '&weekly=1',
    date:           '&reqDate=',
    dailyLineSdate: '&dailyLineSdate=',
    jsonp:          '&callback=?',
  },
  currEarliestTime: 0,
  endOfSentiment: false,
  baseUrl: function(){
    return PRODUCTION ? this.api.production : this.api.staging;
  },
  getIndexDataAsync: function(date, initial){
    var self = this;
    return $.Deferred(function(d){
      self.getIndexData(date, initial, d.resolve, false);
    }).promise();
  },
  getSentimentDataAsync: function(){
    var self = this;
    return $.Deferred(function(d){
      self.getSentimentData(d.resolve, d.reject);
    }).promise();
  },
  updateSentimentDataAsync: function(date){
    var self = this;
    return $.Deferred(function(d){
      self.updateSentimentData(date, d.resolve, d.reject);
    }).promise();
  },
  apiBuilder: function(requestChart, initial, updateByDragging, date) {
    var api = this.baseUrl() + this.api.base;

    if(requestChart === 'index') {
      api += this.api.indexData;
      api += (initial || updateByDragging ? this.api.daily : '');
      api += (updateByDragging? this.api.dailyLineSdate + date: '');
      api += (!updateByDragging? this.api.latest: '');
      api += '&info=1&trading=1';
    }else{
      api += this.api.sentimentData;
      api += (initial? this.api.date + date: '');
    }
    api += this.api.jsonp;

    return api;
  },
  setIndexData: function(res, handler, initial, updateByDragging) {
    if(res.code !== 'undefined' && res.code === 0 && !this.model.indexError) {
      this.model.info   = res.data.info;
      this.model.minute = res.data.minute;
      // Process data
      this.processIndexData(res, initial, updateByDragging);

      if(handler) handler({ isError: this.model.indexError });
    } else {
      handler({ isError: this.model.indexError });
    }
  },
  /*
   * func getIndexData()
   * ===================
   * Arguments:
   * - date: date in yyyymmdd format
   * - initial: boolean, indicates if we are only fetching new data
   * - handler: callback function
   * - updateByDragging: boolean, indicates if we are updating by dragging index chart
  */
  getIndexData: function(date, initial, handler, updateByDragging, callback){
    var self = this;
    var api  = this.apiBuilder('index', initial, updateByDragging, date);

    $.getJSON(api, function(res) {
      self.errorCheckIndex(res, initial);
      self.setIndexData(res, handler, initial, updateByDragging);
      if(callback){
        callback();
      }
    }).fail(function(){
      handler({ isError: self.model.indexError });
    });
  },
  getSentimentData: function(handler){
    var self = this;
    var api = this.apiBuilder();
    $.getJSON(api, function(res) {
      self.errorCheckSentiment(res);
      if(res.code !== 'undefined' && res.code === 0 && !self.model.sentimentError) {
        self.model.sentiment = res.data;
        handler({ isError: self.model.sentimentError });
      } else {
        handler({ isError: self.model.sentimentError });
      }
    }).fail(function(){
      handler({ isError: self.model.sentimentError });
    });
  },
  updateSentimentData: function(date, handler){
    var self = this;
    var api = this.apiBuilder('sentiment', false, false, date);
    $.getJSON(api, function(res) {
      // Add new ticks to the existing array if no error
      if (res.code !== 'undefined' && res.code === 0 && !self.model.sentimentError){
        var lastData = self.model.sentiment.indexList[self.model.sentiment.indexList.length-1],
            lastTimestamp = lastData.timestamp;

        _.each(res.data.indexList, function(tick){
          if (tick.timestamp > lastTimestamp){
            self.model.sentiment.indexList.push(tick);
          }
        });

        self.model.sentiment.moodindexList = res.data.moodindexList;
      }

      handler({ isError: self.model.sentimentError });
    }).fail(function(){
      handler({ isError: self.model.sentimentError });
    });
  },
  /* Checks if variable is object */
  isObject: function(val){
    if (val === null) { return false; }
    return typeof val === 'object';
  },
  /* Checks if variable is empty object */
  isEmptyObject: function(obj) {
    for (var prop in obj) {
      if(obj.hasOwnProperty(prop)) return false;
    }
    return true;
  },
  errorCheckSentiment: function(res){
    if(res.data === undefined){
        this.log(0, 'Sentiment API has no \'data\'');
      } else if (!this.isObject(res.data) || this.isEmptyObject(res.data)){
        this.log(0, 'Sentiment API "data" variable is not an object or is empty');
      } else if (res.data.indexList === undefined || res.data.indexList.length === 0){
        this.log(0, 'Sentiment API data.indexList does not exist');
      } else if (res.data.indexList[0].price === undefined){
        this.log(0, 'Sentiment API data.indexList does not have variable "price"');
      } else if (res.data.indexList[0].volumn === undefined){
        this.log(0, 'Sentiment API data.indexList does not have variable "volumn"');
      } else if (res.data.indexList[0].timestamp === undefined){
        this.log(0, 'Sentiment API data.indexList does not have variable "timestamp"');
      } else if (res.data.indexList[0].rdate === undefined){
        this.log(0, 'Sentiment API data.indexList does not have variable "rdate"');
      } else if (res.data.moodindexList === undefined || res.data.moodindexList.length === 0){
        this.log(0, 'Sentiment API data.moodindexList does not exist');
      } else {
        this.model.sentimentError = false;
      }
  },
  errorCheckIndex: function(res, initial){
    if(res.data === undefined){
        this.log(0, 'Index API has no \'data\'');
      } else if(!this.isObject(res.data) || this.isEmptyObject(res.data)){
        this.log(0, 'Index API "data" variable is not an object or is empty');
      } else if(res.data.info === undefined || this.isEmptyObject(res.data.info)){
        this.log(0, 'Index API data.info does not exist');
      } else if(res.data.info.stockIndexInfo === undefined || this.isEmptyObject(res.data.info.stockIndexInfo)){
        this.log(0, 'Index API data.info.stockIndexInfo does not exist');
      } else if(res.data.info.moodindexInfo === undefined || this.isEmptyObject(res.data.info.moodindexInfo)){
        this.log(0, 'Index API data.info.moodindexInfo does not exist');
      } else if(res.data.info.tradingSign === undefined || this.isEmptyObject(res.data.info.tradingSign)){
        this.log(0, 'Index API data.info.tradingSign does not exist');
      } else if(initial && (res.data.daily === undefined || res.data.daily.length === 0)){
        this.log(0, 'Index API data.daily does not exist');
      } else {
        this.model.indexError = false;
      }
  },
  processIndexData: function(res, initial, updateByDragging){

    var self = this;
    var daily = self.model.daily;
    if(initial){
      self.model.daily = res.data.daily;

      // API returns data in descending order
      if(self.model.daily.stockLine[0].timestamp != res.data.latestPrice.timestamp) {
        self.model.daily.stockLine.unshift(res.data.latestPrice);
      }
      self.model.daily.stockLine.reverse();
    } 
    else if(updateByDragging){
      var stockLine = res.data.daily.stockLine;
      var returnedLatestTime = stockLine.slice(-1).pop().timestamp;

      this.currEarliestTime  = this.currEarliestTime 
                                || daily.stockLine[0].timestamp;
     
     //mark if no more sentiment data is returned. i.e assuming when it returns 0
      this.endOfSentiment = this.endOfSentiment 
                            || stockLine
                                .map(function(e) { return e.moodindex === 0; })
                                .reduce(function(prev, curr, i, arr) { return prev || curr });

      if(this.currEarliestTime < returnedLatestTime) return;

      if(this.endOfSentiment) return;

      //api returned in descending order
      stockLine.reverse();
      var orgLength = daily.stockLine.length;
      daily.stockLine = stockLine.concat(daily.stockLine);
      ChartModel.model.stockLineLengthDiff = daily.stockLine.length - orgLength;
    } else {
      var latestPrice = res.data.latestPrice;
      var lastData    = self.model.daily.stockLine.slice(-1).pop();

      if(lastData && lastData.timestamp !== res.data.latestPrice.timestamp){
        self.model.daily.stockLine.push(res.data.latestPrice);
      }
    }
  },
  log: function(code, message) {
    if(PRODUCTION) return;
    var now = new Date();
    console.log('%c [' +  now.toTimeString() +'] ' + message, 'color: red; font-size: 1.5em;');
  },
  /* Helper method for randomizing API values for testing */
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
  }
};
