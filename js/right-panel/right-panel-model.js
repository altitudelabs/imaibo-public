var RightPanelModel = {
  model: {
    experts: {},
    stock:  {},
    news:   {},
  },
  getExpertData: function(){
    var self = this;
     $.getJSON('http://t3-www.imaibo.net/index.php?app=moodindex&mod=ExpertMood&act=weiboList&callback=?', function(expertData) {
        self.model.experts = expertData.data;
        var experts = RightPanel.states.expertsView;
        self.model.experts.list.map(function(res){
          //Date reference: http://www.w3schools.com/jsref/jsref_obj_date.asp
          var d = new Date(res.time*1000);
          var month = d.getMonth() < 9? '0' + (d.getMonth()+1).toString(): (d.getMonth()+1).toString();
          var date = d.getDate();
          var hour = d.getHours() < 10? '0' + d.getHours().toString(): d.getHours().toString();
          var min = d.getMinutes() < 10? '0' + d.getMinutes().toString(): d.getMinutes().toString();
          res.time = month + '-' + date + '   ' + hour + ':' + min;
        });
        RightPanel.populateView(experts.el, experts.template, self.model.experts.list);
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
  get: function(){
    var num_JSON_loaded = 0;
    var self = this;
    this.getExpertData();
    this.getStockData();
  }
};
