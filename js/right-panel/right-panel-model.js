var RightPanelModel = {
  model: {
    // ideally all models should store the array
    experts: {},
    stock: {},
    allPress: {},
    pressByTime: {},
    addPanelStocks: [],
    addPanelStockGroupName: [],
  },
  error: {
    expertError: true,
    expertHeadlineError: true,
    getAllPressError: true,
    getPressByTimeError: true,
    getAddPanelStocksError: false
  },
  api: {
    production:           'http://www.imaibo.net',
    staging:              'http://t3-www.imaibo.net',
    base:                 '/index.php?app=moodindex',
    expertData:           '&mod=ExpertMood&act=weiboList',
    expertHeadline:       '&mod=ExpertMood&act=moodindexParsing',
    likeComment:          '&mod=ExpertMood&act=weiboDig&weiboId=',
    allPress:             '&mod=PressMood&act=getPressAll',
    pressByTime:          '&mod=PressMood&act=getPressByTime',
    stockpickerStockData: '&mod=FocusStock&act=focusedStockList&init=1',
    searchResult:         '&mod=FocusStock&act=searchStock&key=',
    addStock:             '&mod=FocusStock&act=addFocusStock&stockId=',
    deleteStock:          '&mod=FocusStock&act=delFocusStock&stockId=',
    addPanelIndesStock:   '&mod=StockMarket&act=indexStocks',
    addPanelCggsStocks:   '&mod=StockMarket&act=cggsStocks',
    addPanelHotStocks:    '&mod=StockMarket&act=hotStocks',
    addPanelMarketStocks: '&mod=StockMarket&act=marketStocks',
    jsonp:                '&callback=?'
  },
  baseUrl: function() {
    return PRODUCTION ? this.api.production : this.api.staging;
  },
  /* Expert module */
  getExpertDataAsync: function() {
    var self = this;
    return $.Deferred(function(d) {
      self.getExpertData(d.resolve, d.reject);
    }).promise();
  },
  getExpertData: function(handler) {
    var self = this;

    $.getJSON(self.baseUrl() + self.api.base + self.api.expertData + self.api.jsonp, function(expertData) {
        _.extend(self.model.experts, expertData.data);

        self.model.experts.list.map(function(res){
          res.time = self.getTimestampStr(res.time);
        });
        self.expertErrorCheck(self.model.experts);
        handler(self.model.experts);
     });
  },
  getExpertHeadlineAsync: function() {
    var self = this;
    return $.Deferred(function(d) {
      self.getExpertHeadline(d.resolve, d.reject);
    }).promise();
  },
  getExpertHeadline: function(handler) {
    var self = this;
    $.getJSON(self.baseUrl() + self.api.base + self.api.expertHeadline + self.api.jsonp, function(res) {
      if (res.code !== 'undefined' && res.code === 0){
        self.error.expertHeadlineError = false;
        self.model.experts.headline = res.data;
        handler(res.data);
      } 
      else {
        handler(res.data);
      }
    });
  },
  likeCommentAsync: function(weiboId) {
    var self = this;
    return $.Deferred(function(d) {
      self.likeComment(weiboId, d.resolve, d.reject);
    }).promise();
  },
  likeComment: function(weiboId, successHandler, errorHandler) {
    var self = this;

    $.getJSON(self.baseUrl() + self.api.base + self.api.likeComment + weiboId + self.api.jsonp, function(res) {
      if (res.code === 0)
        successHandler(res.data.code);
      else
        errorHandler(res.data.code);
    });
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
      this.error.expertError = false;
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

    $.getJSON(self.baseUrl() + self.api.base + self.api.allPress + self.api.jsonp, function(res) {
      if (res.code !== 'undefined' && res.code === 0) { // if the page is not blank and the code is 0
        self.error.getAllPressError = false;
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

    $.getJSON(self.baseUrl() + self.api.base + self.api.pressByTime + self.api.jsonp, function(res) {
      if (res.code !== 'undefined' && res.code === 0) {
        self.error.getPressByTimeError = false;
        self.model.pressByTime = res.data.list; // pressByTime = array of data
      }

      handler(res.data.list);
    });
  },
  /* Stockpicker module */
  getStockData: function(successHandler, errorHandler) {
    var self = this;

    $.getJSON(self.baseUrl() + self.api.base + self.api.stockpickerStockData + self.api.jsonp, function(stockData) {
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

    $.getJSON(self.baseUrl() + self.api.base + self.api.searchResult + key + self.api.jsonp, function(searchResult) {
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
    $.getJSON(self.baseUrl() + self.api.base + self.api.addStock + stockId + self.api.jsonp, function(res) {
      successHandler(res);
    }).fail(function(){
      errorHandler({ isError: true, msg: 'AJAX request failed' });
    });
  },
  deleteStock: function(stockId, successHandler, errorHandler){
    var self = this;
    $.getJSON(self.baseUrl() + self.api.base + self.api.deleteStock + stockId + self.api.jsonp, function(res) {
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

    $.getJSON(self.baseUrl() + self.api.base + self.api.addPanelIndesStock + self.api.jsonp, function(res) {
      if (res.code !== 'undefined' && res.code === 0) {
        self.error.getAddPanelStocksError = self.error.getAddPanelStocksError || false;
        self.model.addPanelStocks[0] = res.data;
        handler(res.data);
      } 
      else {
        self.error.getAddPanelStocksError = self.error.getAddPanelStocksError || true; // if one is true, all is true
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

    $.getJSON(self.baseUrl() + self.api.base + self.api.addPanelCggsStocks + self.api.jsonp, function(res) {
      if (res.code !== 'undefined' && res.code === 0) {
        self.error.getAddPanelStocksError = self.error.getAddPanelStocksError || false;

        self.model.addPanelStocks[1] = res.data.mostHodingStock.stockList;
        self.model.addPanelStocks[2] = res.data.mostHodingStockBuy.stockList;
        self.model.addPanelStocks[3] = res.data.mostHodingStockSell.stockList;
        self.model.addPanelStocks[4] = res.data.iteholdStock.stockList;

        self.model.addPanelStockGroupName[0] = res.data.mostHodingStock.stockSortName;
        self.model.addPanelStockGroupName[1] = res.data.mostHodingStockBuy.stockSortName;
        self.model.addPanelStockGroupName[2] = res.data.mostHodingStockSell.stockSortName;
        self.model.addPanelStockGroupName[3] = res.data.iteholdStock.stockSortName;

        handler(res.data);
      } 
      else {
        self.error.getAddPanelStocksError = self.error.getAddPanelStocksError || true; // if one is true, all is true
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

    $.getJSON(self.baseUrl() + self.api.base + self.api.addPanelHotStocks + self.api.jsonp, function(res) {
      if (res.code !== 'undefined' && res.code === 0) {
        self.error.getAddPanelStocksError = self.error.getAddPanelStocksError || false;

        self.model.addPanelStocks[5] = res.data.hotSearchStock.stockList;
        self.model.addPanelStocks[6] = res.data.optionalHotStock.stockList;
        self.model.addPanelStocks[7] = res.data.hotStockDay.stockList;
        self.model.addPanelStocks[8] = res.data.hotStockWeek.stockList;

        self.model.addPanelStockGroupName[4] = res.data.hotSearchStock.stockSortName;
        self.model.addPanelStockGroupName[5] = res.data.optionalHotStock.stockSortName;
        self.model.addPanelStockGroupName[6] = res.data.hotStockDay.stockSortName;
        self.model.addPanelStockGroupName[7] = res.data.hotStockWeek.stockSortName;

        handler(res.data);
      } 
      else {
        self.error.getAddPanelStocksError = self.error.getAddPanelStocksError || true; // if one is true, all is true
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

    $.getJSON(self.baseUrl() + self.api.base + self.api.addPanelMarketStocks + self.api.jsonp, function(res) {
      if (res.code !== 'undefined' && res.code === 0) {
        self.error.getAddPanelStocksError = self.error.getAddPanelStocksError || false;

        self.model.addPanelStocks[9] = res.data.hotStockRise.stockList;
        self.model.addPanelStocks[10] = res.data.hotStockFall.stockList;
        self.model.addPanelStocks[11] = res.data.stockTrend.stockList;
        self.model.addPanelStocks[12] = res.data.stockDealTrend.stockList;

        self.model.addPanelStockGroupName[8] = res.data.hotStockRise.stockSortName;
        self.model.addPanelStockGroupName[9] = res.data.hotStockFall.stockSortName;
        self.model.addPanelStockGroupName[10] = res.data.stockTrend.stockSortName;
        self.model.addPanelStockGroupName[11] = res.data.stockDealTrend.stockSortName;

        handler(res.data);
      } 
      else {
        self.error.getAddPanelStocksError = self.error.getAddPanelStocksError || true; // if one is true, all is true
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
