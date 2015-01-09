var RightPanelModel = {
  productionUrl: 'http://www.imaibo.net',
  stagingUrl: 'http://t3-www.imaibo.net',
  baseUrl: function(){
    return PRODUCTION ? this.productionUrl : this.stagingUrl;
  },
  model: {
    experts: {},
    stock: {},
    news: {},
    expertError: true,
  },
  getExpertDataAsync: function(){
    var self = this;
    return $.Deferred(function(d){
      self.getExpertData(d.resolve, d.reject);
    }).promise();
  },
  getExpertHeadlineAsync: function(){
    var self = this;
    return $.Deferred(function(d){
      self.getExpertHeadline(d.resolve, d.reject);
    }).promise();
  },
  likeCommentAsync: function(weiboId){
    var self = this;
    return $.Deferred(function(d){
      self.likeComment(weiboId, d.resolve, d.reject);
    }).promise();
  },
  log: function(code, message) {
    if(PRODUCTION) return;
    var now = new Date();

    console.log('%c [' +  now.toTimeString() +'] ' + message, 'color: red; font-size: 1.5em;');
  },
  expertErrorCheck: function(model) {
    var api = '&act=weiboList';
    if(model === undefined){
      this.log(1, api + ' (Experts)' + 'data variable is undefined');
    }else if(model.isLogin === undefined){
      this.log(1, api + ' (Experts)' + 'data.isLogin variable is undefined');
    }else if(model.list === undefined){
      this.log(1, api + ' (Experts)' + 'data.list variable is undefined');
    }else if(model.list.constructor !== Array){
      this.log(1, api + ' (Experts)' + 'data.list is not an Array');
    }else if(model.list.length === 0) {
      this.log(1, api + ' (Experts)' + 'data.list array is empty');
    }else {
      this.model.expertError = false;
    }
  },
  getExpertHeadline: function(successHandler, errorHandler){
    var self = this;
    $.getJSON(self.baseUrl() + '/index.php?app=moodindex&mod=ExpertMood&act=moodindexParsing&callback=?', function(res){
      if (res.code === 0){
        self.model.experts.headline = res.data;
        successHandler(res.data);
      } else {
        errorHandler(res.data);
      }
    })
  },
  getExpertData: function(successHandler){
    var self = this;
    $.getJSON(self.baseUrl() + '/index.php?app=moodindex&mod=ExpertMood&act=weiboList&callback=?', function(expertData) {
        _.extend(self.model.experts, expertData.data);

        self.model.experts.list.map(function(res){
          res.time = self.getTimestampStr(res.time);
        });
        self.expertErrorCheck(self.model.experts);
        successHandler(self.model.experts);
	   });
  },
  getNewsData: function(successHandler, errorHandler){
  },
  getStockData: function(successHandler, errorHandler){
    var self = this;
    $.getJSON(self.baseUrl() + '/index.php?app=moodindex&mod=FocusStock&act=focusedStockList&init=1&callback=?', function(stockData){
        self.model.stock = stockData.data;
        if(self.model.stock.list.length != 0 ){
          successHandler(self.model);
        }else{
          errorHandler(self.model);
        }
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
