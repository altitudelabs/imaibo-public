var RightPanelModel = {
  productionUrl: 'http://www.imaibo.net',
  stagingUrl: 'http://t3-www.imaibo.net',
  baseUrl: function() {
    return PRODUCTION ? this.productionUrl : this.stagingUrl;
  },
  model: {
    // ideally all models should store the array
    experts: {},
    stock: {},
    allPress: {},
    pressByTime: {},
    addPanelStocks: [],
    expertError: true,
    expertHeadlineError: true,
    getAllPressError: true,
    getPressByTimeError: true,
    getAddPanelStocksError: false
  },
  /* Expert module */
  getExpertDataAsync: function() {
    var self = this;
    return $.Deferred(function(d) {
      self.getExpertData(d.resolve, d.reject);
    }).promise();
  },
  getExpertHeadlineAsync: function() {
    var self = this;
    return $.Deferred(function(d) {
      self.getExpertHeadline(d.resolve, d.reject);
    }).promise();
  },
  getExpertHeadline: function(handler) {
    var self = this;
    $.getJSON(self.baseUrl() + '/index.php?app=moodindex&mod=ExpertMood&act=moodindexParsing&callback=?', function(res) {
      if (res.code !== 'undefined' && res.code === 0){
        self.model.expertHeadlineError = false;
        self.model.experts.headline = res.data;
        handler(res.data);
      } 
      else {
        handler(res.data);
      }
    });
  },
  getExpertData: function(handler) {
    var self = this;

    $.getJSON(self.baseUrl() + '/index.php?app=moodindex&mod=ExpertMood&act=weiboList&callback=?', function(expertData) {
        _.extend(self.model.experts, expertData.data);

        self.model.experts.list.map(function(res){
          res.time = self.getTimestampStr(res.time);
        });
        self.expertErrorCheck(self.model.experts);
        handler(self.model.experts);
     });
  },
  // Experts tab: Handles user like action
  likeComment: function(weiboId, successHandler, errorHandler) {
    var self = this;

    $.getJSON(self.baseUrl() + '/index.php?app=moodindex&mod=ExpertMood&act=weiboDig&weiboId=' + weiboId + '&callback=?', function(res) {
      if (res.code === 0)
        successHandler(res.data.code);
      else
        errorHandler(res.data.code);
    });
  },
  likeCommentAsync: function(weiboId) {
    var self = this;
    return $.Deferred(function(d) {
      self.likeComment(weiboId, d.resolve, d.reject);
    }).promise();
  },
  log: function(code, message) {
    if(PRODUCTION) return;
    var now = new Date();
  },
  expertErrorCheck: function(model) {
    var api = '&act=weiboList';

    if(model === undefined) {
      this.log(1, api + ' (Experts)' + 'data variable is undefined');
    }
    else if(model.isLogin === undefined) {
      this.log(1, api + ' (Experts)' + 'data.isLogin variable is undefined');
    }
    else if(model.list === undefined) {
      this.log(1, api + ' (Experts)' + 'data.list variable is undefined');
    }
    else if(model.list.constructor !== Array) {
      this.log(1, api + ' (Experts)' + 'data.list is not an Array');
    }
    else if(model.list.length === 0) {
      this.log(1, api + ' (Experts)' + 'data.list array is empty');
    }
    else {
      this.model.expertError = false;
    }
  },
  /* News module */
  getAllPressAsync: function() {
    var self = this;

    return $.Deferred(function(d) {
      self.getAllPress(d.resolve);
    }).promise();
  },
  getAllPress: function(handler) {
    var self = this;

    $.getJSON(self.baseUrl() + '/index.php?app=moodindex&mod=PressMood&act=getPressAll&callback=?', function(res) {
      if (res.code !== 'undefined' && res.code === 0) { // if the page is not blank and the code is 0
        self.model.getAllPressError = false;
        self.model.allPress = res.data.list; // allPress = array of data
      } 
      
      handler(res.data.list);
    });
  },
  getPressByTimeAsync: function() {
    var self = this;

    return $.Deferred(function(d) {
      self.getPressByTime(d.resolve);
    }).promise();
  },
  getPressByTime: function(handler) {
    var self = this;

    $.getJSON(self.baseUrl() + '/index.php?app=moodindex&mod=PressMood&act=getPressByTime&callback=?', function(res) {
      if (res.code !== 'undefined' && res.code === 0) {
        self.model.getPressByTimeError = false;
        self.model.pressByTime = res.data.list; // pressByTime = array of data
      }

      handler(res.data.list);
    });
  },
  /* Stockpicker module */
  getStockData: function(successHandler, errorHandler) {
    var self = this;

    $.getJSON(self.baseUrl() + '/index.php?app=moodindex&mod=FocusStock&act=focusedStockList&init=1&callback=?', function(stockData) {
        self.model.stock = stockData.data; // stockData.data.list is an array

        if(stockData.code !== 'undefined' && stockData.code === 0) {
          successHandler(self.model);
        }
        else {
          errorHandler(self.model);
        }
    });
  },
  getSearchResult: function(key, successHandler, failHandler) {
    if (!key) {
      failHandler(1); // 0 = not found, 1 = no keywords, others = other errors
      return;
    }

    var self = this;

    $.getJSON(self.baseUrl() + '/index.php?app=moodindex&mod=FocusStock&act=searchStock&key=' + key + '&callback=?', function(searchResult) {
        if (searchResult.code !== 'undefined' && searchResult.code === 0) {

          if (searchResult.data.count != 0)
            successHandler(searchResult.data.data);// searchResult.data.data => array of results
          else
            failHandler(0); 
        }
        else {
          failHandler(2);
        }
    });
  },
  addStock: function(stockId, successHandler, errorHandler){
    var self = this;
    $.getJSON(self.baseUrl() + '/index.php?app=moodindex&mod=FocusStock&act=addFocusStock&stockId=' + stockId + '&callback=?', function(res){
      successHandler(res);
    }).fail(function(){
      errorHandler({ isError: true, msg: 'AJAX request failed' });
    });
  },
  deleteStock: function(stockId, successHandler, errorHandler){
    var self = this;
    $.getJSON(self.baseUrl() + '/index.php?app=moodindex&mod=FocusStock&act=delFocusStock&stockId=' + stockId + '&callback=?', function(res){
      successHandler(res);
    }).fail(function(){
      errorHandler({ isError: true, msg: 'AJAX request failed' });
    });
  },
  /* Stockpicker Add Panel Data Retrieval */
  getIndexStocksAsync: function() {
    var self = this;

    return $.Deferred(function(d) {
      self.getIndexStocks(d.resolve, d.reject);
    }).promise();
  },
  getIndexStocks: function(handler) {
    var self = this;

    $.getJSON(self.baseUrl() + '/index.php?app=moodindex&mod=StockMarket&act=indexStocks&callback=?', function(res) {
      if (res.code !== 'undefined' && res.code === 0) {
        self.model.getAddPanelStocksError = self.model.getAddPanelStocksError || false;
        self.model.addPanelStocks[0] = res.data;
        handler(res.data);
      } 
      else {
        self.model.getAddPanelStocksError = self.model.getAddPanelStocksError || true; // if one is true, all is true
        handler(res.data);
      }
    });
  },
  getCggsStocksAsync: function() {
    var self = this;

    return $.Deferred(function(d) {
      self.getCggsStocks(d.resolve, d.reject);
    }).promise();
  },
  getCggsStocks: function(handler) {
    var self = this;

    $.getJSON(self.baseUrl() + '/index.php?app=moodindex&mod=StockMarket&act=cggsStocks&callback=?', function(res) {
      if (res.code !== 'undefined' && res.code === 0) {
        self.model.getAddPanelStocksError = self.model.getAddPanelStocksError || false;
        self.model.addPanelStocks[1] = res.data.mostHodingStock;
        self.model.addPanelStocks[2] = res.data.mostHodingStockBuy;
        self.model.addPanelStocks[3] = res.data.mostHodingStockSell;
        self.model.addPanelStocks[4] = res.data.iteholdStock;
        handler(res.data);
      } 
      else {
        self.model.getAddPanelStocksError = self.model.getAddPanelStocksError || true; // if one is true, all is true
        handler(res.data);
      }
    });
  },
  getHotStocksAsync: function() {
    var self = this;

    return $.Deferred(function(d) {
      self.getHotStocks(d.resolve, d.reject);
    }).promise();
  },
  getHotStocks: function(handler) {
    var self = this;

    $.getJSON(self.baseUrl() + '/index.php?app=moodindex&mod=StockMarket&act=hotStocks&callback=?', function(res) {
      if (res.code !== 'undefined' && res.code === 0) {
        self.model.getAddPanelStocksError = self.model.getAddPanelStocksError || false;
        self.model.addPanelStocks[5] = res.data.hotSearchStock;
        self.model.addPanelStocks[6] = res.data.optionalHotStock;
        self.model.addPanelStocks[7] = res.data.hotStockDay;
        self.model.addPanelStocks[8] = res.data.hotStockWeek;
        handler(res.data);
      } 
      else {
        self.model.getAddPanelStocksError = self.model.getAddPanelStocksError || true; // if one is true, all is true
        handler(res.data);
      }
    });
  },
  getMarketStocksAsync: function() {
    var self = this;

    return $.Deferred(function(d) {
      self.getMarketStocks(d.resolve, d.reject);
    }).promise();
  },
  getMarketStocks: function(handler) {
    var self = this;

    $.getJSON(self.baseUrl() + '/index.php?app=moodindex&mod=StockMarket&act=marketStocks&callback=?', function(res) {
      if (res.code !== 'undefined' && res.code === 0) {
        self.model.getAddPanelStocksError = self.model.getAddPanelStocksError || false;
        self.model.addPanelStocks[9] = res.data.hotStockRise;
        self.model.addPanelStocks[10] = res.data.hotStockFall;
        self.model.addPanelStocks[11] = res.data.stockTrend;
        self.model.addPanelStocks[12] = res.data.stockDealTrend;
        handler(res.data);
      } 
      else {
        self.model.getAddPanelStocksError = self.model.getAddPanelStocksError || true; // if one is true, all is true
        handler(res.data);
      }
    });
  },
  /* Others */
  get: function(){
    var num_JSON_loaded = 0;
    var self = this;
    this.getExpertData();
    this.getStockData();
  },
  getTimestampStr: function(timestamp){
    var d = new Date(timestamp*1000);
    var month = d.getMonth() < 9 ? '0' + (d.getMonth()+1).toString(): (d.getMonth()+1).toString();
    var date = d.getDate();
    var hour = d.getHours() < 10 ? '0' + d.getHours().toString(): d.getHours().toString();
    var min = d.getMinutes() < 10 ? '0' + d.getMinutes().toString(): d.getMinutes().toString();
    return month + '-' + date + '   ' + hour + ':' + min;
  }
};
