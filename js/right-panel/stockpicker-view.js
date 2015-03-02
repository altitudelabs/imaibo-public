/**
 * StockpickerView renders view for stockpicker tab
 */
var stockpickerView = {
  loaderTimer: 0,

  /**
   * init() inits stockpicker view
   */
	init: function(){
    this.renderStockpickerView(true);
  },

  /**
   * canFindStockFromList() returns true if stockId exists in list
   */
  canFindStockFromList: function(stockId) {
    var lengthOfStocks = RightPanelModel.model.stock.list.length;

    for (var i = 0; i < lengthOfStocks; i++) {
      if (RightPanelModel.model.stock.list[i].stockId == stockId)
        return true;
    }

    return false;
  },

  /**
   * updateStockpickerSettingsPanel() updates content for stockpicker settings panel
   */
  updateStockpickerSettingsPanel: function(addPanelStocks, addPanelStockGroupName) {
    var self = this;
    var numberOfTable = addPanelStocks.length;

    for (var i = 0; i < numberOfTable; i++) {
      $('#stocktable' + (i + 2) + '-name').html(addPanelStockGroupName[i]);

      var template;
      if (i == 0)
        template = '<td class="add-stock-name white"></td><td class="add-stock-price"></td><td class="add-stock-change"></td><td class="add-stock-change-ratio"></td>';
      else
        template = '<td class="add-stock-name"></td><td class="add-stock-price"></td><td class="add-stock-change"></td><td class="add-stock-change-ratio"></td><td class="add-stock-button"><span class="not-selected"></span></td>';

      var selectorName = '#stocktable' + (i + 1) + ' tbody';

  	  if(LteIE9){
  		   var data = addPanelStocks[i];
  		   var $table = $(selectorName),
  			   $rows = $(selectorName + ' tr'),
  			   rowsToAdd = data.length - $rows.length;

  		   for (var j = 0; j < rowsToAdd; j++) {
  			   var tr = '<tr class='
  			   var d = data[j];
  			   if(d.pxchg == 0){
  				   tr += '"add-security-row neutral"';
  			   }else if(d.sign === '+'){
  				   tr += '"add-security-row rise"';
  			   }else {
  				   tr += '"add-security-row fall"';
  			   }
  			   tr += '>';
  			 $table.append(tr + template + '</tr>');
  		   }
  	  }

      var stockTable = d3.select(selectorName)
                       .selectAll('tr')
                       .data(addPanelStocks[i]);

	    if(!LteIE9){
		    stockTable.enter().append('tr')
          .attr("class", function(d) {
            if (d.pxchg == 0)
              return "add-security-row neutral";
            if (d.sign === '+')
              return "add-security-row rise";
            else
              return "add-security-row fall";
          })
          .html(template);
	    }

      // Exit loop
      stockTable.exit().remove();

      // Update loop
      if (i == 0)
        stockTable.select('.add-stock-name').html(function(d) { return d.stockName; });
      else
        stockTable.select('.add-stock-name').html(function(d) {
          var htmlCode = '<a href="'+ d.url + '" target="_blank" class="white">' + d.stockName + '</a>'
          return htmlCode;
        });
      stockTable.select('.add-stock-price').html(function(d) { return d.lastpx; });
      stockTable.select('.add-stock-change').html(function(d) { return d.pxchg; });
      stockTable.select('.add-stock-change-ratio').html(function(d) { return d.pxchgratio; });
      if (typeof _MID_ !== 'undefined' && _MID_ !== 0 && _MID_ !== '') { // if logged in
        stockTable.select('.add-stock-button span').attr('class', function(d) {
          if (self.canFindStockFromList(d.stockId))
            return 'selected ' + 'Id' + d.stockId;
          else
            return 'not-selected ' + 'Id' + d.stockId;
        });
      }
      stockTable.select('.add-stock-button span').on('click', function(d) {
        if (typeof _MID_ === 'undefined' || _MID_ === 0 || _MID_ === '') {
          login_show();
        }
        else {
          // display the loader if request not processed within 0.5s
          var timer = setTimeout(function() {
            $('#alert-box').html('<div class="add-delete-stock-loader"></div>')
                           .stop(true, true)
                           .fadeIn();
          }, 500);
          var selectorName = '.add-stock-button span.Id' + d.stockId;
          var spanObjects = d3.selectAll(selectorName); // select all elements with that stockId so as to change all their buttons
          var thisSpanObject = d3.select(this);

          var errorHandler = function(errorObject) {
            clearTimeout(timer);

            $('#alert-box').html(errorObject.msg)
                           .stop(true, true)
                           .fadeIn('slow')
                           .fadeOut(3000);
          };

          var AddSuccessHandler = function() {
            clearTimeout(timer);

            spanObjects.classed("not-selected", false);
            spanObjects.classed("selected", true);

            self.renderStockpickerView(false);

            $('#alert-box').html("已添加自选股")
                           .stop(true, true)
                           .fadeIn('slow')
                           .fadeOut(3000);
          };

          var DeleteSuccessHandler = function() {
            clearTimeout(timer);

            spanObjects.classed("not-selected", true);
            spanObjects.classed("selected", false);

            self.renderStockpickerView(false);

            $('#alert-box').html("已移除自选股")
                           .stop(true, true)
                           .fadeIn('slow')
                           .fadeOut(3000);
          };

          if (thisSpanObject.classed("selected"))
            RightPanelModel.deleteStock(d.stockId, DeleteSuccessHandler, errorHandler);
          if (thisSpanObject.classed("not-selected"))
            RightPanelModel.addStock(d.stockId, AddSuccessHandler, errorHandler);
        }
      });
    }
  },

  /**
   * initStockpickerSettingsPanel() inits stockpicker settings panel, gets data from API and updates view
   */
  initStockpickerSettingsPanel: function() {
    var self = this;
    self.initSettingsPanelOptionListener();

    $.when(
      RightPanelModel.getIndexStocksAsync(),
      RightPanelModel.getCggsStocksAsync(),
      RightPanelModel.getHotStocksAsync(),
      RightPanelModel.getMarketStocksAsync())
     .done(function(indexStocks, cggsStocks, hotStocks, marketStocks) {
      $('#add-panel-loader').remove();

      var error = RightPanelModel.error.getAddPanelStocksError;
      if(!error) {
        self.updateStockpickerSettingsPanel(RightPanelModel.model.addPanelStocks, RightPanelModel.model.addPanelStockGroupName);
      }
    });
  },

  /**
   * updateSearchResult() gets autocomplete results from API and updates view
   */
  updateSearchResult: function(key) {
    var self = this;

    // if no results within 0.5 seconds, show loader
    // clearTimeout in callback function of getJson
    self.loaderTimer = setTimeout(function() {
      $( "#search-result" ).html('<span id="search-load"></span>');
    }, 500);

    var successHandler = function(searchResult) {
      clearTimeout(stockpickerView.loaderTimer);
      $( "#search-load" ).remove();
      $( ".search-empty" ).remove();

      var template = '<span class="stock-name"></span><span class="ticker"></span><span class="not-selected search-add-stock-button"></span>';

      var searchBlocks = d3.select('#search-result')
                           .selectAll('div')
                           .data(searchResult); // model.stock = data

      // Enter loop
      searchBlocks.enter().append('div')
                          .attr("class", "search-block")
                          .html(template);

      // Exit loop
      searchBlocks.exit().remove();

      // Update loop
      searchBlocks.select('.stock-name').html(function(d){
        return '<a href="' + d.url + '" target="_blank">' + d.stockName + '</a>';
      });
      searchBlocks.select('.ticker').html(function(d){ return '(SZ' + d.stockCode + ")"; });
      if (typeof _MID_ !== 'undefined' && _MID_ !== 0 && _MID_ !== '') { // if logged in
        searchBlocks.select('.search-add-stock-button').attr('class', function(d) {
          if (self.canFindStockFromList(d.stockId))
            return 'selected search-add-stock-button';
          else
            return 'not-selected search-add-stock-button';
        });
      }
      searchBlocks.select('.search-add-stock-button').on('click', function(d) {
        if (typeof _MID_ === 'undefined' || _MID_ === 0 || _MID_ === '') {
          login_show();
        }
        else {
          var selectorName = '.add-stock-button span.Id' + d.stockId;
          var AddPanelSpanObjects = d3.selectAll(selectorName); // select all elements with that stockId so as to change all their buttons
          var thisSpanObject = d3.select(this);

          var errorHandler = function(errorObject) {
            $('#alert-box').html(errorObject.msg)
                           .fadeIn("slow")
                           .fadeOut(3000);
          };

          var AddSuccessHandler = function() {
            AddPanelSpanObjects.classed("not-selected", false);
            AddPanelSpanObjects.classed("selected", true);

            thisSpanObject.classed("not-selected", false);
            thisSpanObject.classed("selected", true);

            self.renderStockpickerView(false);

            $('#alert-box').html("已添加自选股")
                           .stop(true, true)
                           .fadeIn("slow")
                           .fadeOut(3000);
          };

          var DeleteSuccessHandler = function() {
            AddPanelSpanObjects.classed("not-selected", true);
            AddPanelSpanObjects.classed("selected", false);

            thisSpanObject.classed("selected", false);
            thisSpanObject.classed("not-selected", true);

            self.renderStockpickerView(false);

            $('#alert-box').html("已移除自选股")
                           .stop(true, true)
                           .fadeIn("slow")
                           .fadeOut(3000);
          };

          if (thisSpanObject.classed("selected"))
            RightPanelModel.deleteStock(d.stockId, DeleteSuccessHandler, errorHandler);
          if (thisSpanObject.classed("not-selected"))
            RightPanelModel.addStock(d.stockId, AddSuccessHandler, errorHandler);
        }
      });
    };

    var failHandler = function(code) {
      clearTimeout(stockpickerView.loaderTimer);
      $( "#search-load" ).remove();

      if (code === 0) // 0 = not found, 1 = no keywords, others = other errors
        $('#search-result').html('<div class="search-empty">没有结果</div>');
      else if (code === 1)
        $('#search-result').html('<div class="search-empty">请输入关键词</div>');
      else
        $('#search-result').html('<div class="search-empty">暂时无法下载数据，请稍后再试</div>');
    };

    RightPanelModel.getSearchResult(key, successHandler, failHandler);

    $('#search-result').css('display', 'block');
  },

  /**
   * initStockpickerSearchAutocomplete()
   */
  initStockpickerSearchAutocomplete: function() {
    var self =  this;

    $('#stock-search').on('input propertychange paste focus', function() {
      var key = $('#stock-search').val();

      if (key)
        self.updateSearchResult(key);
      else
        $('#search-result').css('display', 'none');
    });

    $('#search-button').on('click', function() {
        self.updateSearchResult($('#stock-search').val());
    });

    $(document).mouseup(function(e) {
      var $searchWrapper = $('#search-wrapper');

      // if the target of the click isn't the container nor a descendant of the container
      if (!$searchWrapper.is(e.target) && $searchWrapper.has(e.target).length === 0)
        $('#search-result').css('display', 'none');
    });
  },

  /**
   * renderStockpickerView()
   */
  renderStockpickerView: function(initial) {
    var self = this;
    var stock = RightPanel.states.chooseStockView;

    var successHandler = function(model) {
      if (initial) {
        self.updateStockpickerView(model);

        if (model.stock.isLogin) {
          self.hideStockpickerLoginPanel();
        }
        else {
          $('#login').click(function() {
            if (typeof _MID_ === 'undefined' || _MID_ === 0 || _MID_ === '') {
              login_show();
            }
          });
        }

        $('#stockpicker-view .panel-loader-wrapper').remove();

        self.initStockpickerSettingsPanel();
        self.initStockpickerSearchAutocomplete();
        self.refreshStockpickerView();
      }
      else {
        self.updateStockpickerView(model);
      }
    };

    var errorHandler = function(model) {
      $('#stock-table tbody').html('<tr class="empty-data-right-panel"><td colspan="5">网络太不给力了，请<a href="javascript:window.location.reload();">重新加载</a>看看...</td></tr>');
      $('#stockpicker-view .panel-loader-wrapper').remove();
    };

    RightPanelModel.getStockData(successHandler, errorHandler);
  },

  /**
   * hideStockpickerLoginPanel()
   */
  hideStockpickerLoginPanel: function() {
    $('#stock-login').remove();
    $('#suggestion').remove();
  },

  /**
   * updateStockpickerView()
   */
  updateStockpickerView: function(model) {
    var self = this;

    if (model.stock.list.length == 0) {
      $('#stockpicker-table-body').html('<tr><td colspan="5" style="text-align:center;">暂无自选股</td></tr>');
      self.noStocks = true;
      return;
    }
    else if (self.noStocks == true) {
      $('#stockpicker-table-body').empty();
      self.noStocks = false;
    }

	  var template = '<td><div class="indicator"></div></td>'                               +
                   '<td class="zxg-ticker"><a href="{{stockUrl}}">{{stockName}}</a></td>' +
                   '<td class="zxg-price">{{lastpx}}</td>'                                +
                   '<td class="zxg-price-change-abs">{{pxchg}}</td>'                      +
                   '<td class="zxg-price-change-rel">{{pxchgratio}}</td>';

	  var tableID = '#stockpicker-table-body';
	  var table = Helper.enterLoop(tableID, model.stock.list, template, LteIE9);


    // Exit loop
    table.exit().remove();

    // Update loop
    table.attr('class', function(d) {
      if (d.sign === '+'){
        return 'rise';
      }
      else if (d.sign === '-') {
        return 'fall';
      }
      else {
        return 'neutral';
      }
    });
    table.select('.zxg-ticker').html(function(d) {
      return '<a href="' + d.stockUrl + '" target="_blank" class="white">' + d.stockName + '</a>';
    });
    table.select('.zxg-price').html(function(d){ return d.lastpx; });
    table.select('.zxg-price-change-abs').html(function(d){ return d.pxchg; });
    table.select('.zxg-price-change-rel').html(function(d){ return d.pxchgratio; });
  },

  /**
   * updateStockDataOnly()
   */
  updateStockDataOnly: function() {
    var self = this;

    var successHandler = function(model) {
      if (model.stock.list.length == 0) {
        $('#stockpicker-table-body').html('<tr><td colspan="5" style="text-align:center;">暂无自选股</td></tr>');
        self.noStocks = true;
        return;
      }
      else if (self.noStocks == true) {
        $('#stockpicker-table-body').empty();
        self.noStocks == false;
      }

      var template = '<td><div class="indicator"></div></td>' +
                    '<td class="zxg-ticker"><a href="{{stockUrl}}">{{stockName}}</a></td>' +
                    '<td class="zxg-price">{{lastpx}}</td>' +
                    '<td class="zxg-price-change-abs">{{pxchg}}</td>' +
                    '<td class="zxg-price-change-rel">{{pxchgratio}}</td>';

      var table = d3.select('#stockpicker-table-body')
                    .selectAll('tr')
                    .data(model.stock.list); // model.stock = data

      // // Enter loop
      table.enter().append('tr')
                   .html(template);

      // Exit loop
      table.exit().remove();

      // Update loop
      table.attr('class', function(d) {
        if (d.sign === '+') {
          return 'rise';
        }
        else if (d.sign === '-') {
          return 'fall';
        }
        else {
          return 'neutral';
        }
      });

      table.select('.zxg-ticker').html(function(d) {
        return '<a href="' + d.stockUrl + '" target="_blank" class="white">' + d.stockName + '</a>';
      });
      table.select('.zxg-price').html(function(d){ return d.lastpx; });
      table.select('.zxg-price-change-abs').html(function(d){ return d.pxchg; });
      table.select('.zxg-price-change-rel').html(function(d){ return d.pxchgratio; });
    }

    var errorHandler = function(model) {
      $('#stock-table tbody').html('<tr class="empty-data-right-panel"><td colspan="5">网络太不给力了，请<a href="javascript:window.location.reload();">重新加载</a>看看...</td></tr>');
    };

    RightPanelModel.getStockData(successHandler, errorHandler);
  },

  /**
   * refreshStockpickerView() refresh stockpicker view at a set interval
   */
  refreshStockpickerView: function() {

    var self = this;
    var refreshRate = 5000;
    if (!IE8) {
      setInterval(function(){ self.updateStockDataOnly(); }, refreshRate);
    }
  },

  /**
   * initSettingsPanelOptionListener() inits the inner menu for settings panel
   * When the item in the add panel (e.g 指数) is hovered, the first li and the corresponding stock table is shown
   */
  initSettingsPanelOptionListener: function() {
    $('.add-panel-item > div').hover(
      function() {
        $('.add-panel-item .add-panel-sub-item:first-child').addClass('active');
      },
      function() {
        $('.add-panel-item .add-panel-sub-item:first-child').removeClass('active');
      }
    );
  }
}
