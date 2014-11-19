var Toolbar = {
  el: '#toolbar',
  init: function(){
    this.initDropdown();
  },
  initDropdown: function(){
    var dropdownMenu = $('.dropdown-menu');
    $('.link-dropdown').on('mouseenter', function(){
      console.log('initDropdown');
      dropdownMenu.css('display', 'block');
    }).on('mouseleave', function(){
      dropdownMenu.css('display', 'none');
    });
  }
};