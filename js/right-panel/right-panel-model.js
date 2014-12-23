var RightPanelModel = {
  model: {
    experts: {},
    stock: {},
    news: {}
  },
  getExpertData: function(callback){
    var self = this;
     $.getJSON('http://t3-www.imaibo.net/index.php?app=moodindex&mod=ExpertMood&act=weiboList&callback=?', function(expertData) {
        self.model.experts = expertData.data;

        self.model.experts.list.map(function(res){
          res.time = self.getTimestampStr(res.time);
        });

        // TODO: Update headline info with actual API
        self.model.experts.headline = {
          time: self.getTimestampStr(1000000),
          content: "午盘开始下跌，尾盘在MAC尾盘在背离下小幅反弹。"
        }

        callback(self.model.experts);
	   });
  },
  getNewsData: function(callback){
  },
  getStockData: function(){
    var self = this;
    $.getJSON('http://t3-www.imaibo.net/index.php?app=moodindex&mod=FocusStock&act=focusedStockList&init=1&callback=?', function(stockData){
        self.model.stock = stockData.data;
        var stock = RightPanel.states.chooseStockView;
        RightPanel.populateView(stock.table, stock.template, self.model.stock.list);
        if(self.model.stock.isLogin){
          $('#stock-login').remove();
          $('#suggestion').remove();
          $('#stockpicker-view > .wrapper:first-child').css('height', '0');
        }
        $('.panel-loader').remove();
        $('#stockpicker-view').css('opacity', '1');
    });
  },
  // Experts tab: Handles user like action
  likeComment: function(weiboId, callback){
    $.get('http://t3-www.imaibo.net/index.php?app=moodindex&mod=ExpertMood&act=weiboDig&weiboId=' + weiboId, function(res){
      console.log(res);
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
