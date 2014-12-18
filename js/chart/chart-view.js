var ChartView = {
  x: function(){
    var self = this;
     return d3.scale.ordinal()
    .domain(self.data.daily.stockLine.map(function(x) { return x.rdate; }))
    .rangeBands([ margin.left, self.defaults.width-margin.right]); //inversed the x axis because api came in descending order
  },
  /*
   * xInverse
   * =================
   * - gets the data based on cursor position
   * Arguments:
   * - xPos: Position of cursor
   * - x: x range, domain object of d3
   */
  xInverse: function(xPos, x){
    var leftEdges = x.range(), // starting position of each column bar
    width = x.rangeBand(), //rangeBand = width of each column bar
    j;

    //while mouse's x position is greater than the right most edge of the column
    //increment j

    //if mouse is in the first column, return 0
    //if mouse is in the last column,

    for (j = 0; xPos > (leftEdges[j] + width); j++) {}
    return j;
  },
  defaults: {
    width: 0,
  },
  init: function(){
    // set default width
    this.defaults.width = $('#content').width();
    $('.loader').css('width', this.defaults.width);
    $('.loader').css('height', '441px');

    // set up toolbar
    Toolbar.init();

    var self = this;

    function draw(date){
      //should handle this in model.js instead
      ChartModel.getIndexData(function(data) {
        ChartModel.getSentimentData(date, function(data){
          self.data.sentiment = data.sentiment;
          SentimentChart.build();
          self.data.info = data.info;
          self.data.daily = data.daily;
          self.data.minute = data.minute;

          IndexChart.init();
          RsiChart.init();
          MacdChart.build();
          Dashboard.render(self.data.info);
          Toolbar.render(self.data.daily);
        });
      });
    }

    var today = new Date();
    today = today.getFullYear().toString()  +
      (today.getMonth()+1).toString() +
      today.getDate().toString();

    draw(today);


    $(window).on('resize', function() { self.rebuild(); });
    $('#chart-view').on('resize', function(){ self.rebuild(); });
    $('#rsi > .wrapper > .buttons > .close').on('click', function() {
      $('#rsi').slideUp(500);
      $('#rsi-checkbox').attr('checked', false);
    });

    $('#macd > .wrapper > .buttons > .close').on('click', function() {
      $('#macd').slideUp(500);
      $('#macd-checkbox').attr('checked', false);
    });
  },
  rebuild: function () {
    this.defaults.width = $('#content').width();
    IndexChart.init();
    SentimentChart.build();
    RsiChart.init();
    MacdChart.build();
  },
  data: {
    daily:{},
    sentiment: {}
  },
};

