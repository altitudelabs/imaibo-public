var expertsView = {
	init: function() {
    var self = this;

    $.when(RightPanelModel.getExpertHeadlineAsync(), RightPanelModel.getExpertDataAsync())
     .done(function(headlineModel, model) {
      var experts = RightPanel.states.expertsView;
      var error = RightPanelModel.error.expertError || RightPanelModel.error.expertHeadlineError;

      if(!error) {
        // Populate views
        Helper.populateView($('#experts-view .scroller'), experts.template, RightPanelModel.model.experts);
        Helper.populateView(experts.modalEl, experts.modalTemplate, RightPanelModel.model.experts);

        // Init experts modal
        $('.experts-header').leanModal({ closeButton: '.modal-close', modalId: '#experts-modal' });

        // Init like comments action
        $('.experts-like-action').click(function(e) {
          e.preventDefault();
          var weiboId = $(e.target).attr('name');

          // If user not logged in, show login panel
          if (typeof _MID_ === 'undefined' || _MID_ === 0 || _MID_ === '') {
            login_show();
          }
          else {
            // Otherwise, like comment
            RightPanelModel.likeCommentAsync(weiboId)
            .then(function(code) {
              // code = 0, successfull; = others, liked once, not login or other errors
              // only if not liked before, increase the count by one
              if (code === 0) {
                var content = $(e.target).html();
                var likes = parseInt(content.match(/[^()]+(?=\))/g));
                likes++;
                $(e.target).html('赞(' + likes + ')');
              }
            }, function(res) {
              // handle error
            });
          }

        });
      }
      else {
        $('#experts-view').html('<div class="empty-data-right-panel">网络太不给力了，请<a href="javascript:window.location.reload();">重新加载</a>看看...</div>');
      }
    });
  }
}