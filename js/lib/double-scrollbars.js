var DoubleScrollbars = {
  start: function() {
    this.displayScrollbar('#news-view', '.scroller', '.scroller__bar', true);
    this.displayScrollbar('#experts-view', '.scroller', '.scroller__bar', true);
    this.displayScrollbar('#stockpicker-scroller-wrap', '.scroller', '.scroller__bar', true);
    this.displayScrollbar('body', '.outer-scroller', '.outer-scroller__bar', false);
  },
  displayScrollbar: function(root, scroller, bar, setListener) {
    var params = {
      root: root,
      scroller: scroller,
      bar: bar,
      barOnCls: 'baron'
    };

    baron(params);

    // show scrollbar only while hovering the corr view
    if (setListener) {
      var scrollbarSelector = root + ' ' + bar;

      $(root).hover(
        function() { $(scrollbarSelector).show(); },
        function() { $(scrollbarSelector).hide(); }
      );
    }
  }
};
