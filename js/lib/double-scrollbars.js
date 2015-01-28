var DoubleScrollbars = {
  start: function() {
    this.displayScrollbar('#news-view', '.scroller', '.scroller__bar');
    this.displayScrollbar('#experts-view', '.scroller', '.scroller__bar');
    this.displayScrollbar('#stockpicker-view', '.scroller', '.scroller__bar');
    this.displayScrollbar('.outer', '#outer-scroller', '#outer-scroller__bar');
  },
  displayScrollbar: function(root, scroller, bar) {
    var params = {
      root: root,
      scroller: scroller,
      bar: bar,
      barOnCls: 'baron'
    };

    baron(params);
  }
};
