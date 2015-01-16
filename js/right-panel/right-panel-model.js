var RightPanelModel = {
  productionUrl: 'http://www.imaibo.net',
  stagingUrl: 'http://t3-www.imaibo.net',
  baseUrl: function() {
    return PRODUCTION ? this.productionUrl : this.stagingUrl;
  },
  model: {
    experts: {},
    stock: {},
    allPress: {},
    pressByTime: {},
    expertError: true,
    expertHeadlineError: true,
    getAllPressError: true,
    getPressByTimeError: true
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
  likeComment: function(weiboId, successHandler, errorHandler){
    $.get(self.baseUrl() + '/index.php?app=moodindex&mod=ExpertMood&act=weiboDig&weiboId=' + weiboId)
    .done(function(res){
      if (res.code === 0){
        successHandler(res);
      } else {
        errorHandler(res);
      }
    }).fail(function(res){
      errorHandler(res);
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
      self.getAllPress(d.resolve, d.reject);
    }).promise();
  },
  getAllPress: function(handler) {
    var self = this;

    $.getJSON(self.baseUrl() + '/index.php?app=moodindex&mod=PressMood&act=getPressAll&callback=?', function(res) {
      if (res.code !== 'undefined' && res.code === 0) {
        self.model.getAllPressError = false;
        self.model.allPress = res.data.list; // allPress = array of data
        handler(res.data.list);
      } 
      else {
        handler(res.data.list);
      }
    });
  },
  getPressByTimeAsync: function() {
    var self = this;

    return $.Deferred(function(d) {
      self.getPressByTime(d.resolve, d.reject);
    }).promise();
  },
  getPressByTime: function(handler) {
    var self = this;

    $.getJSON(self.baseUrl() + '/index.php?app=moodindex&mod=PressMood&act=getPressByTime&callback=?', function(res) {
      if (res.code !== 'undefined' && res.code === 0) {
        self.model.getPressByTimeError = false;
        self.model.pressByTime = res.data.list; // allPress = array of data
        handler(res.data.list);
      } 
      else {
        handler(res.data.list);
      }
    });
  },
  /* Stockpicker module */
  getStockData: function(successHandler, errorHandler) {
    var self = this;

    $.getJSON(self.baseUrl() + '/index.php?app=moodindex&mod=FocusStock&act=focusedStockList&init=1&callback=?', function(stockData) {
        self.model.stock = stockData.data;
        if(self.model.stock.list.length != 0 ) {
          successHandler(self.model);
        }
        else {
          errorHandler(self.model);
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
