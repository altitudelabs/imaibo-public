var RightPanelModel = {
  productionUrl: 'http://www.imaibo.net',
  baseUrl: 'http://t3-www.imaibo.net',
  model: {
    experts: {},
    stock: {},
    news: {}
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
  getExpertHeadline: function(successHandler, errorHandler){
    var self = this;
    $.getJSON((PRODUCTION? this.productionUrl : this.baseUrl) + '/index.php?app=moodindex&mod=ExpertMood&act=moodindexParsing&callback=?', function(res){
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
    $.getJSON((PRODUCTION? this.productionUrl : this.baseUrl) + '/index.php?app=moodindex&mod=ExpertMood&act=weiboList&callback=?', function(expertData) {
        _.extend(self.model.experts, expertData.data);

        self.model.experts.list.map(function(res){
          res.time = self.getTimestampStr(res.time);
        });

        successHandler(self.model.experts);
	   });
  },
  getNewsData: function(successHandler){
  },
  getStockData: function(){
    var self = this;
    $.getJSON((PRODUCTION? this.productionUrl : this.baseUrl) + '/index.php?app=moodindex&mod=FocusStock&act=focusedStockList&init=1&callback=?', function(stockData){
        self.model.stock = stockData.data;
        var stock = RightPanel.states.chooseStockView;
        if(self.model.stock.list.length != 0 ){
          RightPanel.populateView(stock.table, stock.template, self.model.stock.list);
        }else{
          $('#stock-table').append('<tr>暂时无法下载数据，请稍后再试</tr>');
        }
        if(self.model.stock.isLogin){
          $('#stock-login').remove();
          $('#suggestion').remove();
          $('#stockpicker-view > .wrapper:first-child').css('height', '0');
        }
        $('#stockpicker-view').css('opacity', '1');
        $('.panel-loader').remove();
    });
  },
  // Experts tab: Handles user like action
  likeComment: function(weiboId, successHandler, errorHandler){
    $.get((PRODUCTION? this.productionUrl : this.baseUrl) + '/index.php?app=moodindex&mod=ExpertMood&act=weiboDig&weiboId=' + weiboId)
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
