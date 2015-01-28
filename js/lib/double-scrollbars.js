var DoubleScrollbars = {
  start: function() {
    this.displayScrollbar('#news-view', '.scroller', '.scroller__bar');
    this.displayScrollbar('#experts-view', '.scroller', '.scroller__bar');
    this.displayScrollbar('#stockpicker-view', '.scroller', '.scroller__bar');
  },
  displayScrollbar: function(root, scroller, bar) {
    var params = {
      root: root,
      scroller: scroller,
      bar: bar,
      barOnCls: 'baron'
    };

    baron(params);

    // show scrollbar only while hovering the corr view
    var scrollbarSelector = root + ' ' + bar;
    $(root).hover(
      function() { $(scrollbarSelector).fadeIn(); },
      function() { $(scrollbarSelector).fadeOut(); }
    );
  }
};
