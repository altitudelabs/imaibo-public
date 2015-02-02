var newsView = {
	updateAllPress: function(model) {

    // ADDING DATE OBJECT IN BETWEEN NEWS OF DIFFERENT DATE
    var currentDate = 'NONE';
    for (var i = 0; i < model.allPress.length; i++) {
      if (model.allPress[i].rdate !== currentDate) {
        currentDate = model.allPress[i].rdate;
        var dateObject = { date: currentDate };
        model.allPress.splice(i, 0, dateObject);
      }
    }

    // CREATE NEWS BLOCKS
    var template = '<div class="content">{{title}}</div><div class="sentiment-news"><span class="label">心情分数</span><span class="mood-change">{{newsMood}}</span></div><div class="time-and-source"><div class="time">{{time}}</div><div class="source">来自{{source}}</div></div>';

    var newsBlocks = d3.select('#all-press')
                       .selectAll('div')
                       .data(model.allPress);

    // Enter loop
    newsBlocks.enter().append('div')
                      .attr("class", function(d) {
                        if (d.date) // if the date object exists
                          return 'calendar-and-date';
                        if (d.newsMood == 0)
                          return "news-block neutral";
                        if (d.sent === '+')
                          return "news-block rise";
                        else
                          return "news-block fall";
                      })
                      .html(function(d) {
                        if (d.date) { // if the date object exists
                          return '<span class="calendar"></span><span class="date">' + d.date + '</span>';
                        }
                        else {
                          return template;
                        }
                      });

    // Exit loop
    newsBlocks.exit().remove();

    // Update loop
    newsBlocks.select('.content').html(function(d) {
      var htmlCode = '<a href="'+ d.url + '" target="_blank">' + d.title + '</a>';
      return htmlCode;
    });
    newsBlocks.select('.time').html(function(d) { return d.clock.substr(0, 5); });
    newsBlocks.select('.mood-change').html(function(d) {
      if (d.newsMood == 0)
        return d.newsMood;
      else
        return d.sent + d.newsMood;
    });
    newsBlocks.select('.source').html(function(d){ return '来自' + d.source; });
  },
  updatePressByTime: function(model) {
    var newsBlockTemplate = '<div class="content">{{title}}</div><div class="sentiment-news"><span class="label">心情分数</span><span class="mood-change">{{newsMood}}</span></div><div class="time-and-source"><div class="time">{{time}}</div><div class="source">来自{{source}}</div></div>';
    var timeBlockTemplateForecast = '<div class="calendar-and-date"><span class="calendar"></span><span class="date">{{date}}</span><span class="predict-text">预测</span><span class="arrow-sign"></span><span class="number-of-msg">共{{length}}条新闻</span></div><div class="news-blocks"></div>';
    var timeBlockTemplateRealTime = '<div class="calendar-and-date"><span class="calendar"></span><span class="date">{{date}}</span><span class="arrow-sign"></span><span class="number-of-msg">共{{length}}条新闻</span></div><div class="news-blocks"></div>';

    // CREATE TIME BLOCKS
    var timeBlock = d3.select('#press-by-time')
                      .selectAll('div')
                      .data(model.pressByTime);

    timeBlock.enter().append('div')
                     .attr("id", function(d) { return "time" + d.dateClock.replace(/(-|:|\s)+/g, ''); })
                     .attr("class", "time-block")
                     .html(function(d) {
                      if (d.isRealTime)
                        return timeBlockTemplateRealTime;
                      else
                        return timeBlockTemplateForecast;
                     });

    timeBlock.exit().remove();

    timeBlock.select('.date').html(function(d) { return d.dateClock; });

    // SET TIME BLOCKS
    var lengthOfArray = model.pressByTime.length;

    for (var i = 0; i < lengthOfArray; i++) {
      var timeBlockString = '#time' + model.pressByTime[i].dateClock.replace(/(-|:|\s)+/g, '');
      var newsBlocksString = timeBlockString + ' .news-blocks';
      var numberOfMsgString = timeBlockString + ' .number-of-msg';

      // SET NUMBER OF MSG IN EACH TIME BLOCK
      $(numberOfMsgString).html("共" + model.pressByTime[i].list.length + "条新闻");

      // CREATE NEWS BLOCKS INSIDER EACH TIME BLOCK
      var newsBlocks = d3.select(newsBlocksString)
                         .selectAll('div')
                         .data(model.pressByTime[i].list);

      newsBlocks.enter().append('div')
                        .attr("class", function(d) {
                          if (d.newsMood == 0)
                            return "news-block neutral";
                          if(d.sent === '+')
                            return "news-block rise";
                          else
                            return "news-block fall";
                        })
                        .html(newsBlockTemplate);

      newsBlocks.exit().remove();

      newsBlocks.select('.content').html(function(d) {
        var htmlCode = '<a href="'+ d.url + '" target="_blank">' + d.title + '</a>'
        return htmlCode;
      });
      newsBlocks.select('.time').html(function(d){ return d.clock.substr(0, 5); });
      newsBlocks.select('.mood-change').html(function(d){
        if (d.newsMood == 0)
          return d.newsMood;
        else
          return d.sent + d.newsMood;
      });
      newsBlocks.select('.source').html(function(d){ return "来自" + d.source; });
    }

    this.setTimebarListener();
  },
  setTimebarListener: function() {
    var self = this;

    $('#press-by-time .calendar-and-date').click(function() {
      var $thisObject = $(this);

      if ($thisObject.hasClass("news-collapsed")) {
        $thisObject.removeClass("news-collapsed");

        $thisObject.siblings().show();
      }
      else {
        $thisObject.addClass("news-collapsed");

        $thisObject.siblings().hide();
      }
    });
  },
  init: function() {
    this.initNewsTabs();
    this.updateView();
  },
  updateView: function(){
    var self = this;
    $.when(RightPanelModel.getAllPressAsync(), RightPanelModel.getPressByTimeAsync())
     .done(function(allPress, pressByTime) {
      if(!RightPanelModel.error.getAllPressError)
        self.updateAllPress(RightPanelModel.model);
      else {
        $('#all-press .calendar-and-date').remove();
        $('#all-press').html('<div class="empty-data-right-panel">网络太不给力了，请<a href="javascript:window.location.reload();">重新加载</a>看看...</div>');
      }

      if(!RightPanelModel.error.getPressByTimeError)
        self.updatePressByTime(RightPanelModel.model);
      else
        $('#press-by-time').html('<div class="empty-data-right-panel">网络太不给力了，请<a href="javascript:window.location.reload();">重新加载</a>看看...</div>');

      $('#news-view .panel-loader-wrapper').remove();
      $('#news-tabs').show();
    });
  },
  initNewsTabs: function() {
    var showTab = 1; // show the first tab by default
    var $defaultLi = $('ul#news-tabs li').eq(showTab).addClass('active');
    $($defaultLi.find('a').attr('href')).siblings().hide();
    $('ul#news-tabs li').click(function() {
      var $this = $(this), clickTab = $this.find('a').attr('href');

      $this.addClass('active');
      $this.siblings('.active').removeClass('active');

      $(clickTab).show();
      $(clickTab).siblings().hide();

      return false;
    });
  }
}
