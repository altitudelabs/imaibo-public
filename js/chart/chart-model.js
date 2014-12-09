var ChartModel = {
  model: {},
  get: function(callback){
    var self = this;
    $.getJSON('http://t3-www.imaibo.net/index.php?app=moodindex&mod=IndexShow&act=main&info=1&trading=1&daily=1&callback=?', function(dailyData) {
	    $.getJSON('http://t3-www.imaibo.net/index.php?app=moodindex&mod=IndexShow&act=moodindexLine&callback=?', function(sentimentData) {
	      var model = {};
        model.info = dailyData.data.info;
	      model.daily = dailyData.data.daily;
        model.minute = dailyData.data.minute;
	      model.sentiment = sentimentData.data;
	      self.model = model;
	      callback(self.model);
	    });
    });
  },
  addIndices: function(){

  },
  processRSI: function(){
    // TODO
  },
  processMA: function(){
    // TODO
  },
  calcMovingAvg: function(n, precision){
    var sentiment = this.model.sentiment.indexList;
    var price = 0;
    for (var i = sentiment.length-n; i < sentiment.length; i++){
      price += parseFloat(sentiment[i].price);
    }
    return (price/n).toFixed(precision);
  },

  // TODO: For reference only
  // MACD: http://stackoverflow.com/questions/11963352/plot-rolling-moving-average-in-d3-js
  // RSI: http://stackoverflow.com/questions/22626238/calculate-rsirelative-strength-index-using-some-programming-language-js-c
  movingAvg: function(n) {
    return function (points) {
      points = points.map(function(each, index, array) {
        var to = index + n - 1;
        var subSeq, sum;
        if (to < points.length) {
            subSeq = array.slice(index, to + 1);
            sum = subSeq.reduce(function(a,b) {
                return [a[0] + b[0], a[1] + b[1]];
            });
            return sum.map(function(each) { return each / n; });
        }
        return undefined;
      });
      points = points.filter(function(each) { return typeof each !== 'undefined' })
      // Note that one could re-interpolate the points
      // to form a basis curve (I think...)
      return points.join("L");
    }
  }
};
