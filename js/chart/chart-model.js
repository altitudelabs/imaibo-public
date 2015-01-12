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
    jsonp:          '&callback=?'
  },
  baseUrl: function(){
    return PRODUCTION ? this.api.production : this.api.staging;
  },
  getIndexDataAsync: function(date, initial){
    var self = this;
    return $.Deferred(function(d){
      self.getIndexData(date, initial, d.resolve, d.reject);
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
  /*
   * func getIndexData()
   * ===================
   * Arguments:
   * - date: date in yyyymmdd format
   * - initial: boolean, indicates if we are only fetching new data
   * - handler: callback function
  */
  getIndexData: function(date, initial, handler){
    var self = this;
    var api  = self.baseUrl() + self.api.base + self.api.indexData  + '&dailyLineSdate=' + date;
        api += initial ? self.api.daily : '';
        api += self.api.latest + '&info=1&trading=1'
        api += self.api.jsonp;

    $.getJSON(api, function(res) {
      self.errorCheck(self.api.indexData, res);
      if(res.code !== 'undefined' && res.code === 0 && !self.model.indexError) {
        self.model.info   = res.data.info;
        self.model.minute = res.data.minute;

        // Process data
        self.processIndexData(res, initial);

        handler({ isError: self.model.indexError });
      } else {
        handler({ isError: self.model.indexError });
      }
    }).fail(function(){
      handler({ isError: self.model.indexError });
    });
  },
  getSentimentData: function(handler){
    var self = this;
    var api = self.baseUrl() + self.api.base + self.api.sentimentData + self.api.jsonp;
    $.getJSON(api, function(res) {
      self.errorCheck(self.api.sentimentData, res);
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
    var api = self.baseUrl() + self.api.base + self.api.sentimentData + self.api.date + date + self.api.jsonp;
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
      } else if (!isObject(json.data)){
        this.log(0, api + ' "data" variable is not an object');
      } else if (json.data.indexList === undefined){
        this.log(0, api + ' data.indexList does not exist');
      } else if (json.data.indexList.constructor !== Array){
        this.log(0, api + ' data.indexList is not an array');
      } else if (json.data.indexList.length === 0){
        this.log(0, api + ' array data.indexList is empty');
      } else if (json.data.indexList[0].price === undefined){
        this.log(0, api + ' data.indexList does not have variable "price"');
      } else if (json.data.indexList[0].volumn === undefined){
        this.log(0, api + ' data.indexList does not have variable "volumn"');
      } else if (json.data.indexList[0].timestamp === undefined){
        this.log(0, api + ' data.indexList does not have variable "timestamp"');
      } else if (json.data.indexList[0].rdate === undefined){
        this.log(0, api + ' data.indexList does not have variable "rdate"');
      } else if (json.data.moodindexList === undefined){
        this.log(0, api + ' data.moodindexList does not exist');
      } else {
        this.model.sentimentError = false;
      }
    }

    if(api === this.api.indexData){
      if(json.data === undefined){
        this.log(0, api + ' has no \'data\'');
      } else if(!isObject(json.data)){
        this.log(0, api + ' "data" variable is not an object');
      } else if(json.data.info === undefined){
        this.log(0, api + ' data.info does not exist');
      } else if(json.data.info.stockIndexInfo === undefined){
        this.log(0, api + ' data.info.stockIndexInfo does not exist');
      } else if(json.data.info.moodindexInfo === undefined){
        this.log(0, api + ' data.info.moodindexInfo does not exist');
      } else if(json.data.info.tradingSign === undefined){
        this.log(0, api + ' data.info.tradingSign does not exist');
      } else if(json.data.daily === undefined){
        this.log(0, api + ' data.daily does not exist');
      } else {
        this.model.indexError = false;
      }
    }
  },
  processIndexData: function(res, initial){
    var self = this;
    if(initial){
      self.model.daily = res.data.daily;

      // API returns data in descending order
      if(self.model.daily.stockLine[0].timestamp != res.data.latestPrice.timestamp) {
        self.model.daily.stockLine.unshift(res.data.latestPrice);
      }
      self.model.daily.stockLine.reverse();
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
