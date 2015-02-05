var ChartModel = {
  model: {
    info:         {},
    index:        {},
    minute:       {},
    sentiment:    {},
    indexError:   true,
    sentimentError: true,
    dataReceived: 0
  },
  api: {
    // production:     'http://www.imaibo.net',
    // staging:        'http://t3-www.imaibo.net',
    base:           '/index.php?app=moodindex&mod=IndexShow',
    indexData:      '&act=main',
    dailyIndexData: '&daily=1',
    dailyUpdate:    '&latest=1',
    weeklyIndexData:'&act=getStkWeeklyLineAjax',
    weeklyUpdate:   '&act=getStkWeeklySnap',
    sentimentData:  '&act=moodindexLine',
    sentimentUpdate:'&act=refreshMoodindexLine',
    // sentimentUpdate:''
    // http://t3-www.imaibo.net/index.php?app=moodindex&mod=IndexShow&act=moodindexLine&reqDate=20150202
    minute:         '&minute=1',
    date:           '&reqDate=',
    dailyLineSdate: '&dailyLineSdate=',
    weeklyLineSdate:'&weeklyLineSdate=',
    jsonp:          '&callback=?'
  },
  currEarliestTime: 0,
  endOfSentiment: false,
  baseUrl: function(){
    return PRODUCTION ? 'http://' + location.hostname : 'http://t3-www.imaibo.net';
    // return PRODUCTION ? this.api.production : this.api.staging;
  },
  getIndexDataAsync: function(options, cb){
    var self = this;
    return $.Deferred(function(d){
      self.getIndexData(options, d.resolve, cb);
    }).promise();
  },
  getSentimentDataAsync: function(options, cb){
    var self = this;
    return $.Deferred(function(d){
      self.getSentimentData(options, d.resolve, cb);
    }).promise();
  },
  // updateSentimentDataAsync: function(date){
  //   var self = this;
  //   return $.Deferred(function(d){
  //     self.updateSentimentData(date, d.resolve, d.reject);
  //   }).promise();
  // },
  apiBuilder: function(requestChart, options) {
    var api = this.baseUrl() + this.api.base;
    // var today = new Date().yyyymmdd();
    if(requestChart === 'index') {
      api += (options.weekly&&!options.weeklyUpdate ? this.api.weeklyIndexData : '');
      api += (options.weekly&&options.weeklyUpdate ? this.api.weeklyUpdate : '');
      api += (options.daily ? this.api.indexData : '');
      api += (options.daily&&!options.dailyUpdate ? this.api.dailyIndexData : '');
      api += (options.daily&&options.dailyUpdate ? this.api.dailyUpdate : '');
      api += (options.daily&&options.initial ? this.api.dailyUpdate : '');
      api += ((options.daily&&options.date) ? this.api.dailyLineSdate + options.date : '');
      api += ((options.daily&&options.date) ? this.api.indexData + this.api.dailyUpdate : '');
      api += ((options.weekly&&options.date) ? this.api.weeklyLineSdate + options.date : '');
      api += '&info=1&trading=1';
    }else{
      api += (options.sentimentUpdate ? this.api.sentimentUpdate : this.api.sentimentData);
      // api += (options.sentimentUpdate ? this.api.sentimentUpdate : '');
    }
    api += this.api.jsonp;
    return api;
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
  getIndexData: function(options, handler, cb){
    var self = this;
    var indexApi = self.apiBuilder('index' , options);
    $.getJSON(indexApi, function(res) {
      self.errorCheckIndex(res, options);
      if(res.code !== 'undefined' && res.code === 0 && !self.model.indexError){
        cb(res.data, handler);
      }
    }).fail(function(){
      handler({ isError: self.model.indexError });
    });
  },
  getSentimentData: function(options, handler, cb){
    var self = this;
    var sentimentApi = self.apiBuilder('sentiment' , options);
    $.getJSON(sentimentApi, function(res) {
      self.errorCheckSentiment(res, options);
      if(res.code !== 'undefined' && res.code === 0 && !self.model.sentimentError) {
        cb(res.data, handler);
      }
      handler({ isError: self.model.sentimentError });
    }).fail(function(){
      handler({ isError: self.model.sentimentError });
    });
  },
  getInitialData: function () {
    var self = this;
    var indexOptions = {
      daily: true,
      initial: true,
      info: true
    };
    var sentimentOptions = {};
    var indexCallback = function (data, handler) {
      var newData = data.daily ? data.daily.stockLine : [];
      for (var key in data) {
        if (key === 'daily') {
          if (data.latestPrice) {
            newData.unshift(data.latestPrice);
          }
          self.model.index.stockLine = newData.reverse();
        } else {
          self.model[key] = data[key];
        }
      }
      self.model.index.stockLine = self.model.index.stockLine.filter(function (d) { 
        return (d.rdate > 20130413);
      });
      handler(self.model.indexError);
    };
    var sentimentCallback = function (data, handler) {
      // data.indexList = [];
      // data.moodindexList = [];
      // console.log(data);
      self.model.sentiment = data;
      handler(self.model.sentimentError);
    };
    return $.when(ChartModel.getIndexDataAsync(indexOptions, indexCallback), ChartModel.getSentimentDataAsync(sentimentOptions, sentimentCallback));
  },
  updateAllData: function (indexOption, sentimentOption) {
    var self = this;
    return $.when(ChartModel.getIndexDataAsync(indexOption, self.processUpdateIndexData), ChartModel.getSentimentDataAsync(sentimentOption, self.processUpdateSentimentData));
  },
  updateIndexData: function (option) {
    var self = this;
    return $.when(ChartModel.getIndexDataAsync(option, self.processUpdateIndexData));
  },
  processUpdateIndexData: function (data, handler) {
    var self = ChartModel;
    var newData;
    var rdates = [];
    if (data.daily) { 
      newData = data.daily.stockLine.reverse();
    } else if (data.weeklyKLine) {
      newData = data.weeklyKLine.reverse();
    }
    self.model.index.stockLine = self.model.index.stockLine.concat(newData)
    .sort(function (a, b) {
      var order = a.rdate - b.rdate;
      if (order === 0) {
        order = a.timestamp - b.timestamp;
      }
      return order;
    })
    .filter(function (d) {
      if (rdates.indexOf(d.rdate) === -1 && d.rdate > 20130412) {
        rdates.push(d.rdate);
        return true;
      }
    });
    if (!!data.latestPrice && data.daily) {
      if (data.latestPrice.rdate > self.model.index.stockLine[self.model.index.stockLine.length-1].rdate) {
        self.model.index.stockLine.push(data.latestPrice);
      } else {
      }
    }
    ChartView.updating = false;
    handler(self.model.indexError);
  },
  refreshIndexData: function (option) {
    var self = this;
    var callback = function (data, handler) {
      if (data.daily) { 
        self.model.index.stockLine = data.daily.stockLine.reverse();
      } else if (data.weeklyKLine) {
        self.model.index.stockLine = data.weeklyKLine.reverse();
      }
      self.model.index.stockLine = self.model.index.stockLine.filter(function (d) { 
        return (d.rdate > 20130413);
      });
      
      handler(self.model.indexError);
    };
    return $.when(ChartModel.getIndexDataAsync(option, callback));
  },
  // updateSentimentData: function(option){
  //   var self = this;
  //   return $.when(ChartModel.getSentimentDataAsync(option, self.processUpdateSentimentData));
  // },
  processUpdateSentimentData: function (data, handler) {
    //indexList
    var oldIndexList = ChartModel.model.sentiment.indexList;
    var updateIndexListIndex;
    var newIndexListTimeStamp = data.indexList[0] ? data.indexList[0].timestamp : 0;
    for (var i = 0; i < oldIndexList.length; i++) {

      if (oldIndexList[i].timestamp - newIndexListTimeStamp === 0) {
        updateIndexListIndex = i;
      }
    }
    if (updateIndexListIndex !== oldIndexList.length - 1) {
      oldIndexList.splice(updateIndexListIndex);
      oldIndexList = oldIndexList.concat(data.indexList);
    }
    ChartModel.model.sentiment.indexList = oldIndexList;

    //moodindexList
    var oldMoodIndexList = ChartModel.model.sentiment.moodindexList;
    var newMoodIndexListTimeStamp = data.moodindexList[0].timestamp;
    var updateMoodIndexListIndex;
    for (var i = 0; i < oldMoodIndexList.length; i++) {
      if (oldMoodIndexList[i].timestamp - newMoodIndexListTimeStamp === 0) {
        updateMoodIndexListIndex = i;
      }
    }
    oldMoodIndexList.splice(updateMoodIndexListIndex);
    oldMoodIndexList = oldIndexList.concat(data.moodindexList);
    ChartModel.model.sentiment.moodindexList = oldMoodIndexList;


    handler(ChartModel.model.sentimentError);
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
  errorCheckSentiment: function(res, options){
    if (PRODUCTION) { return; }
    if(res.data === undefined){
      this.log(0, 'Sentiment API has no \'data\'');
    } else if (!this.isObject(res.data) || this.isEmptyObject(res.data)){
      this.log(0, 'Sentiment API "data" variable is not an object or is empty');
    } else if (res.data.indexList === undefined){
      this.log(0, 'Sentiment API data.indexList does not exist');
    } else if (res.data.indexList[0].price === undefined){
      this.log(0, 'Sentiment API data.indexList does not have variable "price"');
    } else if (res.data.indexList[0].volumn === undefined){
      this.log(0, 'Sentiment API data.indexList does not have variable "volumn"');
    } else if (res.data.indexList[0].timestamp === undefined){
      this.log(0, 'Sentiment API data.indexList does not have variable "timestamp"');
    } else if (res.data.indexList[0].rdate === undefined){
      this.log(0, 'Sentiment API data.indexList does not have variable "rdate"');
    } else if (res.data.moodindexList === undefined){
      this.log(0, 'Sentiment API data.moodindexList does not exist');
    } else {
      this.model.sentimentError = false;
    }
  },
  errorCheckIndex: function(res, options){
    if (PRODUCTION) { return ;}
    this.model.indexError = true;
    var type;
    if (!!options.daily) {
      type = 'daily';
    } else if (!!options.weekly) {
      type = 'weeklyKLine';
    }
    if(res.data === undefined){
      this.log(0, 'Index API has no \'data\'');
    } else if(!this.isObject(res.data) || this.isEmptyObject(res.data)){
      this.log(0, 'Index API "data" variable is not an object or is empty');
    } else if(options.info && (res.data.info === undefined || this.isEmptyObject(res.data.info))){
      this.log(0, 'Index API data.info does not exist');
    } else if(options.info && (res.data.info.stockIndexInfo === undefined || this.isEmptyObject(res.data.info.stockIndexInfo))){
      this.log(0, 'Index API data.info.stockIndexInfo does not exist');
    } else if(options.info && (res.data.info.moodindexInfo === undefined || this.isEmptyObject(res.data.info.moodindexInfo))){
      this.log(0, 'Index API data.info.moodindexInfo does not exist');
    } else if(options.info && (res.data.info.tradingSign === undefined || this.isEmptyObject(res.data.info.tradingSign))){
      this.log(0, 'Index API data.info.tradingSign does not exist');
    } else if(!!type && (res.data[type] === undefined || res.data[type] === null || res.data[type].length === 0)){
      this.log(0, 'Index API data ' + [type] + ' does not exist');
    } else if(type==='daily' && !options.dailyUpdate && (res.data[type].stockLine === undefined || res.data[type].stockLine.length === 0)){
      this.log(0, 'stockLine Data does not exist');
    } else {
      this.model.indexError = false;
    }
  },
  log: function(code, message) {
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
