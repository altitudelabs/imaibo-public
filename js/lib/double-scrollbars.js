/**
 * DoubleScrollbars inits cross browser scrollbars (using baron.js) for the sentiment index
 */
var DoubleScrollbars = {

  /**
   * start() inits all scrollbars in app
   */
  start: function() {
    this.displayScrollbar('#news-view', '.scroller', '.scroller__bar', true);
    this.displayScrollbar('#experts-view', '.scroller', '.scroller__bar', true);
    this.displayScrollbar('#stockpicker-scroller-wrap', '.scroller', '.scroller__bar', true);
    this.displayScrollbar('body', '.outer-scroller', '.outer-scroller__bar', false);
  },

  /**
   * displayScrollbar() is a helper method that inits a single scrollbar
   *
   * @param root is the element where scrollbar should be applied
   * @param scroller is the element that contains content that needs to be scrollable
   * @param bar is the scollbar element
   * @param setListener is a boolean; if set to true, scrollbar only shows when cursor is hovered on scroller element
   */
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
